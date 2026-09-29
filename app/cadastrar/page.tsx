import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BusinessRegistrationForm } from "@/components/business-registration-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastrar Negócio | Encontre Um",
  description: "Cadastre seu negócio em 30 segundos. Tire uma foto do seu cartão de visita e apareça nas buscas.",
};

export default async function RegisterBusinessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/cadastro");
  }

  // Get categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <BusinessRegistrationForm
      categories={categories || []}
      userId={user.id}
    />
  );
}
