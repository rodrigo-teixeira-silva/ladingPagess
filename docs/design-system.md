# Design system

Referência principal: Landing Page de Português e Redação.png, com Hero fotográfico integrado, benefícios claros, cursos em painel arredondado, faixa azul clara para conteúdos gratuitos e rodapé com colunas. Não há painéis de planejamento na interface.

Paleta centralizada em globals.css: #0B2D4D, #FFCA16, #F5F7FA e branco. Roboto e Roboto Condensed locais, sem requisições de fontes durante a navegação. Licenças e arquivos em public/fonts. Logotipo SVG e imagens aprovadas preservados.

Header com navegação horizontal, indicação de página ativa e CTA amarelo; menu móvel até 900px. Hero com imagem de fundo via Next/Image, texto branco e amarelo sobre gradiente progressivo. No mobile a fotografia fica inteira na base da mesma composição para preservar os livros. Cursos em três colunas no desktop, duas até 900px e uma até 600px. Cards sem transformações, zoom ou mudança de sombra no hover. Setas brancas posicionadas sobre as laterais e indicadores centralizados; sem botão de pausa.

Conteúdos gratuitos em uma faixa horizontal de fundo azul claro, livro à esquerda e CTA à direita, adaptada em grid no mobile. A página agregadora reúne os três destinos gratuitos. Footer com logo, navegação, conteúdos e texto de acompanhamento; nenhum contato fictício.

## Último ajuste autorizado: apenas espaçamento dos cards

Após a confirmação do usuário de que o restante estava bom, o CSS de aplicação foi alterado apenas em carousel-track e carousel-slide: gap passou a zero e cada slide recebeu margem direita de 16px. Isso mantém um vão igual também entre o último e o primeiro slide do loop, sem modificar larguras, margens externas, Hero, cabeçalho, tipografia, rodapé ou controles. Breakpoints e cálculo de largura dos cards preservados.

A checagem de navegador mede os vãos reais após sete avanços em 1024, 1440, 1888, 768 e 390px. A largura 1888px reproduz a captura enviada para esta correção. Os testes anteriores também capturaram a Home em 1440, 1024, 768 e 390px; screenshots históricas não devem ser confundidas com uma prova de equivalência pixel a pixel.
