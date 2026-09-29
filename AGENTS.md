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
