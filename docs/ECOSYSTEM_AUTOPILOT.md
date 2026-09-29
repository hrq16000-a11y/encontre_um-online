# Ecosystem Autopilot — visão oficial

## Objetivo

Criar posteriormente uma central autônoma de agentes que opere continuamente
os portais do ecossistema, sem transformar cada site em uma ilha e sem depender
de uma IA "pensando 24 horas".

O modelo é orientado a eventos e agenda:

```
evento / horário / condição
        ↓
supervisor
        ↓
fila de jobs
        ↓
agente especializado
        ↓
ação segura
        ↓
validação / log / custo / resultado
```

## Arquitetura-alvo

- **Supervisor**: prioriza e distribui trabalho.
- **Health Agent**: deploys, erros, 404, disponibilidade e regressões.
- **SEO Agent**: GSC, sitemap, indexabilidade, demanda orgânica e oportunidades.
- **Lead Agent**: qualifica e roteia demanda capturada.
- **Growth Agent**: encontra cidades/categorias com demanda e pouca oferta.
- **Content Agent**: cria propostas de conteúdo somente a partir de demanda e
  evidência real.
- **Monetization Agent**: identifica oportunidades de destaque, publicidade,
  assinatura, lead pago, afiliado e serviços.
- **Git Agent**: branch → mudança → testes → PR → validação.
- **Auditor**: aplica gates de segurança, marca, custo, SEO e qualidade.

## Níveis de autonomia

### AUTO
Pode executar sem aprovação:
- monitoramento;
- classificação;
- métricas;
- criação de relatórios;
- health checks;
- detecção de oportunidades;
- abertura de issues.

### AUTO + PR
Pode alterar código, mas entrega via:
- branch;
- build/testes;
- PR;
- validação de preview/deploy.

### APPROVAL REQUIRED
Exige ação/aprovação humana:
- gasto relevante;
- exclusão ou migração destrutiva;
- alteração de domínio/DNS;
- mudanças comerciais irreversíveis;
- acesso a segredos;
- ações que possam afetar outra marca do ecossistema.

## Infraestrutura preferida

- GitHub = fonte de verdade.
- Vercel = execução/deploy.
- Supabase = estado, filas, logs e dados operacionais.
- OpenAI = somente quando agregar valor; economy-first.
- Eventos/webhooks > polling contínuo.
- Jobs curtos e retomáveis > agente permanente consumindo tokens.

## Tabelas centrais futuras

- `agent_jobs`
- `agent_runs`
- `agent_events`
- `agent_costs`
- `agent_approvals`
- `portal_registry`

Cada execução deve registrar:
`portal`, `agent`, `task`, `status`, `priority`, `trigger`,
`started_at`, `finished_at`, `cost`, `result`, `needs_approval`.

## Estratégia de implantação

1. Usar **EncontreUm.online como laboratório**.
2. Começar por Health + Leads + SEO + Growth.
3. Medir confiabilidade e custo.
4. Extrair o motor para uma central independente.
5. Conectar os demais portais preservando identidade e dados de cada marca.

## Regra permanente

Agentes não existem para "ficar ocupados". Só acordam quando houver um evento,
agenda ou condição que justifique trabalho. O sucesso é medido por receita,
leads, tráfego qualificado, economia operacional e redução de erros.
