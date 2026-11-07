import Link from 'next/link';
import { SiteIcon, type SiteIconName } from './SiteIcon';
type ButtonProps = { children: React.ReactNode; secondary?: boolean; icon?: SiteIconName; describedBy?: string } & ({ href: string; external?: boolean; disabled?: false } | { href?: never; external?: never; disabled: true });
export function Button({ children, href, secondary = false, icon = 'arrow-up-right', disabled, external, describedBy }: ButtonProps) {
  const className = `button ${secondary ? 'button-secondary' : ''}`;
  const content = <>{children}<SiteIcon name={icon} size={17} /></>;
  if (disabled) return <button className={className} disabled aria-describedby={describedBy}>{content}</button>;
  if (external) return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-describedby={describedBy}>{content}</a>;
  return <Link className={className} href={href!} aria-describedby={describedBy}>{content}</Link>;
}
