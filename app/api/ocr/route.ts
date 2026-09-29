import { createClient } from "@/lib/supabase/server";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const systemPrompt = `You are an AI assistant that extracts business card information from images.
Extract the following fields from the business card image:
- business_name: The name of the business or company
- owner_name: The name of the person on the card
- phone: Phone number (format: just numbers)
- whatsapp: WhatsApp number if different from phone (format: just numbers)
- email: Email address
- website: Website URL
- address: Full address
- city: City name
- state: State abbreviation (e.g., SP, RJ, MG)
- description: A short description ONLY if the card explicitly states the business activity or services. Otherwise use null

Return ONLY a valid JSON object with these fields. Use null for any field you cannot find explicitly in the image.
Never infer, guess, complete, embellish, or invent business facts, services, addresses, names, or contact data.
Do not include any markdown formatting or code blocks in your response.

Example response:
{"business_name":"Dentista Silva","owner_name":"Dr. João Silva","phone":"11999887766","whatsapp":"11999887766","email":"contato@dentistasilva.com.br","website":"www.dentistasilva.com.br","address":"Rua das Flores, 123","city":"São Paulo","state":"SP","description":"Clínica odontológica especializada em implantes e ortodontia."}`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;
    
    if (!image) {
      return NextResponse.json({ error: "Imagem não fornecida" }, { status: 400 });
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(image.type)) {
      return NextResponse.json(
        { error: "Formato não suportado. Use JPG, PNG ou WebP." },
        { status: 415 },
      );
    }

    const maxBytes = 5 * 1024 * 1024;
    if (image.size <= 0 || image.size > maxBytes) {
      return NextResponse.json(
        { error: "A imagem deve ter no máximo 5 MB." },
        { status: 413 },
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = image.type || "image/jpeg";

    // Use AI to extract text from image
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: `data:${mimeType};base64,${base64Image}`,
            },
            {
              type: "text",
              text: "Extract only business information explicitly visible in this image. Do not infer missing facts. Return only the JSON object.",
            },
          ],
        },
      ],
      system: systemPrompt,
      maxOutputTokens: 1000,
    });

    // Parse the response
    let extractedData;
    try {
      // Clean the response in case it has markdown formatting
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
      extractedData = JSON.parse(cleanedText);
    } catch {
      return NextResponse.json(
        { error: "Não foi possível processar a imagem. Tente uma foto mais clara." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json(
      { error: "Erro ao processar imagem" },
      { status: 500 }
    );
  }
}
