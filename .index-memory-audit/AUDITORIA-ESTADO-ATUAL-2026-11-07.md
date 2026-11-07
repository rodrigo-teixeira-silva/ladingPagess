# Auditoria do estado atual da aplicação

**Projeto:** Edson Botelho Jr. — Linguagens e Redação  
**Diretório:** `C:\landingpage-cursos`  
**Data de referência:** 07/11/2026, America/Sao_Paulo  
**Escopo:** inventário técnico, funcionalidades, evidências de validação, decisões recentes e pendências.

## 1. Resumo executivo

A aplicação é um portal educacional frontend em Next.js App Router. A Home, a navegação, o carrossel, a página agregadora de conteúdos gratuitos e os detalhes de cursos estão implementados. A base executa localmente e possui build de produção gerado.

O produto permanece no **Incremento 01**, com três cursos demonstrativos e páginas de conteúdo ainda provisórias. Não existe checkout próprio: inscrições dependem de URLs externas reais, que ainda não estão configuradas. Também não existem backend próprio, banco de dados, autenticação ou painel administrativo.

O último ajuste funcional foi no botão **Ver Cursos**: texto em uma linha, largura conforme o conteúdo, ícone ao lado e altura de 44px. A alteração foi recompilada e verificada no navegador. Antes disso, foi corrigido o espaçamento de 16px entre os cards, inclusive na emenda do loop.

**Nesta auditoria:** foram inspecionados arquivos, configurações, dados e evidências existentes. Não foram feitas alterações na aplicação nem executadas novamente as suítes de testes. Os resultados abaixo distinguem a inspeção atual das verificações realizadas nas etapas anteriores desta mesma conversa.

## 2. Stack e configuração

Versões efetivas identificadas em `package-lock.json`, não apenas os intervalos declarados em `package.json`:

| Dependência | Versão |
| --- | --- |
| Next.js | 16.4.5 |
| React / React DOM | 19.3.1 |
| TypeScript | 5.9.3 |
| Tailwind CSS / PostCSS do Tailwind | 4.3.5 |
| Embla Carousel React | 8.6.0 |
| Lucide React | 0.468.0 |
| ESLint | 9.39.5 |
| eslint-config-next | 16.4.5 |
| Playwright Test | 1.65.0 |

- TypeScript com `strict: true`, `noEmit`, resolução `bundler` e alias `@/*` para `src/*`.
- ESLint com configurações Next Core Web Vitals e TypeScript.
- Tailwind 4 integrado por `postcss.config.mjs` e importado no CSS global.
- Estilos visuais majoritariamente em CSS global; não se trata de uma implementação feita somente com classes utilitárias.
- Fontes Roboto e Roboto Condensed locais, acompanhadas das licenças OFL.
- `AGENTS.md` determina consultar a documentação local do Next em `node_modules/next/dist/docs` antes de mudanças pertinentes.
- Não foi encontrado diretório `.git` na raiz durante a inspeção. Não há identificação de commit para vincular a este retrato.

## 3. Estrutura e responsabilidades

| Local | Responsabilidade |
| --- | --- |
| `src/app` | Rotas, layout compartilhado, metadata, página 404 e CSS global |
| `src/components/layout` | Header, marca, navegação, menu móvel e Footer |
| `src/components/home` | Hero, benefícios, cursos em destaque e faixa gratuita |
| `src/components/courses` | Card e carrossel |
| `src/components/ui` | Button, Container, SectionHeading e SiteIcon |
| `src/data` | Dados locais de cursos, navegação e identidade/contatos |
| `src/types/course.ts` | Contrato tipado dos cursos |
| `src/lib/utils.ts` | Validação das URLs externas de inscrição |
| `public/assets` | Imagens, logotipo, ícones e referências visuais de botões |
| `public/fonts` | Fontes locais e licenças |
| `tests` | Cenários Playwright da Home e do carrossel com fixtures |
| `scripts` | Capturas, verificação do Header e execução com dados temporários |
| `docs` | Arquitetura, design system, inventário e histórico de implementação |

Componentes cliente: `Navbar`, `MobileMenu` e `CourseCarousel`. Os demais componentes não possuem diretiva de cliente e usam a composição padrão do App Router.

## 4. Rotas e conteúdo disponível

