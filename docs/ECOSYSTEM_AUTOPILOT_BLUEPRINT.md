# Ecosystem Autopilot — arquitetura futura oficial

## Missão

Criar uma central autônoma para operar continuamente o ecossistema de portais,
reduzindo trabalho manual e aumentando tráfego, leads, receita e confiabilidade.

O Autopilot não deve manter modelos de IA "pensando 24 horas". O desenho correto é
orientado a eventos e agenda:

evento ou horário → agente acorda → analisa → executa → registra → encerra.

## Arquitetura

### Control Tower
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

### Agentes previstos

#### Supervisor
Decide quais jobs devem rodar, respeitando prioridade, custo, risco e dependências.

#### Site Health Agent
Verifica:
- uptime;
- erros 4xx/5xx;
- runtime errors;
- regressões de deploy;
- sitemap;
- robots;
- canonical;
- rotas críticas.

#### SEO Agent
Analisa:
- GSC;
- cobertura;
- páginas com potencial;
- páginas fracas;
- sitemap;
- canonical;
- demanda orgânica;
- oportunidades de conteúdo.

#### Lead Agent
Analisa:
- novas demandas;
- leads não atendidos;
- região;
- categoria;
- urgência;
- potencial de roteamento.

#### Growth Agent
Cruza:
- buscas;
- demanda;
- oferta;
- cidade;
- categoria;
- conversão.

Produz:
- prioridades de expansão;
- novas categorias;
- novas cidades;
- lacunas de oferta.

#### Monetization Agent
Procura oportunidades para:
- destaque pago;
- assinatura;
- lead pago;
- publicidade;
- afiliados;
- venda de landing/site/serviços;
- patrocínios.

#### Content Agent
Cria ou propõe conteúdo somente quando existir justificativa por demanda,
dados ou oportunidade real.

#### Git Agent
Pode:
- abrir issue;
- criar branch;
- alterar código;
- rodar CI;
- abrir PR;
- corrigir falhas;
- preparar merge.

#### Auditor
Impede automações perigosas ou incoerentes.

## Níveis de autonomia

### AUTO
Pode executar sem aprovação:
- leitura de métricas;
- health checks;
- classificação;
- relatórios;
- criação de issues;
- detecção de regressões;
- coleta de dados.

### AUTO + PR
Pode modificar código sem tocar produção diretamente:
branch → implementação → testes → PR → validação.

### APPROVAL REQUIRED
Exige autorização humana:
- aumentar gasto relevante;
- excluir dados;
- trocar domínio/DNS;
- alterar cobrança;
- publicar mudança comercial sensível;
- permissões e secrets;
- mudanças irreversíveis.

## Estado e fila

Tabela conceitual `agent_jobs`:

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

## Princípios econômicos

1. Código determinístico antes de IA quando entregar o mesmo resultado.
2. Modelo barato por padrão.
3. Limites de saída e custo por job.
4. Cache onde possível.
5. Ferramentas desativadas por padrão.
6. Modelo mais forte somente quando necessário.
7. Cada agente deve provar utilidade em receita, economia de tempo, mitigação de risco ou aquisição.

## Estratégia de implantação

### Fase 1 — laboratório
EncontreUm.online:
- saúde;
- captura de busca;
- leads;
- inteligência de demanda;
- painel;
- jobs simples.

### Fase 2 — extração
Mover o motor para serviço central independente.

### Fase 3 — ecossistema
Conectar:
- 0WEB;
- O Técnico de Informática;
- Técnico Curitiba;
- Mestre dos Serviços;
- Preciso de Um;
- Preciso de um Técnico;
- Preciso de um Profissional;
- demais portais.

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

## Resultado esperado

Muitos portais independentes → muitos pontos de aquisição → central de intenção
→ rede de prestadores/negócios → monetização → dados → nova expansão.

Este documento é a referência para implementação futura do Ecosystem Autopilot.
