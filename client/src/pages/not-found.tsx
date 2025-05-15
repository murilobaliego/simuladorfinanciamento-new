import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Home, Calculator } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import HeadSEO from "@/components/seo/head-seo";

export default function NotFound() {
  return (
    <>
      <HeadSEO 
        title="Página não encontrada | Simulador de Financiamento"
        description="A página que você está procurando não foi encontrada. Acesse nossos simuladores de financiamento para carros, motos, imóveis e outros tipos de empréstimos."
        keywords={["página não encontrada", "erro 404", "simulador de financiamento"]}
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Página não encontrada
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida para outro endereço.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="flex items-center gap-2">
              <Link href="/">
                <Home className="h-5 w-5" />
                Ir para a Página Inicial
              </Link>
            </Button>
            
            <Button variant="outline" asChild size="lg" className="flex items-center gap-2">
              <Link href="/simulador-de-financiamento">
                <Calculator className="h-5 w-5" />
                Acessar Simuladores
              </Link>
            </Button>
          </div>
        </div>
        
        <Card className="mb-12">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Nossos Simuladores Disponíveis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SimulatorLink 
                title="Simulador de Financiamento" 
                description="Calcule parcelas e juros para diversos tipos de financiamento em um só lugar."
                href="/simulador-de-financiamento"
              />
            
              <SimulatorLink 
                title="Financiamento de Veículos" 
                description="Simule parcelas, juros e custo total para financiamento de carros."
                href="/simulador-financiamento-veiculos"
              />
              
              <SimulatorLink 
                title="Financiamento de Motos" 
                description="Calcule as melhores condições para financiar sua motocicleta."
                href="/financiamento-moto"
              />
              
              <SimulatorLink 
                title="Financiamento de Caminhões" 
                description="Simulador especializado para veículos pesados e implementos."
                href="/financiamento-caminhao"
              />
              
              <SimulatorLink 
                title="Financiamento Imobiliário" 
                description="Simule as parcelas da casa própria com sistemas SAC ou Price."
                href="/financiamento-imobiliario"
              />
              
              <SimulatorLink 
                title="Empréstimo Pessoal" 
                description="Calcule juros e parcelas para empréstimos pessoais com diversas taxas."
                href="/emprestimo-pessoal"
              />
              
              <SimulatorLink 
                title="Crédito Consignado" 
                description="Simulador de empréstimos com desconto em folha e taxas reduzidas."
                href="/credito-consignado"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-gray-600 max-w-xl mx-auto">
          <p className="mb-4">
            Se você acredita que este é um erro do nosso site, por favor entre em contato com nossa equipe
            através do email <a href="mailto:contato@simuladorfinanciamento.com" className="text-primary hover:underline">contato@simuladorfinanciamento.com</a>.
          </p>
          
          <p>
            Nosso objetivo é fornecer as melhores ferramentas de simulação financeira para ajudar você a tomar decisões informadas.
          </p>
        </div>
      </div>
    </>
  );
}

// Componente para links de simuladores
function SimulatorLink({ title, description, href }: { title: string, description: string, href: string }) {
  return (
    <Link href={href}>
      <div className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-3 text-sm">{description}</p>
        <div className="flex items-center text-primary text-sm font-medium">
          Acessar simulador <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
