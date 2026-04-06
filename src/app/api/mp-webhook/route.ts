import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createServiceClient } from "@/lib/supabase-service";
import { Resend } from "resend";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 2. Si fue aprobado, obtener datos de la orden y enviar correo
    if (orderStatus === "pagado" && process.env.RESEND_API_KEY) {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderData && orderData.customer_email) {
        await resend.emails.send({
          from: "TiendaBici <onboarding@resend.dev>",
          to: [orderData.customer_email],
          subject: "¡Pago Confirmado! - TiendaBici",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #c45200;">¡Hola, ${orderData.customer_name}!</h1>
              <p>Hemos recibido tu pago con éxito y tu pedido está confirmado.</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Número de orden:</strong> ${orderId}</p>
                <p><strong>Total:</strong> $${orderData.total_price.toLocaleString("es-CL")}</p>
                <p><strong>Dirección de envío:</strong> ${orderData.shipping_address}</p>
              </div>
              <p>Pronto recibirás otro correo con la información de despacho.</p>
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
