# Inventário de assets

Todos os arquivos encontrados em public/assets antes da integração. Nenhum componente os utilizava na versão anterior.

## Arquivos

- `public/assets/logo-edson-botelho.svg`
- `public/assets/buttons/btn-conheca-cursos.svg`
- `public/assets/buttons/btn-conteudos-gratuitos.svg`
- `public/assets/buttons/btn-inscrever.svg`
- `public/assets/buttons/btn-ver-mais.svg`
- `public/assets/icons/icon-arrow-left.svg`
- `public/assets/icons/icon-arrow-right.svg`
- `public/assets/icons/icon-arrow-up-right.svg`
- `public/assets/icons/icon-artigos.svg`
- `public/assets/icons/icon-aulas-objetivas.svg`
- `public/assets/icons/icon-aulas.svg`
- `public/assets/icons/icon-close.svg`
- `public/assets/icons/icon-contato.svg`
- `public/assets/icons/icon-conteudos.svg`
- `public/assets/icons/icon-cursos.svg`
- `public/assets/icons/icon-exercicios.svg`
- `public/assets/icons/icon-facebook.svg`
- `public/assets/icons/icon-foco-resultados.svg`
- `public/assets/icons/icon-home.svg`
- `public/assets/icons/icon-instagram.svg`
- `public/assets/icons/icon-materiais.svg`
- `public/assets/icons/icon-menu.svg`
- `public/assets/icons/icon-simulados.svg`
- `public/assets/icons/icon-sobre.svg`
- `public/assets/icons/icon-youtube.svg`
- `public/assets/images/curso-gramatica-completa.webp`
- `public/assets/images/curso-literatura-brasileira.webp`
- `public/assets/images/curso-redacao-enem.webp`
- `public/assets/images/hero-livros-cursos.png`

## Uso na interface

- Logo: Header/Brand e Footer.
- Hero e três capas: HeroSection, CourseCard e detalhes de curso, via Next/Image.
- home, artigos, simulados, aulas, sobre, contato: navegação desktop e mobile.
- aulas-objetivas, foco-resultados, exercicios, materiais: faixa de benefícios.
- artigos, simulados, aulas, conteudos: seção gratuita e CTA do hero.
- cursos: CTA Conheça os cursos; menu e close: MobileMenu.
- arrow-left e arrow-right: carrossel; arrow-up-right: CTAs e links de conteúdo.
- instagram, facebook e youtube: preservados no pacote, sem renderização enquanto não houver perfis oficiais configurados.
- buttons/btn-*.svg: quatro referências visuais; não renderizadas como botões estáticos.

SiteIcon reutiliza os SVGs como máscaras vetoriais e altera somente a cor de apresentação conforme o contexto. Logo e imagens não foram modificados.
