import { SiteIcon } from '@/components/ui/SiteIcon';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function FreeContentSection() {
  return <section className="free-section" id="conteudos-gratuitos"><Container>
    <div className="free-banner">
      <SiteIcon name="conteudos" size={72} />
      <div className="free-copy"><h2>Conteúdos Gratuitos</h2><p>Artigos, resumos, análises, dicas de redação, interpretação de textos e muito mais.</p></div>
      <Button href="/conteudos-gratuitos" secondary icon="arrow-right">Explorar Conteúdos</Button>
    </div>
  </Container></section>;
}
