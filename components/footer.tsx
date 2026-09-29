import Link from "next/link";

const footerLinks = {
  navegar: [
    { label: "Como funciona", href: "/como-funciona" },
    { label: "Para profissionais", href: "/para-profissionais" },
    { label: "Buscar", href: "/buscar" },
    { label: "Cadastrar negócio", href: "/cadastrar" },
    { label: "Entrar", href: "/auth/login" },
  ],
  categorias: [
    { label: "Eletricistas", href: "/buscar?category=eletricista" },
    { label: "Mecânicos", href: "/buscar?category=mecanico" },
    { label: "Encanadores", href: "/buscar?category=encanador" },
    { label: "Ver busca", href: "/buscar" },
  ],
  legal: [
    { label: "Termos de uso", href: "/termos" },
    { label: "Privacidade", href: "/privacidade" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground px-4 py-16 text-background sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                1
              </div>
              <span className="text-xl font-bold text-background">EncontreUm</span>
            </Link>
            <p className="text-sm text-background/60">
              Procure serviços, profissionais e negócios e registre sua demanda
              quando ainda não houver uma opção disponível.
            </p>
          </div>

          <FooterGroup title="Navegar" links={footerLinks.navegar} />
          <FooterGroup title="Categorias" links={footerLinks.categorias} />
          <FooterGroup title="Legal" links={footerLinks.legal} />
        </div>

        <div className="border-t border-background/10 pt-8">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} EncontreUm. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h4 className="mb-4 font-semibold text-background">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-background/60 transition-colors hover:text-background"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
