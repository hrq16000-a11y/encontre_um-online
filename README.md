# EncontreUm.online

Portal para transformar intenção real em valor econômico: buscas, leads, cadastros de oferta, contatos e dados de crescimento.

## Produção

- Site: https://www.encontreum.online
- GitHub: fonte de verdade
- Vercel: build e produção
- Supabase: dados transacionais
- v0: apoio visual/prototipação quando útil
- Lovable: fora do fluxo padrão

## Fluxo de desenvolvimento

Mudanças não triviais seguem:

1. branch curta;
2. implementação mínima útil;
3. typecheck;
4. gates de domínio e links internos;
5. build;
6. pull request;
7. merge somente com CI verde;
8. validação em produção.

Leia antes de alterar:
- `AGENTS.md`
- `docs/ENCONTREUM_REVENUE_ENGINE.md`
- `docs/ECOSYSTEM_AUTOPILOT.md`

## Saúde

Endpoint:

`GET /api/health`

Ele verifica configuração pública necessária e conectividade com o Supabase sem revelar credenciais ou dados privados.

## Princípios

- não inventar empresas, profissionais, reviews ou métricas;
- não criar páginas SEO finas em massa;
- capturar demanda quando ainda não houver oferta;
- usar dados reais para decidir expansão;
- GitHub é a fonte de verdade;
- automação economy-first e orientada a eventos.
