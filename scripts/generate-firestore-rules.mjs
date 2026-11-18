// Gera firestore.rules a partir de firestore.rules.template,
// usando a lista NEXT_PUBLIC_ADMIN_EMAILS (separada por vírgula) do .env.local / .env.
// Roda automaticamente antes de `npm run dev` e `npm run build`; manualmente: `npm run rules`.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const file = (name) => fileURLToPath(new URL(name, root));

// Variáveis já definidas no ambiente (ex.: CI) têm prioridade sobre os arquivos.
for (const name of ['.env.local', '.env']) {
  if (existsSync(file(name))) process.loadEnvFile(file(name));
}

const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '';
const emails = [...new Set(raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean))];

const invalid = emails.filter((e) => !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(e));
if (invalid.length) {
  console.error(`[rules] E-mail(s) inválido(s) em NEXT_PUBLIC_ADMIN_EMAILS: ${invalid.join(', ')}`);
  process.exit(1);
}

const template = readFileSync(file('firestore.rules.template'), 'utf8');
const list = `[${emails.map((e) => `'${e}'`).join(', ')}]`;
const output = template
  .replace('__ADMIN_EMAILS__', list)
  .replace(/^\/\/ TEMPLATE\..*\n\/\/ a partir.*\n/m, '// GERADO por `npm run rules` a partir de firestore.rules.template. Não edite à mão.\n');

const target = file('firestore.rules');
const previous = existsSync(target) ? readFileSync(target, 'utf8') : '';
writeFileSync(target, output);

if (!emails.length) {
  console.warn('[rules] NEXT_PUBLIC_ADMIN_EMAILS está vazio: ninguém poderá gravar no Firestore.');
} else {
  console.log(`[rules] firestore.rules gerado com ${emails.length} admin(s).`);
}
if (previous && previous !== output) {
  console.warn('[rules] firestore.rules mudou (lista de admins ou template): publique o novo arquivo no console do Firebase.');
}
