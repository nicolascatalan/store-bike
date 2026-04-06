import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createServiceClient } from "@/lib/supabase-service";
import { Resend } from "resend";
import PDFDocument from "pdfkit";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY);

function generateReceiptPDF(order: any, items: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(24).font("Helvetica-Bold").text("TiendaBici", { align: "center" });
      doc.fontSize(10).font("Helvetica").text("Boleta de Compra", { align: "center" });
      doc.moveDown(2);

      // Info
      doc.fontSize(12).font("Helvetica-Bold").text("Datos de la Orden:");
      doc.font("Helvetica").fontSize(11).text(`Orden ID: ${order.id}`);
      doc.text(`Cliente: ${order.customer_name}`);
      doc.text(`Email: ${order.customer_email}`);
      doc.text(`Fecha: ${new Date().toLocaleDateString("es-CL")}`);
      doc.text(`Dirección: ${order.shipping_address}`);
      doc.moveDown(2);

      // Items
      doc.font("Helvetica-Bold").text("Detalle de la compra:", { underline: true });
      doc.moveDown(0.5);
      
      items.forEach(item => {
        doc.font("Helvetica").text(`${item.quantity}x ${item.product_name} - $${item.unit_price.toLocaleString("es-CL")}`);
      });
      doc.moveDown();

      // Total
      doc.font("Helvetica-Bold").fontSize(14).text(`Total Pagado: $${order.total_price.toLocaleString("es-CL")} CLP`);
      doc.moveDown(3);

      doc.font("Helvetica").fontSize(10).fillColor("grey").text("Documento generado automáticamente.", { align: "center" });
      doc.fillColor("black").text("¡Gracias por confiar en TiendaBici!", { align: "center" });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // Solo procesar notificaciones de pago
    if (type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const payment = new Payment(mp);
    const paymentData = await payment.get({ id: data.id });

    const orderId = paymentData.external_reference;
    const status = paymentData.status;

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceClient();

    let orderStatus: "pagado" | "pendiente" | "cancelado" = "pendiente";
    if (status === "approved") orderStatus = "pagado";
    else if (status === "cancelled" || status === "rejected") orderStatus = "cancelado";

    // 1. Actualizar estado en Supabase
    await supabase
      .from("orders")
      .update({ status: orderStatus })
      .eq("id", orderId);

    // 2. Si fue aprobado, enviar correo con PDF
    if (orderStatus === "pagado" && process.env.RESEND_API_KEY) {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderData && orderData.customer_email) {
        
        // Cargar ítems
        const { data: items } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId);

        // Generar PDF
        let pdfBuffer: Buffer | null = null;
        try {
          pdfBuffer = await generateReceiptPDF(orderData, items || []);
        } catch(e) {
          console.error("No se pudo generar PDF", e);
        }

        // Armar Attachments
        const attachments = [];
        if (pdfBuffer) {
          attachments.push({
            filename: `Boleta_TiendaBici_${(orderId as string).substring(0,6)}.pdf`,
            content: pdfBuffer,
          });
        }

        await resend.emails.send({
          from: "TiendaBici <onboarding@resend.dev>",
          to: [orderData.customer_email],
          subject: "¡Pago Confirmado! Aquí tienes tu boleta - TiendaBici",
          attachments,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #c45200;">¡Hola, ${orderData.customer_name}!</h1>
              <p>Hemos recibido tu pago con éxito y tu pedido está totalmente confirmado.</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Número de orden:</strong> ${orderId}</p>
                <p><strong>Total:</strong> $${orderData.total_price.toLocaleString("es-CL")}</p>
                <p><strong>Dirección de envío:</strong> ${orderData.shipping_address}</p>
              </div>
              <p>Te hemos adjuntado la boleta electrónica de tu compra en este correo en formato PDF.</p>
              <p>Pronto recibirás otro correo con el número de seguimiento una vez se haya despachado tu paquete.</p>
              <p>¡Gracias por confiar en <strong>TiendaBici</strong>!</p>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
