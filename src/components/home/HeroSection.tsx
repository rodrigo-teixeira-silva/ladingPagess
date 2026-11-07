import Image from 'next/image';
import heroImage from '../../../public/assets/images/hero-livros-cursos.png';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return <section className="hero">
    <div className="hero-visual"><Image src={heroImage} alt="Livros de Gramática da Língua Portuguesa, Literatura Brasileira, Redação, Interpretação de Textos, ENEM e Vestibulares e Concursos Públicos sobre uma mesa com caderno e canetas, em uma biblioteca." fill priority sizes="100vw" /></div>
    <div className="hero-shade" aria-hidden="true" />
    <Container><div className="hero-copy">
      <h1>Português para<br /><em>Concursos, ENEM</em><br />e Vestibulares</h1>
      <p>Gramática, interpretação de textos, redação e literatura, com conteúdos práticos e objetivos.</p>
      <div className="hero-actions">
        <Button href="#cursos" icon="aulas">Conheça os Cursos</Button>
        <Button href="#conteudos-gratuitos" secondary icon="conteudos">Acesse Conteúdos Gratuitos</Button>
      </div>
    </div></Container>
  </section>;
}
