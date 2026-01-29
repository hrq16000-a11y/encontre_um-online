import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createSampleListings } from "./createSampleListings"; // Import the createSampleListings function

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();
    
    // Simple protection - only allow with correct secret
    if (secret !== "setup-encontreum-admin-2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role key to create admin user
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const adminEmail = "admin@encontreum.com";
    const adminPassword = "admineu123";

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.some(
      (u) => u.email === adminEmail
    );

    if (adminExists) {
      // Update the profile to ensure admin role
      const existingAdmin = existingUsers?.users?.find(
        (u) => u.email === adminEmail
      );
      if (existingAdmin) {
        await supabaseAdmin.from("profiles").upsert({
          id: existingAdmin.id,
          full_name: "Administrador",
          role: "admin",
        });
      }
      return NextResponse.json({
        success: true,
        message: "Admin já existe. Role atualizada para admin.",
        credentials: {
          email: adminEmail,
          password: adminPassword,
        },
      });
    }

    // Create admin user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: "Administrador",
          role: "admin",
        },
      });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Create admin profile
    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert({
          id: authData.user.id,
          full_name: "Administrador",
          role: "admin",
        });

      if (profileError) {
        console.error("Profile error:", profileError);
      }

      // Create sample listings
      await createSampleListings(supabaseAdmin, authData.user.id);
    }

    return NextResponse.json({
      success: true,
      message: "Admin e negócios de exemplo criados!",
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Erro ao criar admin" },
      { status: 500 }
    );
  }
}
