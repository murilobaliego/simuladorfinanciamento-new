import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 7,
    slug: "calculadoras-financiamento-veiculos-mundo",
    title: "Calculadoras de Financiamento de Veículos ao Redor do Mundo",
    excerpt: "Descubra como funcionam as calculadoras de financiamento em mais de 30 países, com taxas, moedas e particularidades de cada mercado.",
    date: "2025-01-18",
    readTime: "15 min"
  },
  {
    id: 6,
    slug: "como-quitar-financiamento-antecipadamente",
    title: "Como Quitar Financiamento Antecipadamente: Guia Completo 2025",
    excerpt: "Descubra como calcular o saldo devedor correto, economizar em juros e evitar armadilhas na quitação antecipada.",
    date: "2025-06-18",
    readTime: "11 min"
  },
  {
    id: 5,
    slug: "simulacao-financiamento-interpretar-resultados",
    title: "Simulação de Financiamento: Como Interpretar os Resultados",
    excerpt: "Aprenda a ler e entender todos os números da sua simulação de financiamento para tomar a melhor decisão.",
    date: "2025-05-15",
    readTime: "8 min"
  },
  {
    id: 2,
    slug: "tabela-price-vs-sac",
    title: "Tabela Price x SAC: Qual a Melhor Opção para Seu Financiamento?",
    excerpt: "Descubra as diferenças entre os dois sistemas de amortização mais usados e qual escolher para economizar.",
    date: "2025-02-12",
    readTime: "10 min"
  },
  {
    id: 1,
    slug: "calcular-taxa-juros-real-financiamento",
    title: "Como Calcular a Taxa de Juros Real do Financiamento do Seu Carro",
    excerpt: "Entenda como os bancos calculam os juros e aprenda a identificar a taxa real que você está pagando.",
    date: "2025-01-10",
    readTime: "12 min"
  },
  {
    id: 3,
    slug: "erros-financiamento-carros",
    title: "Financiamento de Carros: 7 Erros que Encarecem Sua Compra",
    excerpt: "Evite os erros mais comuns que fazem você pagar muito mais caro no financiamento do seu veículo.",
    date: "2025-03-08",
    readTime: "9 min"
  },
  {
    id: 4,
    slug: "documentacao-financiamento-veiculos-2025",
    title: "Documentação para Financiamento de Veículos 2025: Guia Completo",
    excerpt: "Lista completa de documentos necessários e dicas para agilizar a aprovação do seu financiamento.",
    date: "2025-04-05",
    readTime: "7 min"
  }
];

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog sobre Financiamentos | Dicas e Guias Completos</title>
        <meta name="description" content="Artigos especializados sobre financiamento de veículos, taxas de juros, documentação e dicas para economizar na hora de financiar." />
        <link rel="canonical" href="https://simuladorfinanciamento.com/blog" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Blog sobre Financiamentos</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Guias completos, dicas práticas e informações essenciais para você fazer o melhor financiamento
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center text-sm text-neutral-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('pt-BR')}</time>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} de leitura</span>
                </div>
                
                <h2 className="text-xl font-bold text-neutral-800 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link href={`/blog/${post.slug}`}>
                  <a className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors">
                    Ler artigo completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
