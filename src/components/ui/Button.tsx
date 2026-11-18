
import Link from 'next/link';
import { SiteIcon, type SiteIconName } from './SiteIcon';

/*
type ButtonProps = { children: React.ReactNode; secondary?: boolean; icon?: SiteIconName; describedBy?: string } & ({ href: string; external?: boolean; disabled?: false } | { href?: never; external?: never; disabled: true });

export function Button({ children, href, secondary = false, icon = 'arrow-up-right', disabled, external, describedBy }: ButtonProps) {

  const className = `button ${secondary ? 'button-secondary' : ''}`;

  const content = <>{children}<SiteIcon name={icon} size={17} /></>;

  if (disabled) return <button className={className} disabled aria-describedby={describedBy}>{content}</button>;
  
  if (external) return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-describedby={describedBy}>{content}</a>;

  return <Link className={className} href={href!} aria-describedby={describedBy}>{content}</Link>;
}
*/



type BaseButtonProps = {
  children: React.ReactNode;
  secondary?: boolean;
  icon?: SiteIconName | null;
  describedBy?: string;
};

type ButtonProps = BaseButtonProps & (
  | {
      href: string;
      external?: boolean;
      onClick?: never;
      disabled?: false;
    }
  | {
      href?: never;
      external?: never;
      onClick: () => void;
      disabled?: false;
    }
  | {
      href?: never;
      external?: never;
      onClick?: never;
      disabled: true;
    }
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

  // Botão desabilitado
  if (disabled) {
    return (
      <button
        type="button"
        className={className}
        disabled
        aria-describedby={describedBy}
      >
        {content}
      </button>
    );
  }

  // Botão com ação onClick
  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        aria-describedby={describedBy}
      >
        {content}
      </button>
    );
  }

  // Link externo
  if (external) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby={describedBy}
      >
        {content}
      </a>
    );
  }

  // Navegação interna
  return (
    <Link
      className={className}
      href={href}
      aria-describedby={describedBy}
    >
      {content}
    </Link>
  );
}
