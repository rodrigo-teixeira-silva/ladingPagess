# Arquitetura

Next.js App Router com TypeScript strict, dados locais em src/data, contrato Course em src/types e validação de inscrição em src/lib/utils.ts. Sem backend, banco de dados ou autenticação. Header, Footer, Home e detalhes permanecem compostos por componentes reutilizáveis; Navbar, MobileMenu e CourseCarousel são componentes cliente.

HeroSection usa Next/Image com a fotografia local como camada de fundo e uma camada CSS de gradiente para texto sobreposto. Não é um card de imagem independente. FreeContentSection é uma faixa horizontal com CTA para /conteudos-gratuitos; a página agregadora mantém acesso a /artigos, /simulados e /aulas-basicas. Assets fornecidos preservados. Roboto e Roboto Condensed são servidas localmente em public/fonts, com licenças OFL.

## Carrossel

Embla Carousel com loop, avanço de um card a cada cinco segundos, setas laterais em branco e indicadores centralizados. Sem botão de pausa, conforme a instrução mais recente. Hover não interrompe a rotação; setas, indicadores e swipe reiniciam a contagem. Movimento reduzido desativa autoplay e remove a animação das ações manuais. Aba oculta não avança.

O catálogo contém três cursos demonstrativos. Para que todos os três possam rotacionar mesmo com três visíveis, somente a apresentação repete os slides uma vez. Não há registros extras no catálogo. Slides fora da área visível recebem aria-hidden e inert. Os indicadores representam os cursos originais. Para outras quantidades, Embla usa diretamente os slides disponíveis; controles sem deslocamento ficam desabilitados.

Espaçamento de 16px por margin-right em cada slide, com gap zero na track. A margem final entra na medição do loop pelo Embla, eliminando a emenda sem espaço que ocorria ao usar apenas gap. As larguras responsivas continuam calculadas para três, dois e um card, sem alterar o container ou as margens da página.

## Verificação

Playwright como dependência de desenvolvimento, usando Edge headless. Testes normais em servidor de produção isolado na porta 3100. Testes de cinco cursos temporários em servidor de desenvolvimento na porta 3101, com restauração do catálogo em finally. Não executar fixtures em paralelo com outro dev/build ou interromper forçadamente o script.

npm run validate executa lint, TypeScript e build. npm run test:browser cobre layout, navegação, movimento reduzido, autoplay, ausência de hover e espaçamento. O teste específico de espaçamento percorre sete avanços por largura em 1024, 1440, 1888, 768 e 390px. npm run test:carousel verifica dois intervalos automáticos, loop e swipe com cinco registros fictícios temporários. Artefatos ficam em artifacts/ e test-results/, ignorados pelo Git.
