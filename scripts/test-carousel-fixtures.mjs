import { readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

// Temporary, fictitious QA records. Never retained in the published catalog.
const path = new URL('../src/data/courses.ts', import.meta.url);
const original = await readFile(path, 'utf8');
const fixtureCode = `
// QA ONLY: fictitious records temporarily inserted by the validation script.
courses.push(
  { id: 'qa-4', slug: 'qa-interpretacao-ficticio', title: 'Interpretação — fictício QA', shortDescription: 'Registro fictício para verificar o deslocamento do carrossel.', description: 'Fixture temporária de teste, sem inscrição.', image: '/assets/images/curso-gramatica-completa.webp', featured: true, published: true, order: 4 },
  { id: 'qa-5', slug: 'qa-revisao-ficticio', title: 'Revisão — fictício QA', shortDescription: 'Registro fictício para verificar o loop contínuo.', description: 'Fixture temporária de teste, sem inscrição.', image: '/assets/images/curso-literatura-brasileira.webp', featured: true, published: true, order: 5 },
);
`;
if (!original.includes('export const featuredCourses')) throw new Error('Catalog export not found; no files changed.');
try {
  await writeFile(path, original.replace('export const featuredCourses', `${fixtureCode}\nexport const featuredCourses`));
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', 'tests/carousel-fixtures.spec.ts'], {
      stdio: 'inherit', env: { ...process.env, PORTAL_TEST_FIXTURES: '1' },
    });
    child.on('error', reject);
    child.on('exit', code => resolve(code ?? 1));
  });
  process.exitCode = code;
} finally {
  await writeFile(path, original);
  console.log('Catálogo original restaurado: apenas três cursos demonstrativos.');
}
