import type { CSSProperties } from 'react';

export type SiteIconName = 'home' | 'artigos' | 'simulados' | 'aulas' | 'sobre' | 'contato' | 'conteudos' | 'cursos' | 'aulas-objetivas' | 'foco-resultados' | 'exercicios' | 'materiais' | 'arrow-left' | 'arrow-right' | 'arrow-up-right' | 'menu' | 'close';

/** Uses the supplied SVG paths with a color suited to each surface. */
export function SiteIcon({ name, size = 24, label }: { name: SiteIconName; size?: number; label?: string }) {
  const style: CSSProperties = { width: size, height: size, maskImage: `url(/assets/icons/icon-${name}.svg)`, WebkitMaskImage: `url(/assets/icons/icon-${name}.svg)` };
  return <span className="site-icon" style={style} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