| Rota | Estado |
| --- | --- |
| `/` | Home comercial implementada |
| `/artigos` | Página provisória, sem artigos publicados |
| `/simulados` | Página provisória, sem motor de simulados |
| `/aulas-basicas` | Página provisória, sem aulas publicadas |
| `/sobre` | Apresentação provisória, sem biografia detalhada confirmada |
| `/contato` | Página provisória; contatos vazios na configuração |
| `/conteudos-gratuitos` | Agregadora com links para Artigos, Simulados e Aulas Básicas |
| `/cursos/redacao-para-o-enem` | Detalhes demonstrativos e inscrição indisponível |
| `/cursos/gramatica-completa` | Detalhes demonstrativos e inscrição indisponível |
| `/cursos/literatura-brasileira` | Detalhes demonstrativos e inscrição indisponível |
| Outras URLs | Página 404; há ressalva sobre a consulta do dicionário em `[page]`, descrita nos achados |

As cinco páginas provisórias são atendidas por `src/app/[page]/page.tsx`. Cursos publicados recebem parâmetros estáticos por `generateStaticParams`. A agregadora gratuita possui rota própria. O último build gerou a Home, a agregadora, os cinco destinos provisórios, os três detalhes e a infraestrutura de 404.

## 5. Dados e fluxo comercial

`src/data/courses.ts` contém exatamente três registros, identificados no código como demonstrativos:

1. Redação para o ENEM — ordem 1.
2. Gramática Completa — ordem 2.
3. Literatura Brasileira — ordem 3.

Todos estão com `published: true` e `featured: true`. O destaque filtra essas duas propriedades e ordena por `order`.

O contrato `Course` inclui `id`, `slug`, `title`, `shortDescription`, `description`, `image`, `featured`, `published`, `order` e `enrollmentUrl` opcional.

Fluxo implementado: **Home → Ver mais → detalhes → Quero me inscrever → URL externa cadastrada**. Atualmente nenhum curso tem `enrollmentUrl`; os três botões de inscrição ficam desabilitados com mensagem explicativa.

A função `validExternalUrl` aceita HTTP/HTTPS com hostname e rejeita URLs inválidas ou com credenciais embutidas. Links externos válidos usam nova aba e `rel="noopener noreferrer"`. Não há nome de plataforma de vendas na interface.

`src/data/site.ts` mantém e-mail e telefone vazios e redes sociais em lista vazia. Não há contatos ou perfis fictícios cadastrados.

## 6. Estado visual e decisões que devem ser preservadas

- Paleta principal: azul-marinho `#0B2D4D`, amarelo `#FFCA16`, cinza claro `#F5F7FA` e branco.
- Header com logo SVG original, seis destinos, indicação de página ativa e CTA amarelo.
- Hero com fotografia local como fundo, gradiente de leitura e texto sobreposto. A imagem não é um card independente.
- Benefícios em faixa clara integrada logo abaixo do Hero, sem cards individuais.
- Cursos em painel arredondado, com capas, títulos, descrições e botões amarelos.
- Cards dos cursos sem elevação, zoom, transformação ou alteração de sombra no hover.
- Conteúdos gratuitos em **uma faixa**, não três cards na Home. As categorias estão na página agregadora.
- Footer com identidade, links, conteúdos e texto de acompanhamento.

Parâmetros atuais relevantes em `src/app/globals.css`:

| Elemento | Configuração atual |
| --- | --- |
| Container desktop | `min(1280px, calc(100% - 60px))` |
| Container até 900px | Largura disponível menos 40px |
| Container até 600px | Largura disponível menos 32px |
| Header desktop | Altura mínima de 80px |
| Hero desktop | Altura mínima limitada entre 460px e 575px; imagem `cover`, posição direita/65% e camada deslocada 8% |
| Hero mobile | Fotografia inteira na base da composição com `contain` |
| Cursos visíveis | Três no desktop, dois até 900px e um até 600px |
| Vão entre cards | Margem direita de 16px por slide; `gap: 0` na track |
| Capas dos cursos | Proporção 2,43; `object-fit: cover` com alinhamento à esquerda |
| CTA do Header | `max-content`, mínimo 140px no desktop, 44px de altura e texto sem quebra; ajuste de mínimo até 980px |

**Diretriz mais recente do usuário:** o restante do layout foi considerado bom e o pedido foi limitado ao espaçamento dos cards; depois, ao botão Ver Cursos. Não retomar mudanças gerais de margens, containers ou Hero sem novo pedido. Os limites de largura acima continuam presentes por essa delimitação de escopo.

Não há comprovação de equivalência pixel a pixel com a referência. As capturas de página inteira existentes são históricas e anteriores à última correção do Header; não devem ser apresentadas como screenshots atuais de toda a aplicação.

## 7. Carrossel: funcionamento atual

