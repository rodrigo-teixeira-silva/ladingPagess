# Compatibilidade e dependências — 18/11/2026

## Resultado

- Node selecionado para este projeto: **24.22.3**.
- Node padrão global preservado: **22.23.4**.
- Instalação limpa com `npm ci`: concluída, sem os avisos de engine incompatível observados anteriormente.
- Vulnerabilidades reportadas pelo npm: **11 → 0**, incluindo dependências de desenvolvimento.
- `npm run validate`: aprovado, com ESLint, TypeScript e build de produção.

## Alterações

`package.json` declara Node `>=24.12.0`, fixa Node 24.22.3 pelo Volta e alinha `@types/node` à linha 24. `.nvmrc` registra a mesma versão para outros gerenciadores. O Volta aplica a seleção dentro do projeto; o padrão global não foi substituído.

O Firebase permanece em **13.4.0**. Foi adicionado um override restrito à dependência `@grpc/grpc-js` de `@firebase/firestore`, passando de **1.9.16** para **1.14.7**. A versão instalada está acima das correções descritas no [aviso de segurança do gRPC](https://github.com/advisories/GHSA-m9gg-hp2v-232j).

`npm audit fix`, sem `--force`, atualizou as dependências compatíveis das ferramentas de lint. `typescript-eslint` passou de **8.72.1** para **8.73.0**, resolvendo a cadeia afetada pelo [aviso de segurança do minimatch](https://github.com/advisories/GHSA-g3hv-75wg-m249). O lockfile contém as versões efetivamente validadas. `@types/node` ficou em **24.19.2**.

Não houve alteração do layout, dos serviços de autenticação, do CRUD de cursos ou das regras de autorização da aplicação. `next-env.d.ts` foi regenerado pelo Next.js durante o build, com referências aos tipos de produção em `.next/types`.

## Configuração do Firebase

O primeiro build compilou os fontes e verificou os tipos, mas falhou na pré-renderização com `auth/invalid-api-key`: a configuração do Firebase não estava presente no checkout.

Os seis valores públicos fornecidos pelo usuário foram salvos exclusivamente em `.env.local`. `git check-ignore .env.local` confirmou que esse arquivo não será versionado. O arquivo `.env.example` contém somente os nomes das variáveis, sem valores reais, e o README explica como configurar outra máquina.

Após a configuração, o build gerou as páginas públicas e a área administrativa existente. Não foram executados login com Google, leituras ou gravações de teste no Firestore ou testes de autorização contra serviços reais.

## Verificação e limites

1. Auditoria inicial: 7 ocorrências moderadas e 4 altas.
2. Atualização direcionada e instalação limpa: `npm ci` concluído com zero vulnerabilidades reportadas.
3. ESLint: aprovado.
4. TypeScript: aprovado.
5. Produção: build aprovado com `.env.local`, incluindo 13 etapas de geração estática indicadas pelo Next.js.

O npm ainda emite aviso de depreciação do ESLint 9 e aviso de revisão de scripts de instalação de dois pacotes transitivos. Esses avisos não são falhas de engine nem vulnerabilidades reportadas pelo audit; não impediram a instalação ou o build. Nenhuma aprovação indiscriminada desses scripts foi adicionada.

A consulta do npm representa os avisos conhecidos no momento da execução, não uma garantia de ausência de falhas em todo o aplicativo. A suíte Playwright não foi reexecutada neste ajuste de dependências.

Alterações mantidas localmente, sem commit ou push nesta tarefa.
