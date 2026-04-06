import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-service";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, shipping, total, skipMP } = body as {
      items: Array<{ id: string; name: string; price: number; quantity: number }>;
      customer: { name: string; email: string; phone: string };
      shipping: number;
      total: number;
      skipMP?: boolean;
    };

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.includes("http")) 
      ? process.env.NEXT_PUBLIC_APP_URL 
      : "https://tienda-bici.vercel.app";

    // 1. Crear la orden en Supabase como "pendiente"
    const supabase = createServiceClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        status: "pendiente",
        total,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return NextResponse.json({ error: "No se pudo crear el pedido" }, { status: 500 });
    }

    // 2. Insertar los items del pedido
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    await supabase.from("order_items").insert(orderItems);

    // 3. Agregar envío como ítem si aplica
    const mpItems = items.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "CLP",
    }));

    if (shipping > 0) {
      mpItems.push({
        id: "envio",
        title: "Costo de envío",
        quantity: 1,
        unit_price: shipping,
        currency_id: "CLP",
      });
    }

    if (skipMP) {
      return NextResponse.json({
        orderId: order.id,
      });
    }

    // 4. Crear preferencia en MercadoPago
    const preference = new Preference(mp);

    const back_urls = {
      success: `${appUrl}/checkout/success?order_id=${order.id}`,
      failure: `${appUrl}/checkout/failure?order_id=${order.id}`,
      pending: `${appUrl}/checkout/pending?order_id=${order.id}`,
    };

    // MercadoPago no acepta URLs locales (http://localhost) para el retorno automático.
    // Si estamos en localhost, enviamos una de prueba para que te permita ver la pantalla de pago.
    const isLocal = appUrl.includes("localhost");

    const result = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: customer.name,
          email: customer.email,
          phone: { number: customer.phone },
        },
        back_urls: isLocal ? undefined : back_urls,
        auto_return: isLocal ? undefined : "approved",
        external_reference: order.id,
        statement_descriptor: "TiendaBici",
        notification_url: isLocal ? undefined : `${appUrl}/api/mp-webhook`,
      },
    });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      orderId: order.id,
    });
  } catch (err) {
    console.error("MP preference error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
