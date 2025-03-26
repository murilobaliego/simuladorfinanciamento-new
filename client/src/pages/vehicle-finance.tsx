import VehicleForm from "@/components/simulators/vehicle-form";

export default function VehicleFinance() {
  return (
    <div className="container mx-auto px-4 py-6">
      <section id="simulador-veiculo" className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Simulador de Financiamento de Veículo</h2>
        
        <div className="mb-8">
          <p className="mb-4">O financiamento de veículos é uma ótima opção para quem deseja comprar um carro ou moto, mas não possui o valor total disponível. Com o nosso simulador, você poderá calcular o valor das prestações mensais e entender como funciona a amortização do saldo devedor usando o sistema de Tabela Price.</p>
          
          <p className="mb-4">A Tabela Price, também conhecida como Sistema Francês de Amortização, é um método para calcular prestações fixas. Em cada pagamento mensal, uma parte vai para os juros e outra para reduzir o valor que você deve (amortização).</p>
          
          <p className="mb-4">No Brasil, a maioria dos financiamentos de veículos utiliza o sistema de Tabela Price, onde as parcelas são fixas do início ao fim do contrato. Isso facilita o planejamento financeiro, já que você sabe exatamente quanto pagará todos os meses.</p>
          
          <p className="mb-4">É importante entender que nos primeiros meses do financiamento, a maior parte do valor da parcela vai para o pagamento de juros, e apenas uma pequena parte para amortizar o saldo devedor. Com o passar do tempo, essa proporção se inverte, e você passa a pagar mais de amortização e menos de juros.</p>
          
          <p className="mb-4">Ao simular seu financiamento, você poderá comparar diferentes prazos e verificar o impacto no valor da parcela e no total de juros pagos. Em geral, quanto maior o prazo, menor será a parcela, mas maior será o valor total de juros pago no final.</p>
          
          <p className="mb-4">Algumas dicas importantes antes de financiar seu veículo:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Compare as taxas de juros entre diferentes instituições financeiras</li>
            <li>Avalie se consegue dar uma entrada maior para reduzir o valor financiado</li>
            <li>Considere os custos adicionais como seguro, documentação e tarifas</li>
            <li>Verifique se existem pacotes de serviços ou seguros obrigatórios embutidos no financiamento</li>
          </ul>
          
          <p>Para simular seu financiamento, preencha o formulário abaixo com o valor do veículo que deseja financiar, a taxa de juros (geralmente entre 1% e 2,5% ao mês para veículos) e o número de prestações (geralmente de 24 a 60 meses).</p>
        </div>
        
        <VehicleForm />
      </section>
    </div>
  );
}
