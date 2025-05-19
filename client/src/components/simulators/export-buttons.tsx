import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { TabelaItem } from "@/utils/finance";

interface ExportButtonsProps {
  data: TabelaItem[];
  fileName: string;
  title: string;
  summary?: {
    valorFinanciado?: number;
    taxaJuros: number;
    numParcelas: number;
    valorParcela: number;
    totalPagar: number;
    totalJuros: number;
    valorIOF?: number; // Valor do IOF, se aplicável
    taxaCET?: number; // Taxa do Custo Efetivo Total (% a.m.)
    [key: string]: any; // Permite propriedades adicionais para diferentes tipos de simuladores
  };
}

export default function ExportButtons({ 
  data, 
  fileName, 
  title, 
  summary 
}: ExportButtonsProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Exportar para PDF
  const exportToPDF = async () => {
    setIsExportingPDF(true);
    try {
      // Criar um novo documento PDF
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(16);
      doc.text(title, 14, 22);
      
      // Adicionar data
      const currentDate = new Date().toLocaleDateString('pt-BR');
      doc.setFontSize(10);
      doc.text(`Gerado em: ${currentDate}`, 14, 30);
      
      // Adicionar resumo dos dados, se disponível
      if (summary) {
        doc.setFontSize(12);
        doc.text("Resumo da simulação:", 14, 40);
        
        doc.setFontSize(10);
        
        // Para sistemas solares ou outros tipos de financiamento
        const valorExibir = summary.valorFinanciado !== undefined ? summary.valorFinanciado : 
                            summary.valorPainel !== undefined ? summary.valorPainel : 0;
        
        const labelExibir = summary.valorFinanciado !== undefined ? "Valor financiado" : "Valor do sistema";
        
        doc.text(`${labelExibir}: ${formatCurrency(valorExibir)}`, 14, 48);
        
        doc.text(`Taxa de juros: ${summary.taxaJuros.toFixed(2)}% a.m.`, 14, 54);
        doc.text(`Número de parcelas: ${summary.numParcelas}`, 14, 60);
        doc.text(`Valor da parcela: ${formatCurrency(summary.valorParcela)}`, 14, 66);
        doc.text(`Total a pagar: ${formatCurrency(summary.totalPagar)}`, 14, 72);
        doc.text(`Total de juros: ${formatCurrency(summary.totalJuros)}`, 14, 78);
        
        let currentLine = 84;
        
        // Adicionar informação do IOF se presente
        if (summary.valorIOF !== undefined) {
          doc.text(`Valor do IOF: ${formatCurrency(summary.valorIOF)}`, 14, currentLine);
          currentLine += 6;
        }
        
        // Adicionar informação do CET se presente
        if (summary.taxaCET !== undefined) {
          doc.text(`CET (Custo Efetivo Total): ${summary.taxaCET.toFixed(2)}% a.m.`, 14, currentLine);
          currentLine += 6;
        }
        
        // Adicionar seção de economia e retorno para painéis solares
        if (summary.potenciaInstalada !== undefined && summary.economiaEnergia !== undefined) {
          doc.setFontSize(12);
          doc.text("Economia e Retorno do Investimento:", 14, currentLine);
          currentLine += 8;
          
          doc.setFontSize(10);
          doc.text(`Potência do sistema: ${summary.potenciaInstalada} kWp`, 14, currentLine);
          currentLine += 6;
          
          doc.text(`Economia mensal estimada: ${formatCurrency(summary.economiaEnergia)}`, 14, currentLine);
          currentLine += 6;
          
          const economiaAnual = summary.economiaEnergia * 12;
          doc.text(`Economia anual estimada: ${formatCurrency(economiaAnual)}`, 14, currentLine);
          currentLine += 6;
          
          if (summary.payback !== undefined) {
            doc.text(`Payback (retorno do investimento): ${summary.payback.toFixed(1)} anos`, 14, currentLine);
            currentLine += 6;
          }
          
          // Cálculo da economia em 25 anos (vida útil média dos painéis)
          const economia25Anos = economiaAnual * 25;
          doc.text(`Economia total em 25 anos: ${formatCurrency(economia25Anos)}`, 14, currentLine);
          currentLine += 6;
        }
      }
      
      // Definir onde a tabela começará
      let tableY = summary ? 85 : 35;
      
      // Ajustar posição com base nos dados adicionais
      if (summary?.valorIOF !== undefined && summary?.taxaCET !== undefined) {
        tableY = 96; // Ambos IOF e CET
      } else if (summary?.valorIOF !== undefined) {
        tableY = 90; // Apenas IOF
      } else if (summary?.taxaCET !== undefined) {
        tableY = 90; // Apenas CET
      }
      
      // Ajustar posição ainda mais se houver dados de energia solar
      if (summary?.potenciaInstalada !== undefined && summary?.economiaEnergia !== undefined) {
        tableY = Math.max(tableY + 40, 130); // Adicionar espaço extra para seção de energia solar
      }
      
      // Definir cabeçalhos e dados para a tabela
      const tableHeaders = [['Parcela', 'Valor da Parcela', 'Amortização', 'Juros', 'Saldo Devedor']];
      const tableData = data.map(item => [
        item.parcela.toString(),
        formatCurrency(item.valorParcela),
        formatCurrency(item.amortizacao),
        formatCurrency(item.juros),
        formatCurrency(item.saldoDevedor)
      ]);
      
      // Gerar a tabela automaticamente
      autoTable(doc, {
        head: tableHeaders,
        body: tableData,
        startY: tableY,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      // Adicionar rodapé
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          'Simulador de Financiamento | simuladorfinanciamento.com',
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      }
      
      // Salvar o arquivo PDF
      doc.save(`${fileName}.pdf`);
      
    } catch (error) {
      console.error("Erro ao exportar para PDF:", error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Exportar para Excel
  const exportToExcel = async () => {
    setIsExportingExcel(true);
    try {
      // Determinar título específico do relatório
      let tituloRelatorio = 'Simulador de Financiamento - Tabela de Amortização';
      if (summary?.potenciaInstalada !== undefined) {
        tituloRelatorio = 'Simulador de Painéis Solares - Financiamento e Economia';
      } else if (summary?.valorMensalidade !== undefined) {
        tituloRelatorio = 'Simulador FIES - Financiamento Estudantil';
      }
      
      // Preparar os dados para o Excel
      // Adicionar uma linha vazia no início para cabeçalhos
      const excelData = [
        [tituloRelatorio],
        [''],
      ];
      
      // Adicionar resumo, se disponível
      if (summary) {
        // Determinar qual valor e rótulo usar
        const valorExibir = summary.valorFinanciado !== undefined ? summary.valorFinanciado : 
                           (summary.valorPainel !== undefined ? summary.valorPainel : 0);
        const labelExibir = summary.valorFinanciado !== undefined ? 'Valor financiado' : 'Valor do sistema';
        
        // Adicionar informações básicas
        const resumoBasico = [
          ['Resumo da simulação:'],
          [labelExibir + ':', valorExibir.toString()],
          ['Taxa de juros (% a.m.):', summary.taxaJuros.toString()],
          ['Número de parcelas:', summary.numParcelas.toString()],
          ['Valor da parcela:', summary.valorParcela.toString()],
          ['Total a pagar:', summary.totalPagar.toString()],
          ['Total de juros:', summary.totalJuros.toString()],
          // Adicionar IOF se presente
          ...(summary.valorIOF !== undefined ? [['Valor do IOF:', summary.valorIOF.toString()]] : []),
          // Adicionar CET se presente
          ...(summary.taxaCET !== undefined ? [['CET (Custo Efetivo Total):', `${summary.taxaCET.toFixed(2)}% a.m.`]] : [])
        ];
        
        excelData.push(...resumoBasico);
        
        // Adicionar informações específicas de painéis solares
        if (summary.potenciaInstalada !== undefined && summary.economiaEnergia !== undefined) {
          const economiaAnual = summary.economiaEnergia * 12;
          const economia25Anos = economiaAnual * 25;
          
          excelData.push(
            [''],
            ['Economia e Retorno do Investimento:'],
            ['Potência do sistema (kWp):', summary.potenciaInstalada.toString()],
            ['Economia mensal estimada (R$):', summary.economiaEnergia.toString()],
            ['Economia anual estimada (R$):', economiaAnual.toString()],
            ...(summary.payback !== undefined ? [['Tempo de retorno (Payback):', `${summary.payback.toFixed(1)} anos`]] : []),
            ['Economia total em 25 anos (R$):', economia25Anos.toString()]
          );
        }
        
        // Linha em branco final
        excelData.push(['']);
      }
      
      // Adicionar cabeçalhos da tabela
      excelData.push(['Parcela', 'Valor da Parcela', 'Amortização', 'Juros', 'Saldo Devedor']);
      
      // Adicionar dados da tabela
      data.forEach(item => {
        excelData.push([
          item.parcela.toString(),
          item.valorParcela.toString(),
          item.amortizacao.toString(),
          item.juros.toString(),
          item.saldoDevedor.toString()
        ]);
      });
      
      // Criar planilha
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);
      
      // Formatação para valores monetários (não aplicada automaticamente, apenas indicativo)
      for (let i = 0; i < data.length; i++) {
        // Calcular offset de linhas com base nas informações adicionais
        let rowOffset = 4; // Sem resumo
        if (summary) {
          rowOffset = 10; // Com resumo básico
          if (summary.valorIOF !== undefined) rowOffset++;
          if (summary.taxaCET !== undefined) rowOffset++;
        }
        const rowIndex = i + rowOffset;
        worksheet[XLSX.utils.encode_cell({ c: 1, r: rowIndex })].z = '"R$"#,##0.00';
        worksheet[XLSX.utils.encode_cell({ c: 2, r: rowIndex })].z = '"R$"#,##0.00';
        worksheet[XLSX.utils.encode_cell({ c: 3, r: rowIndex })].z = '"R$"#,##0.00';
        worksheet[XLSX.utils.encode_cell({ c: 4, r: rowIndex })].z = '"R$"#,##0.00';
      }
      
      // Criar workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabela Amortização');
      
      // Salvar arquivo
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToPDF}
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        disabled={isExportingPDF}
      >
        {isExportingPDF ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        <span>PDF</span>
      </Button>
      
      <Button
        onClick={exportToExcel}
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        disabled={isExportingExcel}
      >
        {isExportingExcel ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        <span>Excel</span>
      </Button>
    </div>
  );
}