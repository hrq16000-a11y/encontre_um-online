# AGENTS.md — EncontreUm.online

Este arquivo define regras obrigatórias para qualquer agente humano ou de IA que altere este repositório.

## Missão

O EncontreUm.online existe para transformar intenção real em valor econômico:
tráfego qualificado, leads, cadastros de oferta, contatos, receita e dados que
indiquem onde crescer.

O projeto não é apenas um diretório.

## Fonte de verdade

- GitHub é a fonte de verdade.
- `main` representa o estado integrado.
- Vercel é o ambiente de deploy.
- Supabase é o banco transacional.
- v0 pode ser usado como apoio visual/prototipação.
- Lovable não faz parte do fluxo padrão.
- Não usar Lovable Max sem autorização explícita.

## Fluxo obrigatório

Para mudanças não triviais:

1. ler este arquivo e `docs/ENCONTREUM_REVENUE_ENGINE.md`;
2. inspecionar o estado atual antes de editar;
3. criar branch curta e específica;
4. implementar a menor mudança útil;
5. executar build/testes;
6. abrir PR;
7. somente mergear com CI verde;
8. validar o deploy e o comportamento real em produção quando disponível.

Não editar `main` diretamente para mudanças funcionais.

## Regras de dados e confiança

É proibido:

- inventar empresas, profissionais ou prestadores;
- criar avaliações/depoimentos fictícios;
- criar números de usuários, clientes, buscas, visualizações ou contatos falsos;
- afirmar liderança, tamanho ou cobertura sem evidência;
- usar seed de demonstração como conteúdo de produção;
- criar credencial administrativa hardcoded;
- aceitar `role=admin` do cliente;
- permitir autoaprovação de anúncios ou reviews.

Categorias/taxonomias podem existir sem oferta cadastrada, desde que não sejam
apresentadas como prova de disponibilidade.

## SEO

- Canonical de produção: `https://www.encontreum.online`.
- Páginas de busca/filtros não devem ser indexadas automaticamente.
- Não gerar páginas programáticas finas para inflar sitemap.
- Só indexar páginas que tenham conteúdo real, útil e diferenciável.
- Não criar cidade×serviço em massa sem oferta, demanda ou conteúdo suficiente.
- Sitemap deve conter somente URLs canônicas qualificadas.
- Dados estruturados devem refletir fatos presentes na página.

## Receita e crescimento

Priorizar funcionalidades que façam pelo menos uma destas coisas:

- capturar intenção;
- captar lead;
- aumentar oferta real;
- gerar contato/conversão;
- medir demanda;
- medir receita;
- gerar tráfego útil;
- habilitar monetização sustentável.

Usar dados de `search_events`, `demand_requests`, `analytics_events` e
`listings` para decidir expansão.

## IA

Política economy-first:

- regra determinística antes de IA quando entregar resultado equivalente;
- IA deve ter função clara e mensurável;
- limitar tokens e chamadas;
- nunca expor chave de API ao cliente;
- não usar IA para fabricar fatos, reviews, empresas ou prova social;
- agentes futuros devem ser event-driven, não loops contínuos consumindo tokens.

Ver `docs/ECOSYSTEM_AUTOPILOT.md`.

## Segurança

- autorização crítica deve existir no banco/RLS, não apenas na interface;
- segredos nunca entram no Git;
- mudanças destrutivas de banco exigem revisão explícita;
- operações administrativas sensíveis exigem usuário autenticado e autorização;
- não criar endpoints públicos de setup/admin;
- preservar isolamento entre marcas e projetos do ecossistema.

## Autonomia futura

Agentes podem operar em três níveis:

- AUTO: leitura, monitoramento, análise, métricas, health checks, issues;
- AUTO + PR: mudanças de código via branch, CI e PR;
- APPROVAL REQUIRED: DNS/domínios, segredos, gasto relevante, exclusão/migração
  destrutiva, mudanças comerciais irreversíveis.

## Definição de pronto

Uma mudança só está concluída quando:

- código e banco estão consistentes;
- CI passou;
- não introduziu dado fictício;
- não abriu regressão de SEO, segurança ou funil;
- deploy foi verificado quando aplicável;
- métricas/telemetria relevantes existem quando a função afeta receita ou lead.

## Adoção visual de referências externas (17/11/2026)

- **TasteSkill** (https://www.tasteskill.dev/): usar como referência crítica de direção de arte, identidade, hierarquia e layout; preservar a marca e criar composição original.
- **Transitions.dev** (https://transitions.dev/): adotar microtransições CSS pontuais em menus, filtros, modais e feedback; respeitar teclado, foco, contraste e `prefers-reduced-motion`. Evitar `transition: all`.
- **React Bits** (https://reactbits.dev/): avaliar componentes React gratuitos individualmente e verificar licença MIT + Commons Clause, dependências e custo de hidratação. Sem instalação em massa ou uso de Pro não licenciado.
- **RiseClub** (https://riseclub.tech/): somente benchmark de comunidade, trilhas, notícias e engajamento; nunca copiar conteúdo, interface, imagens ou dados.
- Aplicação específica: Busca, cartões de oferta, filtros e cadastro. Não inventar prestadores, reviews ou indicadores; preservar dados reais, funis, conversão e segurança dos leads.
- Implementar em micro-PR própria, medir 390/1440 e preservar SEO, SSR (se houver), LCP, segurança, privacidade, funis e conteúdo factual. Nenhuma regra aqui autoriza mexer em produção, banco, RLS, DNS ou pagamentos.

## Seleção contextual de skills compartilhadas (20/11/2026)

Este repositório participa do repertório de métodos de desenvolvimento reutilizáveis; seus contratos locais, regras de dados, identidade e gates sempre prevalecem. **Usar todas as competências pertinentes**, não instalar todas as ferramentas nem introduzir efeitos gratuitos.
- **Reanimate** (https://github.com/NiazMorshed2007/reanimate): adaptar apenas o método de engenharia de motion — observar estados/tempo/easing, criar solução autoral com CSS/WAAPI ou lib já existente, comparar capturas; não baixar, executar ou incorporar runtime de terceiros.
- **Gists públicos de QA**: diagnosticar oclusão mobile/CTA com https://gist.github.com/tobiashochguertel/bf7bc60f8946c7ecbe0d14782b4a8c99 e planejar capturas 390/1440 com https://gist.github.com/michael-matias-2026/d80389dfa08f4db9c5cc6020adf911ce ; são referências, não código para copiar/executar sem licença e revisão.
- **Playwright/a11y**: testar teclado, foco, touch, `prefers-reduced-motion`, overflow, loading/erro e desempenho somente quando pertinentes, preferindo os testes existentes. Adoção de SQL/RLS requer autorização separada e apenas hipóteses verificadas contra PostgreSQL oficial; nunca executar SQL de Gists em produção.
- **Foco local:** jornada busca → lead → oferta real e crescimento verificável. Não criar motion que atrapalhe CTA/SSR, não afetar tráfego/indexação, Supabase/RLS ou métricas; seguir `docs/ENCONTREUM_REVENUE_ENGINE.md` e política economy-first.
- Em cada micro-PR registrar `USE/ADAPT/REJECT/NOT_APPLICABLE`, custo, risco, licença, evidências e gates efetivamente executados. Sem mudança de banco, dados, DNS, segurança, funis ou produção; sem Lovable Max ou instaladores externos automáticos.
