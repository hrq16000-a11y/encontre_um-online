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
- description: A brief description of the business based on what you can infer

Return ONLY a valid JSON object with these fields. Use null for any field you cannot find.
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
              text: "Extract all business information from this business card image. Return only the JSON object.",
            },
          ],
        },
      ],
      system: systemPrompt,
      maxTokens: 1000,
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