- Embla com `loop: true`, alinhamento inicial e avanço de um card.
- Autoplay por intervalo de 5.000ms; não exige clique para começar.
- Hover não pausa o movimento.
- Setas, indicadores e fim de gesto reiniciam a contagem do intervalo.
- Não há botão de pausa, conforme instrução expressa do usuário.
- `prefers-reduced-motion` desativa autoplay e remove a transição das ações manuais.
- Aba oculta não avança automaticamente.
- Setas ficam nas laterais dos cards; indicadores ficam centralizados abaixo.
- Slides fora da área visível recebem `aria-hidden` e `inert`.

Com os três cursos atuais, o componente repete os slides somente na apresentação: seis slides físicos representam três registros únicos. Isso permite rotação mesmo com três cards visíveis. Nenhum curso extra é inserido no catálogo para essa apresentação.

Para outras quantidades, os slides são usados diretamente. Embla pode recorrer a uma track finita quando não há conteúdo suficiente para loop; nesse caso, autoplay retorna ao início e as setas respeitam a disponibilidade informada pela API.

A correção de espaçamento substituiu o `gap` isolado por `margin-right: 16px` nos slides. Dessa maneira, Embla considera também o espaço final ao reposicionar slides no loop. O teste específico verificou os vãos após sete avanços em cada largura.

## 8. Assets

Foram encontrados **29 arquivos em `public/assets`**:

- Um logotipo SVG.
- Vinte ícones SVG.
- Quatro referências visuais de botões SVG.
- Um Hero PNG e três capas WebP.

Hero utilizado: `public/assets/images/hero-livros-cursos.png`. O caminho real é `images/`, não `hero/`.

Capas utilizadas: `curso-redacao-enem.webp`, `curso-gramatica-completa.webp` e `curso-literatura-brasileira.webp`.

`SiteIcon` reutiliza os desenhos dos SVGs como máscaras vetoriais. As setas laterais atuais usam chevrons do Lucide. Os SVGs de botões são referências; os controles são elementos interativos reais. As redes sociais não são exibidas sem URLs configuradas.

`public/fonts` contém quatro arquivos: duas fontes TTF e duas licenças OFL. Fontes e imagens não exigem serviços remotos durante a navegação.

## 9. Evidências e alcance da validação

| Verificação | Último resultado conhecido | Limite da evidência |
| --- | --- | --- |
| ESLint | Aprovado na última execução de `npm run validate` | Não reexecutado nesta auditoria documental |
| TypeScript | Aprovado na mesma execução | Não reexecutado nesta auditoria |
| Build de produção | Aprovado após a correção final do CTA | Não significa servidor atualmente em execução |
| Home responsiva, navegação, teclado, hover e autoplay | Quatro cenários de navegador aprovados em etapa anterior | Anteriores à última correção isolada do CTA |
| Espaçamento dos cards | Um teste específico aprovado | Sete avanços por largura em 1024, 1440, 1888, 768 e 390px |
| Cinco cursos temporários | Dois testes aprovados | Dois intervalos automáticos, loop e swipe; catálogo original restaurado |
| Botão Ver Cursos | Verificado no Edge após recompilar | Uma linha, 44px e nenhum overflow em 901, 980, 1024, 1440 e 1888px |

Atualmente `tests/home.spec.ts` contém cinco testes e `tests/carousel-fixtures.spec.ts` contém dois. Não houve execução conjunta de todos esses cenários após a última alteração do Header; houve a verificação específica do botão sobre o novo build.

`test-results/.last-run.json` está com `status: passed`. Esse arquivo é sobrescrito a cada execução e não comprova sozinho o sucesso de toda a suíte.

Evidências locais encontradas:

- `artifacts/visual/before`: capturas iniciais e medidas.
- `artifacts/visual/after`: capturas históricas da Home em quatro larguras e medidas.
- `artifacts/visual/fixtures/five-courses.png`: captura com dados temporários.
- `artifacts/header/before`: reprodução do CTA quebrando em duas linhas.
- `artifacts/header/after`: capturas da correção final em cinco larguras.
- `docs/implementation-log.md`: histórico dos comandos, ajustes e resultados.

Build presente em `.next`, com `BUILD_ID` **`lEfTczHHjkvX2A6w8LXlh`** no momento desta inspeção. Esse identificador muda com uma nova compilação.

