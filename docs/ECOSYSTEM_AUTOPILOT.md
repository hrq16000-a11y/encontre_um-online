# Ecosystem Autopilot — visão oficial

## Missão

Criar uma central autônoma para operar continuamente o ecossistema de portais,
reduzindo trabalho manual e aumentando tráfego, leads, receita e confiabilidade.

O Autopilot não mantém modelos de IA "pensando 24 horas". O desenho é orientado
a eventos, agenda e condições:

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

## Control Tower

Camada central de observabilidade e coordenação.

Responsabilidades:
- inventário de portais;
- fila de jobs;
- prioridade;
- estado de cada agente;
- custos;
- resultados;
- aprovações;
- auditoria.

## Agentes previstos

### Supervisor
Prioriza e distribui trabalho respeitando custo, risco, dependências e retorno.

### Health Agent
Verifica:
- uptime;
- erros 4xx/5xx;
- runtime errors;
- regressões de deploy;
- sitemap;
- robots;
- canonical;
- rotas críticas.

### SEO Agent
Analisa:
- GSC;
- cobertura;
- páginas com potencial;
- páginas fracas;
- sitemap;
- canonical;
- demanda orgânica;
- oportunidades de conteúdo.

### Lead Agent
Analisa:
- novas demandas;
- leads não atendidos;
- região;
- categoria;
- urgência;
- potencial de roteamento.

### Growth Agent
Cruza buscas, demanda, oferta, cidade, categoria e conversão para produzir:
- prioridades de expansão;
- novas categorias;
- novas cidades;
- lacunas de oferta;
- oportunidades comerciais.

### Monetization Agent
Procura oportunidades de:
- destaque pago;
- assinatura;
- lead pago;
- publicidade;
- afiliados;
- venda de landing/site/serviços;
- patrocínios.

### Content Agent
Cria ou propõe conteúdo somente quando existir justificativa por demanda,
dados ou oportunidade real.

### Git Agent
Pode abrir issue, criar branch, alterar código, rodar CI, abrir PR e corrigir
falhas.

### Auditor
Aplica gates de segurança, marca, custo, SEO, qualidade e irreversibilidade.

## Níveis de autonomia

### AUTO
Pode executar sem aprovação:
- monitoramento;
- classificação;
- métricas;
- relatórios;
- health checks;
- detecção de oportunidades;
- abertura de issues;
- coleta de dados.

### AUTO + PR
Pode alterar código, sempre por:
branch → mudança → testes → PR → validação.

### APPROVAL REQUIRED
Exige ação/aprovação humana:
- gasto relevante;
- exclusão ou migração destrutiva;
- alteração de domínio/DNS;
- mudanças comerciais irreversíveis;
- acesso ou alteração de segredos;
- ações que possam afetar outra marca do ecossistema.

## Estado e fila

Tabelas centrais futuras:
- `agent_jobs`
- `agent_runs`
- `agent_events`
- `agent_costs`
- `agent_approvals`
- `portal_registry`

`agent_jobs` deve registrar no mínimo:
- id
- portal
- agent
- task_type
- payload
- priority
- status
- risk_level
- approval_required
- scheduled_for
- started_at
- finished_at
- attempts
- max_attempts
- cost_estimate
- actual_cost
- result
- error
- created_at
- updated_at

## Infraestrutura preferida

- GitHub = fonte de verdade.
- Vercel = execução/deploy.
- Supabase = estado, filas, logs e dados operacionais.
- OpenAI = somente quando agregar valor; economy-first.
- Eventos/webhooks > polling contínuo.
- Jobs curtos e retomáveis > agente permanente consumindo tokens.

## Princípios econômicos

1. Código determinístico antes de IA quando entregar resultado equivalente.
2. Modelo barato por padrão.
3. Limites de saída e custo por job.
4. Cache quando possível.
5. Ferramentas desativadas por padrão.
6. Modelo mais forte somente quando necessário.
7. Cada agente deve provar utilidade em receita, economia de tempo, mitigação de risco ou aquisição.

## Estratégia de implantação

### Fase 1 — laboratório no EncontreUm.online
- Health;
- Leads;
- SEO;
- Growth;
- captura de busca;
- inteligência de demanda;
- painel;
- jobs simples.

### Fase 2 — extração
Mover o motor para serviço central independente.

### Fase 3 — ecossistema
Conectar os demais portais preservando identidade e dados de cada marca.

## Regra de isolamento

Infraestrutura pode ser compartilhada.

Não compartilhar automaticamente:
- identidade;
- conteúdo;
- SEO;
- banco comercial;
- claims;
- posicionamento;
- configuração de monetização.

Cada marca continua autônoma externamente.

## Regra permanente

Agentes não existem para "ficar ocupados". Só acordam quando houver evento,
agenda ou condição que justifique trabalho.

Sucesso é medido por:
- receita;
- leads;
- tráfego qualificado;
- economia operacional;
- redução de erros;
- velocidade de execução.

## Resultado esperado

Muitos portais independentes → muitos pontos de aquisição → central de intenção
→ rede de prestadores/negócios → monetização → dados → nova expansão.

Este documento é a referência oficial para implementação futura do Ecosystem Autopilot.
