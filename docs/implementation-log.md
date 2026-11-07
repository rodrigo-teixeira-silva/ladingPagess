# Registro de implementação — Incremento 01

## Entrega

Projeto inicializado em diretório vazio, com configurações npm, TypeScript strict, ESLint e Tailwind. Componentes, dados tipados, rotas, CSS e três capas locais implementados em `src/` e `public/images/courses/`. README e documentação técnica adicionados. Nenhum commit, push ou publicação.

Home com identidade Edson Botelho Jr., navegação responsiva, hero de livros em CSS, faixa de quatro benefícios, cursos demonstrativos com Embla e conteúdos gratuitos. Cinco páginas públicas provisórias e três detalhes de cursos, metadata, 404 e inscrição condicional. Contatos e redes permanecem vazios até confirmação.

## Verificação

`npm run validate` concluído com código 0: ESLint sem avisos ou erros, TypeScript sem erros e build de produção aprovado com Next.js 16.4.5. Nove páginas verificadas por HTTP com status 200: Home, cinco destinos do menu e três detalhes de cursos. Três capas SVG retornaram 200. `/nao-existe` e `/cursos/nao-existe` retornaram 404. Servidor de produção iniciado temporariamente para essa conferência e encerrado ao finalizar.

Auditoria `npm audit --omit=dev`: nenhuma vulnerabilidade. A instalação sinalizou oito vulnerabilidades moderadas ao incluir dependências de desenvolvimento e aviso de depreciação do ESLint 9; não foi aplicado upgrade forçado. Testes HTTP não substituem validação de navegador.

## Limites e pendências

Sem ferramenta de navegador disponível; responsividade, swipe, foco e temporização estão implementados, mas não foram testados visualmente ou interativamente. Seguir roteiro manual no README. A composição CSS é uma alternativa ilustrada autorizada pelo pedido, não uma fotografia. Cursos e descrições precisam de confirmação; não há inscrições reais, artigos, simulados ou aulas publicados. Dados biográficos e contatos também aguardam confirmação. Incremento 02 não iniciado.

## Ajuste visual e integração dos assets — conclusão

### Inspeção

Encontrados 29 arquivos em public/assets: logotipo SVG, quatro imagens (hero PNG e três capas WebP), vinte ícones SVG e quatro referências de botões SVG. A imagem existe em assets/images/hero-livros-cursos.png, não em assets/hero. A implementação anterior não usava esses recursos. Lista completa e destinos em docs/assets-inventory.md.

### Arquivos alterados

- src/components/home/HeroSection.tsx: Next/Image com imagem definitiva; cena CSS removida.
- src/components/home/BenefitsSection.tsx e FreeContentSection.tsx: ícones fornecidos, incluindo conteúdos gratuitos.
- src/components/layout/Header.tsx: SVG original em Brand, reutilizado pelo rodapé.
- src/components/layout/Navbar.tsx e MobileMenu.tsx: ícones de navegação, abertura e fechamento do pacote.
- src/components/courses/CourseCarousel.tsx: setas SVG do pacote; lógica de rotação, pausa e preferência de movimento preservada. Lucide apenas para play/pausa, sem equivalentes fornecidos.
- src/components/courses/CourseCard.tsx e src/data/courses.ts: três imagens WebP, sem recortar seus títulos, com altura reservada e CTA alinhado.
- src/components/ui/Button.tsx e src/app/cursos/[slug]/page.tsx: componente de botão compartilhado também para inscrição; sem URL válida, permanece desabilitado.
- src/app/globals.css: paleta aprovada, layout do hero, proporções, ícones vetoriais e ajustes de responsividade.
- docs/architecture.md, docs/design-system.md, docs/implementation-log.md, README.md: documentação atualizada; docs/assets-inventory.md adicionado.

Novo componente: src/components/ui/SiteIcon.tsx, com nomes tipados, dimensões e acessibilidade. SVGs reutilizados como máscaras vetoriais para adaptação de cor ao fundo, sem rasterização. Arquivos originais preservados. Botões SVG usados somente como referência visual. Ícones sociais preservados sem links inventados.

