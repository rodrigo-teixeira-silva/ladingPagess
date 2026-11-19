# Edson Botelho Jr. — Linguagens e Redação

Portal educacional em Next.js App Router, TypeScript strict, Tailwind CSS 4, Lucide e Embla, com integração existente ao Firebase Authentication e Firestore. Sem backend próprio.

## Executar

Requisitos: Node.js 24.12 ou superior e npm. O projeto fixa Node.js 24.22.3 no Volta e em `.nvmrc`; o Volta seleciona essa versão automaticamente dentro da pasta. Essa versão atende ao requisito das dependências atuais do Firebase.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Para produção, execute `npm run build` e `npm start`.

## Configuração do Firebase

Esta versão do repositório usa Firebase Authentication e Firestore. Antes de executar ou gerar o build, copie `.env.example` para `.env.local` e preencha os seis valores da configuração pública do aplicativo Web no console Firebase. Não use credenciais de conta de serviço ou chaves privadas nesses campos. `.env.local` permanece ignorado pelo Git.

O erro `auth/invalid-api-key` durante o build indica que a configuração está ausente ou inválida. Reinicie o servidor após preencher as variáveis; para produção, gere novamente o build.

No console Firebase também é preciso:

1. **Authentication → Sign-in method:** ativar o provedor Google.
2. **Firestore Database:** criar o banco (modo produção).
3. **Firestore Database → Regras:** colar o conteúdo de `firestore.rules` e publicar. O arquivo é gerado; veja abaixo.

## Gerenciamento de cursos (admin)

### Quem é admin

Os admins são definidos em um único lugar: `NEXT_PUBLIC_ADMIN_EMAILS` no `.env.local`, com os e-mails das contas Google separados por vírgula.

```sh
NEXT_PUBLIC_ADMIN_EMAILS=pessoa1@gmail.com,pessoa2@gmail.com
```

A mesma variável alimenta:

- **O site** (`src/lib/admin.ts`): decide quem vê o modo admin. Contas fora da lista são desconectadas logo após o login.
- **As regras do Firestore**: `firestore.rules` é gerado a partir de `firestore.rules.template` com essa lista. Ele é gerado automaticamente antes de `npm run dev` e `npm run build`, ou manualmente com `npm run rules`. O arquivo gerado não vai para o Git. As regras do Firestore são a proteção real dos dados.

Ao alterar a lista:

1. Reinicie o `npm run dev`. Em produção, gere o build novamente.
2. Cole o novo `firestore.rules` no console do Firebase e publique. Sem isso, o novo admin vê os botões, mas recebe "Sem permissão" ao salvar.

Para mudar as regras, edite `firestore.rules.template`, nunca o `firestore.rules`.

### Uso

Com o admin logado:

- Acima do carrossel da Home aparece uma barra de admin com o botão **+ Novo curso**.
- Cada card e cada página `/cursos/...` mostram o botão **Editar**. Ele abre um editor com imagem (upload), título, descrição do card, texto da página, link do botão "Quero me inscrever", "Publicado" e "Exibir no carrossel", além de **Excluir**.
- `/admin/cursos` lista todos os cursos, inclusive rascunhos. Essa área é bloqueada para quem não é admin.

O botão "Ver mais" do card sempre leva à página do curso. Lá, o botão "Quero me inscrever" abre o link de hospedagem do curso em nova aba. Sem link, ele aparece desativado.

As imagens são reduzidas e comprimidas no navegador e salvas no Firestore, na coleção `courseImages`, sem uso do Firebase Storage. Elas são servidas por `/api/course-images/{id}/{versão}`.

Enquanto o Firestore não tiver cursos publicados, o site exibe os exemplos de `src/data/courses.ts`. O admin também pode editá-los: no primeiro salvamento ou exclusão, os exemplos são copiados para o Firestore e passam a valer de lá. Se o Firestore estiver inacessível, o site exibe os exemplos, o admin vê um aviso e as alterações não podem ser salvas.

### Páginas do menu