Não foram executados nesta auditoria: nova navegação HTTP, nova suíte Playwright, Lighthouse, axe, auditoria completa de acessibilidade, testes de carga ou consulta atual de vulnerabilidades. A auditoria de dependências anterior informou zero vulnerabilidades de produção e oito moderadas incluindo desenvolvimento; isso é histórico, não um relatório atualizado do registro npm.

## 10. Achados e pendências

| Prioridade | Achado | Impacto e encaminhamento |
| --- | --- | --- |
| Alta para publicação comercial | Catálogo e programas são demonstrativos; sem URLs de inscrição | Confirmar os cursos e cadastrar URLs reais antes de anunciar venda |
| Alta para publicação de conteúdo | Artigos, simulados, aulas e biografia permanecem provisórios | Não apresentar esses módulos como biblioteca já publicada |
| Média | Consulta de `publicPages[page]` não verifica propriedade própria | Nomes herdados, como `constructor` e `toString`, podem passar pelo teste de existência. Revisar com `Object.hasOwn` ou mapa adequado; achado por leitura, sem reprodução HTTP nesta auditoria |
| Média | `test:carousel` modifica temporariamente `src/data/courses.ts` | O `finally` restaura em término normal/falha de teste; encerramento forçado ou execução concorrente pode deixar o estado temporário. Não rodar junto de outro dev/build; considerar fixture isolada em evolução futura |
| Média | Acessibilidade formal ainda não auditada | Há recursos implementados e testes básicos, mas não certificação. A ausência de pausa foi solicitada; avaliar eventual revisão desse requisito com o usuário, sem reintroduzir controle unilateralmente |
| Média | Testes de navegador dependem do canal `msedge` | Outros ambientes precisam de Edge instalado ou configuração equivalente. Não assumir portabilidade automática para CI Linux |
| Baixa | `scripts/check-header.mjs` usa a porta fixa 3103 | É necessário iniciar previamente o servidor nessa porta; não é um comando independente de bootstrap |
| Baixa | Casos de zero, um, dois e quatro cursos sem cobertura de navegador dedicada | Foram verificados os catálogos de três e cinco cursos. Não estender a conclusão a todas as quantidades |
| Baixa | SEO básico, sem configuração completa de publicação | Há títulos, descrições e idioma; não foram encontrados arquivos dedicados de sitemap/robots, canonical, Open Graph ou metadataBase |
| Baixa | Contatos e redes sociais vazios | Preencher somente com dados oficiais confirmados |
| Baixa | Arquivos de configuração e parte dos componentes com formatação compacta | Pode dificultar manutenção e revisão; não constitui falha funcional demonstrada |

Os achados acima foram registrados, **não corrigidos** nesta tarefa. Não foi observada necessidade de adicionar backend, autenticação ou banco de dados para o escopo já implementado.

## 11. Execução e cuidados operacionais

Desenvolvimento com atualização automática:

```powershell
cd C:\landingpage-cursos
npm ci
npm run dev
```

Produção local:

```powershell
npm run build
npm start
```

**Reiniciar `npm start` não recompila os fontes.** Após alterações, é necessário gerar o build. Essa diferença foi a causa identificada de uma correção do CTA não aparecer no servidor que ainda usava o build anterior.

Validações disponíveis:

```powershell
npm run validate
npm run test:browser
npm run test:carousel
```

- `test:browser` usa servidor próprio na porta 3100 e precisa de build atualizado.
- `test:carousel` usa desenvolvimento na porta 3101 e fixtures temporárias; executar separadamente.
- `node scripts/check-header.mjs after` usa um servidor já iniciado na porta 3103.
- Os servidores iniciados pelas ferramentas de teste são locais; não há publicação ou hospedagem confirmada.
- `.next`, `node_modules`, `artifacts`, `test-results`, relatórios Playwright, arquivos incrementais e arquivos de ambiente estão ignorados pelo `.gitignore`.

## 12. Restrições e continuidade

1. Preservar o estado visual considerado bom pelo usuário; mudanças gerais exigem novo pedido.
2. Não reintroduzir botão de pausa ou controles inferiores extras no carrossel.
3. Preservar o vão de 16px durante todo o loop e o CTA sem quebra de linha.
4. Manter somente os três registros atuais até a confirmação de catálogo real; fixtures não são cursos comerciais.
5. Não inventar contatos, URLs de compra, credenciais, depoimentos ou métricas.
6. Não iniciar outro incremento, fazer commit, push ou publicação sem autorização correspondente.

Esta tarefa entregou somente o presente documento em `.index-memory-audit`. O conteúdo é um retrato do estado inspecionado e deve ser atualizado após mudanças de código, dados, dependências ou novos testes.
