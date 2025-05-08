import HeadSEO from "@/components/seo/head-seo";

export default function TermsOfUse() {
  return (
    <>
      <HeadSEO 
        title="Termos de Uso | Simulador de Financiamento"
        description="Consulte os termos de uso do simulador de financiamento. Entenda as regras e condições para utilização de nossos simuladores."
        keywords={["termos de uso", "condições de uso", "regras", "simulador de financiamento", "financiamento"]}
      />
    
      <div className="container mx-auto px-4 py-6">
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-6">Termos de Uso</h1>
          
          <div className="prose prose-neutral max-w-none">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o Simulador de Financiamento, você concorda com estes Termos de Uso. 
              Se você não concorda com estes termos, por favor, não use nosso site.
            </p>
            
            <h2>2. Descrição do Serviço</h2>
            <p>
              O Simulador de Financiamento é uma plataforma online que oferece ferramentas de simulação 
              para diferentes tipos de financiamentos e empréstimos, incluindo:
            </p>
            <ul>
              <li>Financiamento de veículos</li>
              <li>Financiamento imobiliário</li>
              <li>Empréstimo pessoal</li>
              <li>Crédito consignado</li>
            </ul>
            <p>
              Estas ferramentas são fornecidas apenas para fins informativos e educacionais. 
              Os resultados das simulações são aproximados e baseados nas informações fornecidas 
              pelo usuário e nos algoritmos de cálculo implementados.
            </p>
            
            <h2>3. Isenção de Responsabilidade</h2>
            <p>
              <strong>Não somos uma instituição financeira</strong>. O Simulador de Financiamento não oferece serviços 
              financeiros, não realiza operações de crédito e não intermedia financiamentos ou empréstimos.
            </p>
            <p>
              As simulações fornecidas são aproximações e podem não refletir exatamente as condições 
              oferecidas por instituições financeiras. Taxas de juros, prazos, valores de entrada e outras 
              condições podem variar significativamente de acordo com cada instituição, perfil do cliente, 
              histórico de crédito, entre outros fatores.
            </p>
            <p>
              Recomendamos que os usuários sempre consultem diretamente instituições financeiras 
              oficiais para obter informações precisas e atualizadas antes de tomar qualquer decisão financeira.
            </p>
            
            <h2>4. Uso Adequado</h2>
            <p>
              Ao usar o Simulador de Financiamento, você concorda em:
            </p>
            <ul>
              <li>Fornecer informações verdadeiras e precisas ao realizar simulações</li>
              <li>Não usar o serviço para fins ilegais ou não autorizados</li>
              <li>Não tentar interferir no funcionamento adequado do site</li>
              <li>Não tentar acessar áreas restritas do sistema</li>
              <li>Não disseminar vírus ou outros códigos maliciosos</li>
            </ul>
            
            <h2>5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo apresentado no Simulador de Financiamento, incluindo textos, gráficos, 
              logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, 
              é propriedade do Simulador de Financiamento ou de seus fornecedores de conteúdo e está 
              protegido pelas leis brasileiras e internacionais de direitos autorais.
            </p>
            <p>
              Você pode visualizar e usar o conteúdo apenas para seu uso pessoal e não comercial. 
              Qualquer outro uso, incluindo reprodução, modificação, distribuição, transmissão, republicação, 
              exibição ou execução do conteúdo deste site, é estritamente proibido sem nossa autorização prévia por escrito.
            </p>
            
            <h2>6. Privacidade e Proteção de Dados</h2>
            <p>
              Nossa Política de Privacidade, disponível em <a href="/politica-privacidade">Política de Privacidade</a>, 
              descreve como coletamos, usamos, divulgamos, transferimos e armazenamos suas informações.
              Ao usar o Simulador de Financiamento, você reconhece e concorda com as práticas descritas 
              em nossa Política de Privacidade.
            </p>
            
            <h2>7. Links para Sites de Terceiros</h2>
            <p>
              O Simulador de Financiamento pode conter links para sites de terceiros. Esses links são 
              fornecidos apenas para sua conveniência. Não temos controle sobre o conteúdo e as práticas 
              desses sites e não somos responsáveis por suas políticas de privacidade ou práticas de 
              tratamento de dados.
            </p>
            
            <h2>8. Alterações nos Termos de Uso</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações 
              significativas serão notificadas por meio de um aviso proeminente em nosso site. O uso 
              continuado do serviço após tais alterações constitui sua aceitação dos novos termos.
            </p>
            
            <h2>9. Disponibilidade do Serviço</h2>
            <p>
              Embora nos esforcemos para manter o site disponível continuamente, não podemos garantir 
              que o serviço será ininterrupto ou livre de erros. Reservamo-nos o direito de suspender 
              ou restringir o acesso a algumas funcionalidades ou ao site inteiro, a qualquer momento, 
              sem aviso prévio.
            </p>
            
            <h2>10. Legislação Aplicável</h2>
            <p>
              Estes Termos de Uso são regidos e interpretados de acordo com as leis brasileiras. 
              Qualquer disputa decorrente ou relacionada a estes termos será submetida à jurisdição 
              exclusiva dos tribunais brasileiros.
            </p>
            
            <h2>11. Contato</h2>
            <p>
              Se você tiver dúvidas ou sugestões sobre nossos Termos de Uso, entre em contato conosco:
            </p>
            <p>
              Email: contato@simuladorfinanciamento.com
            </p>
          </div>
        </section>
      </div>
    </>
  );
}