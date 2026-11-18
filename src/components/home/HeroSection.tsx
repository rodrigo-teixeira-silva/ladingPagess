import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function HeroSection({ content }: { content: Record<string, string> }) {
  return (
    <section className="hero">
      <div className="hero-visual">
        <Image
          src={content.heroImage}
          alt="Livros de Gramática da Língua Portuguesa, Literatura Brasileira, Redação, Interpretação de Textos, ENEM e Vestibulares e Concursos Públicos sobre uma mesa com caderno e canetas, em uma biblioteca."
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <Container>
        <div className="hero-copy">
          <h1>
            {content.heroLine1}
            <br />
            <em>{content.heroHighlight}</em>
            <br />
            {content.heroLine2}
          </h1>
          {content.heroText && <p>{content.heroText}</p>}
          <div className="hero-actions">
            <Button href="#cursos" icon="aulas">
              Conheça os Cursos
            </Button>
            <Button href="#conteudos-gratuitos" secondary icon="conteudos">
              Acesse Conteúdos Gratuitos
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
