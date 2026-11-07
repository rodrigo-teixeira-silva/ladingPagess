# Edson Botelho Jr. — Linguagens e Redação

Incremento 01: portal educacional local em Next.js App Router, TypeScript strict, Tailwind CSS 4, Lucide e Embla. Sem backend, autenticação, banco de dados ou dados remotos.

## Executar

Requisitos: Node.js 20.9 ou superior e npm.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Para produção, execute `npm run build` e `npm start`.

## Validar

```sh
npm run lint
npm run typecheck
npm run build
```

`npm run validate` executa os três comandos em sequência. O build também gera as definições de tipos das rotas.

## Personalizar

- `src/data/courses.ts`: catálogo demonstrativo. Confirme títulos, descrições e imagens; marque `published` e `featured` e configure `order`. Adicione `enrollmentUrl` apenas com o endereço de inscrição real. Somente URLs HTTP/HTTPS válidas habilitam o botão de inscrição.
- `src/data/site.ts`: identidade, e-mail, telefone e redes sociais. Campos vazios não geram links fictícios.
- `src/data/navigation.ts`: menu e textos das páginas provisórias.
- `src/app/globals.css`: cores, tipografia, espaçamentos e regras responsivas.
- `public/assets/images`: imagem definitiva do hero e três capas WebP locais, utilizadas por Next/Image com proporção preservada. Logotipo em `public/assets/logo-edson-botelho.svg`; ícones vetoriais em `public/assets/icons`. Inventário e usos em `docs/assets-inventory.md`.

## Conferência manual

Confira `/`, `/artigos`, `/simulados`, `/aulas-basicas`, `/sobre`, `/contato` e os três links dos cursos. Verifique também uma URL inexistente. Em larguras de 390, 768, 1024 e 1440 pixels, examine menu, textos e cards. No celular, teste swipe. No teclado, use Tab, Shift+Tab e Escape no menu; confira foco visível e o link para pular ao conteúdo. O menu é uma navegação expansível, sem bloqueio de foco.

O carrossel avança a cada cinco segundos, continua com hover e após usar as setas, usa setas nas laterais e respeita prefers-reduced-motion. Com três cursos, slides são repetidos somente na apresentação para permitir o loop; o catálogo mantém os três registros. Tablet mostra dois e mobile um card. A Home foi capturada e verificada no Edge em 1440, 1024, 768 e 390px; evidências em artifacts/visual/after.

Documentação técnica em `docs/`. Sem commit, push ou publicação. Incremento 02 depende de autorização.


## Testes de navegador

Requer Microsoft Edge instalado. Execute npm run build e depois npm run test:browser. Para autoplay e loop com cinco cursos fictícios temporários, execute npm run test:carousel separadamente, sem outro dev/build em execução. O script restaura o catálogo original em finally; não interrompa forçadamente. Nenhum curso extra permanece publicado. Artefatos locais são ignorados pelo Git.