### Validação executada

- npm run validate: código 0; ESLint sem avisos/erros, TypeScript aprovado e build Next.js 16.4.5 aprovado.
- HTTP 200 nas nove páginas: Home, cinco destinos do menu e três detalhes de curso.
- HTTP 200 nos 29 assets fornecidos, incluindo referências não renderizadas.
- Endpoint de otimização Next/Image com capa WebP e largura 640: HTTP 200, conteúdo image/jpeg negociado sem header Accept específico.
- HTML da Home contém a imagem definitiva e o logotipo, três links internos para detalhes e não contém a antiga cena CSS. HTML de detalhes mantém botão desabilitado e mensagem de inscrições indisponíveis.
- Servidor iniciado temporariamente para essas verificações e encerrado ao concluir.

### Decisões e limites

Imagem inteira do hero sem cortes, filtros ou textos nas lombadas. Duas colunas no desktop/notebook; composição empilhada no tablet/mobile. Regras preparadas para 1440, 1024, 768 e 390px, com imagem proporcional e capas sem recorte. Não há ferramenta de navegador nesta sessão: não foram realizados screenshots, testes visuais, swipe ou interação real do carrossel. Esses itens permanecem no roteiro manual do README.

Não se afirma reprodução pixel a pixel sem validação visual. Catálogo segue demonstrativo; contatos e inscrições reais aguardam confirmação. Nenhum backend, autenticação, commit, push ou incremento seguinte.

## Revisões visuais subsequentes e ajuste final de espaçamento — 07/11/2026

Revisões anteriores desta sessão: Hero passou a fundo integrado com gradiente e texto sobreposto; seção gratuita virou faixa horizontal e ganhou /conteudos-gratuitos; tipografia Roboto/Roboto Condensed local com OFL; textos, navegação ativa e rodapé alinhados à nova referência. Carrossel sem botão de pausa, com setas nas laterais, indicadores centralizados e repetição somente de apresentação para permitir loop com os três registros originais. Assets aprovados não foram modificados.

Antes do ajuste final, quatro testes de navegador passaram (layout responsivo, navegação/teclado, estabilidade no hover, autoplay e movimento reduzido), assim como dois testes com cinco registros temporários (dois intervalos automáticos, continuidade após interação, loop e swipe). O script de fixtures restaurou os três cursos originais.

O usuário delimitou o pedido final a somente espaçamento dos cards, aprovando o restante. A mudança de aplicação desse último ajuste está limitada a duas regras de src/app/globals.css: carousel-track com gap zero e carousel-slide com margin-right de 16px. A margem final é contabilizada pelo Embla na emenda do loop; o gap isolado deixava uma junção sem espaço. Não foram alterados containers, margens externas ou outros componentes após essa delimitação.

Teste de regressão adicionado em tests/home.spec.ts para medir os vãos entre cards ao longo de sete avanços, em 1024, 1440, 1888, 768 e 390px. Lint, TypeScript e build finais passaram. Resultado da conferência específica de navegador registrado ao término abaixo.

Sem commit, push, publicação ou próximo incremento. Catálogo continua demonstrativo e inscrições continuam condicionadas a URLs reais.

Conferência final no Edge: teste de espaçamento aprovado (1 teste, código 0). Foram verificados sete avanços por largura, com 16px uniformes entre cards em 1024, 1440, 1888, 768 e 390px, inclusive na emenda do loop.

## Correção do CTA Ver Cursos — 07/11/2026
O build anterior foi reproduzido no Edge: texto em duas linhas e altura 62px a partir de 1024px, com white-space normal. O código-fonte tinha uma correção ainda não compilada. Header.tsx recebeu rótulo próprio sem encolhimento; o CTA usa largura intrínseca, texto sem quebra e altura 44px. Novo build gerado, lint e TypeScript aprovados. Conferência real no Edge em 901, 980, 1024, 1440 e 1888px: uma linha, 44px e nenhum overflow em todas as larguras. Capturas em artifacts/header/before e after. Para desenvolvimento, npm run dev; npm start usa o último npm run build. Demais partes do layout preservadas.
