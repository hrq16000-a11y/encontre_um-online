# Rodada 4 — experiência de busca da home

Data: 27/11/2026. Escopo: EncontreUm.online, somente home.
Base integrada: `674c2ff0246f83d0f6a5e8d3867530c71a7df093`.
Referência de produção observada: `dpl_4R8eJ4x2dZQjjaXGGP7qbKnhAwqr`.

## Diagnóstico antes da alteração

A home publicada tinha uma hierarquia centralizada e genérica, cartões grandes
e repetitivos e pouca diferenciação entre busca do cliente e aquisição de
prestadores. A seção de categorias depende de dados reais e estava ausente na
observação de produção. A ação principal precisava ser a busca, sem prometer
oferta que ainda não existe.

## Direção de design e implementação

- Hero editorial de duas colunas no desktop; um fluxo linear no mobile.
- Estação de busca com rótulos permanentes numerados e exemplos selecionáveis,
  extraídos das intenções já citadas pela interface anterior.
- Formulário continua enviando os parâmetros `q` e `city` a `/buscar`, com
  normalização por trim no caminho JavaScript e fallback GET nativo.
- Categorias reais permanecem condicionadas à resposta do servidor; cidades
  com links compactos, etapas ordenadas e CTA de cadastro separado visualmente.
- Princípios de design engineering e motion de Emil Kowalski: feedback curto,
  foco visível, nenhuma animação ornamental de entrada, transições específicas
  de 150 ms que respeitam `prefers-reduced-motion`.
- Preservadas identidade azul, tipografia, rotas, SEO/canonical, coleta de
  eventos, mecanismos de busca e cadastro. Sem mudança de dependências,
  banco, monetização, conteúdo de resultados ou dados de produção.

## Validação local

- Instalação com pnpm 10.34.6 e lockfile congelado.
- TypeScript: aprovado.
- Gate de marca/domínio e links internos (17 rotas): aprovados.
- Build de produção Next.js: aprovado. A primeira tentativa falhou na conexão
  TLS com Google Fonts, dependência preexistente; o build passou ao utilizar
  certificados de sistema via configuração de ambiente do Turbopack, sem
  alterar fonte, dependências ou configuração de produção.
- Chromium contra o servidor de build: 390 × 844, 768 × 1024 e 1440 × 900,
  HTTP 200, um H1, canonical preservado, sem overflow horizontal ou erros de
  página. CTA de busca visível nas três larguras. Exemplo selecionável por
  teclado e estado acessível, query/cidade encaminhadas corretamente,
  fallback GET sem JavaScript, transição normal 0,15s e reduzida 0s.
- Inspeção visual desktop e mobile concluída.
- O teste usou um fixture local isolado para exercitar a seção de categorias.
  Nenhum dado de demonstração foi inserido no banco ou no site público;
  nenhum cadastro ou evento real foi enviado.

## Integração e liberação

Candidato isolado; PR em rascunho até conclusão da rodada 3 da 0WEB.
Promover somente com CI aplicável verde e validação em produção. Esta
evidência local não substitui a homologação de produção e não representa
publicação nem conclusão integral da rodada 4 do ecossistema.
