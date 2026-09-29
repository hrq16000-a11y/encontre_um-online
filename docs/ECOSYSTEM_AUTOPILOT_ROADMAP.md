# Ecosystem Autopilot — Roadmap

Status: documentado para implementação posterior.

## Objetivo

Criar uma Control Tower para operar os portais do ecossistema 24/7 sem manter
modelos de IA executando continuamente. O sistema deve reagir a eventos,
agendamentos e filas, com custo controlado, rastreabilidade e gates de segurança.

## Arquitetura

```
Portais / GitHub / Vercel / GSC / Supabase
                 |
              Events
                 |
          Supervisor / Queue
                 |
   +------+------+------+------+------+
   |      |      |      |      |      |
 Health  SEO   Leads  Growth   Git  Monetization
                 |
             Audit Gate
                 |
       Action / PR / Approval
```

## Agentes previstos

- Supervisor: priorização, roteamento e orçamento.
- Site Health: deploys, erros, 404, uptime e regressões.
- SEO: GSC, indexação, canonical, sitemap e oportunidades.
- Leads: qualificação, deduplicação, roteamento e follow-up.
- Growth: demanda por categoria/cidade e gaps de oferta.
- Monetization: oportunidades de destaque, planos, leads e publicidade.
- Content: conteúdo somente quando houver demanda/prova suficiente.
- Git: branch, patch, testes, PR e acompanhamento do deploy.
- Auditor: gates de segurança, custo, marca e regressão.

## Modelo de execução

Não usar loop de IA permanente. Preferir:

```
evento / schedule -> job -> agente -> resultado -> log -> próximo estado
```

Jobs devem registrar no mínimo:
`portal`, `agent`, `task`, `status`, `priority`, `attempts`,
`cost`, `result`, `created_at`, `next_run` e `approval_required`.

## Autonomia

### AUTO
Leitura, monitoramento, métricas, classificação, health checks e relatórios.

### AUTO + PR
Mudanças reversíveis de código via branch -> CI -> PR -> preview.

### APPROVAL REQUIRED
DNS/domínio, exclusões destrutivas, gastos relevantes, alterações comerciais
sensíveis e mudanças de alto impacto.

## Infraestrutura-alvo

- GitHub: fonte de verdade.
- Vercel: runtime, deploy e observabilidade.
- Supabase: fila, estado, logs e dados operacionais.
- OpenAI: gateway central economy-first, quotas por portal e feature.
- EncontreUm.online: laboratório inicial.
- Posteriormente: serviço central independente atendendo todas as marcas.

## Regras

1. Nenhum segredo em código.
2. Nenhum dado fictício de produção.
3. Cada ação precisa ser auditável.
4. IA só quando superar solução determinística.
5. Quotas e limites de saída por portal/agente.
6. Falha de gate impede ação automática.
7. Marcas permanecem editorial e comercialmente isoladas.
