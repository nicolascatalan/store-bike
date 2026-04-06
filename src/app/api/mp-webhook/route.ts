import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createServiceClient } from "@/lib/supabase-service";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

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
    const status = paymentData.status; // approved, rejected, pending

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceClient();

    let orderStatus: "pagado" | "pendiente" | "cancelado" = "pendiente";
    if (status === "approved") orderStatus = "pagado";
    else if (status === "cancelled" || status === "rejected") orderStatus = "cancelado";

    await supabase
      .from("orders")
      .update({ status: orderStatus })
      .eq("id", orderId);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