Início, Artigos, Simulados, Aulas Básicas, Sobre e Contato mostram ao admin o botão **Editar página**. Na Início, o botão se chama **Editar página inicial**.

| Página | Campos |
|---|---|
| Início | Título do topo (3 linhas, com destaque), subtítulo, imagem de fundo, 4 benefícios e faixa "Conteúdos Gratuitos" |
| Artigos, Simulados, Aulas Básicas, Sobre | Título e texto. Uma linha em branco separa parágrafos. |
| Contato | Título, texto, e-mail e telefone. Os dois últimos são opcionais. |

- **Onde fica salvo:** o conteúdo vai para a coleção `pages` do Firestore, um documento por página. As imagens vão para `siteImages` e são servidas por `/api/site-images/{id}/{versão}`.
- **Antes da primeira edição:** cada página exibe os textos padrão definidos em `src/data/pages.ts`.
- **Para acrescentar campos editáveis:** declare o campo em `src/data/pages.ts` e use-o no componente da página.
- **Se o Firestore não responder:** as leituras desistem depois de 5 segundos e o site usa o conteúdo padrão, para a página não ficar presa.

## Versões e correções de dependências

O Node padrão de outros projetos não é alterado: a seleção de Node 24.22.3 está restrita a este projeto pelo Volta. Para outros gerenciadores, use a versão registrada em `.nvmrc`.

O `package.json` contém um override restrito ao gRPC utilizado pelo Firestore, selecionando uma versão corrigida da linha 1.x. O Firebase permanece na linha 13. As correções das ferramentas de lint estão registradas no lockfile. Use `npm ci` para reproduzir a instalação.

## Validar

```sh
npm run lint
npm run typecheck
npm run build
```

`npm run validate` executa os três comandos em sequência. O build também gera as definições de tipos das rotas.

## Personalizar

- `src/data/courses.ts`: cursos de exemplo, exibidos enquanto o Firestore não tiver cursos publicados. Os cursos reais são gerenciados pelo modo admin (ver acima).
- `src/data/site.ts`: identidade, e-mail, telefone e redes sociais. Campos vazios não geram links fictícios.
- `src/data/navigation.ts`: itens do menu.
- `src/data/pages.ts`: campos editáveis e textos padrão de cada página. Depois de salvar pelo modo admin, valem os textos do Firestore.
- `src/app/globals.css`: cores, tipografia, espaçamentos e regras responsivas.
- `public/assets/images`: imagem definitiva do hero e três capas WebP locais, utilizadas por Next/Image com proporção preservada. Logotipo em `public/assets/logo-edson-botelho.svg`; ícones vetoriais em `public/assets/icons`. Inventário e usos em `docs/assets-inventory.md`.

## Conferência manual

Confira `/`, `/artigos`, `/simulados`, `/aulas-basicas`, `/sobre`, `/contato` e os três links dos cursos. Verifique também uma URL inexistente. Em larguras de 390, 768, 1024 e 1440 pixels, examine menu, textos e cards. No celular, teste swipe. No teclado, use Tab, Shift+Tab e Escape no menu; confira foco visível e o link para pular ao conteúdo. O menu é uma navegação expansível, sem bloqueio de foco.

O carrossel avança a cada cinco segundos, continua com hover e após usar as setas, usa setas nas laterais e respeita prefers-reduced-motion. Com três cursos, slides são repetidos somente na apresentação para permitir o loop; o catálogo mantém os três registros. Tablet mostra dois e mobile um card. A Home foi capturada e verificada no Edge em 1440, 1024, 768 e 390px; evidências em artifacts/visual/after.

Documentação técnica em `docs/`. Sem commit, push ou publicação. Incremento 02 depende de autorização.


## Testes de navegador

Requer Microsoft Edge instalado. Execute npm run build e depois npm run test:browser. Para autoplay e loop com cinco cursos fictícios temporários, execute npm run test:carousel separadamente, sem outro dev/build em execução. O script restaura o catálogo original em finally; não interrompa forçadamente. Nenhum curso extra permanece publicado. Artefatos locais são ignorados pelo Git.
