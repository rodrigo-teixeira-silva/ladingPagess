import { site } from './site';
import { publicPages } from './navigation';

/** Campo editável de uma página. `image` faz upload; `textarea` aceita parágrafos (linha em branco separa). */
export interface PageField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'email' | 'tel';
  hint?: string;
  group?: string;
}

export interface PageDefinition {
  /** Nome exibido no editor. */
  name: string;
  fields: PageField[];
  /** Conteúdo padrão, usado enquanto nada foi salvo no Firestore. */
  defaults: Record<string, string>;
}

const simpleFields: PageField[] = [
  { key: 'title', label: 'Título', type: 'text' },
  { key: 'body', label: 'Texto', type: 'textarea', hint: 'Deixe uma linha em branco para separar parágrafos.' },
];

function simplePage(id: string, extra: PageField[] = [], extraDefaults: Record<string, string> = {}): PageDefinition {
  const page = publicPages[id];
  return {
    name: page.title,
    fields: [...simpleFields, ...extra],
    defaults: { title: page.title, body: page.description, ...extraDefaults },
  };
}

export const pageDefinitions: Record<string, PageDefinition> = {
  home: {
    name: 'Página inicial',
    fields: [
      { key: 'heroLine1', label: 'Título — 1ª linha', type: 'text', group: 'Topo da página' },
      { key: 'heroHighlight', label: 'Título — destaque (amarelo)', type: 'text', group: 'Topo da página' },
      { key: 'heroLine2', label: 'Título — última linha', type: 'text', group: 'Topo da página' },
      { key: 'heroText', label: 'Subtítulo', type: 'textarea', group: 'Topo da página' },
      { key: 'heroImage', label: 'Imagem de fundo', type: 'image', hint: 'Imagem larga (paisagem). O lado esquerdo fica escurecido sob o texto.', group: 'Topo da página' },
      { key: 'benefit1Title', label: 'Benefício 1 — título', type: 'text', group: 'Benefícios' },
      { key: 'benefit1Text', label: 'Benefício 1 — complemento', type: 'text', group: 'Benefícios' },
      { key: 'benefit2Title', label: 'Benefício 2 — título', type: 'text', group: 'Benefícios' },
      { key: 'benefit2Text', label: 'Benefício 2 — complemento', type: 'text', group: 'Benefícios' },
      { key: 'benefit3Title', label: 'Benefício 3 — título', type: 'text', group: 'Benefícios' },
      { key: 'benefit3Text', label: 'Benefício 3 — complemento', type: 'text', group: 'Benefícios' },
      { key: 'benefit4Title', label: 'Benefício 4 — título', type: 'text', group: 'Benefícios' },
      { key: 'benefit4Text', label: 'Benefício 4 — complemento', type: 'text', group: 'Benefícios' },
      { key: 'freeTitle', label: 'Título', type: 'text', group: 'Faixa “Conteúdos Gratuitos”' },
      { key: 'freeText', label: 'Texto', type: 'textarea', group: 'Faixa “Conteúdos Gratuitos”' },
    ],
    defaults: {
      heroLine1: 'Português para',
      heroHighlight: 'Concursos, ENEM',
      heroLine2: 'e Vestibulares',
      heroText: 'Gramática, interpretação de textos, redação e literatura, com conteúdos práticos e objetivos.',
      heroImage: '/assets/images/hero-livros-cursos.png',
      benefit1Title: 'Aulas objetivas',
      benefit1Text: 'e didáticas',
      benefit2Title: 'Foco em resultados',
      benefit2Text: 'Concursos, ENEM e vestibulares',
      benefit3Title: 'Exercícios e simulados',
      benefit3Text: 'comentados',
      benefit4Title: 'Materiais',
      benefit4Text: 'atualizados',
      freeTitle: 'Conteúdos Gratuitos',
      freeText: 'Artigos, resumos, análises, dicas de redação, interpretação de textos e muito mais.',
    },
  },
  artigos: simplePage('artigos'),
  simulados: simplePage('simulados'),
  'aulas-basicas': simplePage('aulas-basicas'),
  sobre: simplePage('sobre'),
  contato: simplePage(
    'contato',
    [
      { key: 'email', label: 'E-mail de contato', type: 'email', hint: 'Opcional. Vazio = não exibido.' },
      { key: 'phone', label: 'Telefone / WhatsApp', type: 'tel', hint: 'Opcional. Vazio = não exibido.' },
    ],
    { email: site.contact.email, phone: site.contact.phone },
  ),
};

export type PageId = keyof typeof pageDefinitions;

export function isPageId(value: string): value is PageId {
  return Object.prototype.hasOwnProperty.call(pageDefinitions, value);
}
