import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/data/site';
import './globals.css';
export const metadata:Metadata={title:{default:'Edson Botelho Jr. | Linguagens e Redação',template:'%s | Edson Botelho Jr.'},description:site.description};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header/><main id="conteudo">{children}</main><Footer/></body></html>;}
