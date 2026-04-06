import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-service";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo." }, { status: 400 });
    }

    const supabase = createServiceClient();
    
    // Convert File to ArrayBuffer and then to Buffer for Supabase
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const fileName = `${uniqueId}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "")}`;
    
    // Upload standard buffer
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Storage error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: "Error procesando el archivo" }, { status: 500 });
  }
}
