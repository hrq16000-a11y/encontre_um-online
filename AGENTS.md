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

## Padrão anti-site genérico — R8/10
- Para trabalho visual autorizado, ler `docs/skills/ANTI_GENERIC_EXPERIENCE.md` antes do código. A diretriz integra TasteSkill, Transitions.dev, React Bits e Emil Kowalski; não substitui as regras específicas deste repositório.

## Design engineering premium — Emil Kowalski (27/11/2026)

- Para qualquer trabalho visual autorizado, ler `docs/skills/EMIL_DESIGN_ENGINEERING.md` antes de editar runtime. Aplicar diagnóstico, direção de arte autoral, decisão de motion por frequência/propósito, performance, reduced motion e QA 390/768/1440; reaproveitar tokens e bibliotecas existentes.
- Referência oficial: https://github.com/emilkowalski/skills. As regras específicas deste repositório permanecem prioritárias. Esta documentação não autoriza execução automática de scripts, instalações, mudanças de código ou deploy.

## Padrão universal de contato e seleção contextual (27/11/2026)

- **Privacidade e identidade:** não publicar faixas decorativas de “Informações de contato” com e-mail operacional, cidade/endereço da operação, nome institucional antigo (Ping Soluções) ou cartões redundantes. Usar a marca própria do projeto e o canal/funil oficial existente. Não substituir a razão social por um nome inventado: aguardar a nova identidade confirmada. Distinguir informação promocional de identificação legal obrigatória, requisitos do comércio, privacidade/LGPD, endereço de cliente/loja autorizado e área geográfica de atendimento/SEO; preservar contratos e dados privados, sem alterar CNPJ, termos, integrações ou dados de terceiros por inferência.
- **Funil contextual em popup:** em CTAs de atendimento, orçamento, suporte, indicação ou cadastro, abrir o fluxo canônico sobre a página de origem (dialog/modal acessível, sheet no mobile quando adequado). Não navegar para uma página de contato como caminho comum. Preservar a rota e posição de scroll e capturar origem/posicionamento, especialidade, problema, objetivo, cidade/UF/bairro, modalidade/urgência apenas quando realmente conhecidos pela rota/ação ou selecionados pelo visitante. Reaproveitar contexto existente; não perguntar novamente nem obrigar a selecionar o que já foi confirmado. Permitir revisar/corrigir antes do envio. Manter link direto existente como fallback SSR/sem JS ou entrada deliberada, sem duplicar funil. Foco inicial e retorno ao gatilho, Escape, scroll interno, acessibilidade/teclado e reduced-motion; não perder rascunho por fechamento acidental.
- **Seleção inteligente universal:** para campos de escolha pesquisáveis (objetivo, especialidade, categoria, município, UF/bairro, serviço/produto, filtros e seletores administrativos compatíveis), permitir digitação + sugestões/autocomplete + seleção; não exigir percorrer catálogos extensos. Preferir componente combobox acessível já existente ou nativo comprovado; busca tolerante a caixa/acentos e sinônimos do catálogo, resultados priorizados e limitados, grupos quando úteis, estados vazio/loading/erro, navegação ↑/↓/Enter/Escape, toque e foco. Escolha automática somente quando correspondência inequívoca e confirmável, sem fingir decisão do visitante; guardar IDs canônicos, texto livre apenas onde permitido, e opção “Outro”/manual. Para escolhas pequenas, priorizar clareza e interação simples; quando compatível, permitir digitar. Preservar validação no servidor, catálogos, permissões, consentimento e contratos de checkout.
- **Contexto e dados:** prioridade = escolha explícita do visitante > contexto inequívoco da página/gatilho > defaults seguros; nunca sobrescrever edição ou inferir cidade/especialidade desconhecida. Origem imutável da abertura, UTM/atribuição sanitizadas; não incluir respostas, endereço, e-mail, telefone, dados privados, tokens ou texto livre em URL, analytics ou logs. Não armazenar ou enviar automaticamente; preservar as regras locais existentes de persistência autorizada, preços, revisão, consentimento e canal oficial.
- **QA/GO:** 390/768/1440 + teclado, reduced-motion, texto longo, lista de 100+ itens, pesquisa com/sem acento, vazio, seleção/auto-preenchimento explícito, edição/retorno, abrir/fechar na origem, contexto de serviço/cidade/problema e quatro intenções aplicáveis; nenhum envio real em QA. Preservar SSR, canonical, sitemap, SEO, LCP, acessibilidade, segurança, regras comerciais e isolamento por marca.
- **Execução:** norma permanente, não implementação estrutural automática. Inventariar os seletores/CTAs existentes, reutilizar a triagem/modal/combobox realmente compatível, integrar em micro-PR própria por projeto na futura rodada dedicada e publicar só com gates locais e confirmação. Não instalar dependências nem rodar agente/fila/Max do Lovable para esta documentação.
