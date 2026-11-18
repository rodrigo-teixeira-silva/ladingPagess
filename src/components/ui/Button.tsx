// src/components/ui/Button.tsx
import Link from 'next/link';
import { SiteIcon, type SiteIconName } from './SiteIcon';

type BaseButtonProps = {
  children: React.ReactNode;
  secondary?: boolean;
  icon?: SiteIconName | null;
  describedBy?: string;
};

// A MÁGICA ACONTECE AQUI: Adicionamos uma 4ª opção que permite um botão "vazio"
type ButtonProps = BaseButtonProps & (
  | { href: string; external?: boolean; onClick?: never; disabled?: false; }
  | { href?: never; external?: never; onClick: () => void; disabled?: false; }
  | { href?: never; external?: never; onClick?: never; disabled: true; }
  | { href?: never; external?: never; onClick?: never; disabled?: false; } // <-- NOVA OPÇÃO AQUI
);

export function Button({
  children,
  href,
  secondary = false,
  icon = "arrow-up-right",
  disabled,
  external,
  describedBy,
  onClick,
}: ButtonProps) {
  const className = `button ${secondary ? "button-secondary" : ""}`;

  const content = (
    <>
      {children}
      {icon && <SiteIcon name={icon} size={17} />}
    </>
  );

  // 1. Botão desabilitado
  if (disabled) {
    return (
      <button type="button" className={className} disabled aria-describedby={describedBy}>
        {content}
      </button>
    );
  }

  // 2. Botão com ação onClick
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} aria-describedby={describedBy}>
        {content}
      </button>
    );
  }

  // 3. Link externo
  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-describedby={describedBy}>
        {content}
      </a>
    );
  }

  // 4. Navegação interna (Link do Next.js)
  if (href) {
    return (
      <Link className={className} href={href} aria-describedby={describedBy}>
        {content}
      </Link>
    );
  }

  // 5. Botão "visual" (quando está dentro de um <Link> ou precisa apenas do visual)
  return (
    <button type="button" className={className} aria-describedby={describedBy}>
      {content}
    </button>
  );
}