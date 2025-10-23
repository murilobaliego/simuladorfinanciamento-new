import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalcolatorePrestitoAutoItaly() {
  const [prezzoVeicolo, setPrezzoVeicolo] = useState("20000");
  const [anticipo, setAnticipo] = useState("4000");
  const [durata, setDurata] = useState("48");
  const [tassoAnnuo, setTassoAnnuo] = useState("5.5");
  const [risultato, setRisultato] = useState<any>(null);

  const calcolaPrestito = () => {
    const prezzo = parseFloat(prezzoVeicolo.replace(/,/g, ""));
    const acconto = parseFloat(anticipo.replace(/,/g, ""));
    const mesi = parseInt(durata);
    const tassoAnnuoNum = parseFloat(tassoAnnuo.replace(",", "."));

    if (isNaN(prezzo) || isNaN(acconto) || isNaN(mesi) || isNaN(tassoAnnuoNum)) {
      alert("Si prega di compilare tutti i campi correttamente");
      return;
    }

    const importoFinanziare = prezzo - acconto;
    const tassoMensile = tassoAnnuoNum / 100 / 12;
    
    const rataMensile = importoFinanziare * (tassoMensile * Math.pow(1 + tassoMensile, mesi)) / (Math.pow(1 + tassoMensile, mesi) - 1);
    
    const costoTotale = rataMensile * mesi;
    const interessiTotali = costoTotale - importoFinanziare;
    const taeg = tassoAnnuoNum;

    setRisultato({
      importoFinanziare,
      rataMensile,
      costoTotale,
      interessiTotali,
      taeg,
      percentualeAnticipo: (acconto / prezzo) * 100
    });
  };

  const formatEUR = (valore: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(valore);
  };

  return (
    <>
      <Helmet>
        <title>Calcolatore Prestito Auto Italia 2025 | TAEG e Rate Mensili</title>
        <meta name="description" content="Calcolatore gratuito di finanziamento auto in Italia. Calcola la tua rata mensile, TAEG, interessi totali e trova i migliori tassi per il tuo prestito auto." />
        <meta name="keywords" content="calcolatore prestito auto Italia, finanziamento auto, prestito macchina, TAEG, rata mensile, calcolatore credito auto" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/italy/calcolatore-prestito-auto" />
        <html lang="it-IT" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calcolatore Prestito Auto in Italia
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calcola la tua rata mensile, TAEG e il costo totale del tuo finanziamento auto gratuitamente
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Come Funziona il Prestito Auto in Italia?
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              Il <strong>prestito auto</strong> (o finanziamento auto) è una delle soluzioni più comuni per acquistare un veicolo in Italia. Puoi richiedere un prestito presso una banca o una finanziaria e restituirlo attraverso <strong>rate mensili fisse</strong> per un periodo generalmente compreso tra <strong>12 e 84 mesi</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Cos'è il TAEG e Perché è Importante?
            </h3>
            <p className="mb-4">
              Il <strong>TAEG (Tasso Annuo Effettivo Globale)</strong> è l'indicatore più importante per confrontare le offerte di prestito auto in Italia. Include:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Tasso di interesse nominale:</strong> Il costo del denaro prestato</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Spese di istruttoria:</strong> Costi amministrativi</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Assicurazione:</strong> Polizza vita spesso obbligatoria</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Altre spese:</strong> Commissioni e oneri accessori</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Consiglio Importante
              </p>
              <p className="text-sm text-yellow-900">
                Confronta sempre il <strong>TAEG</strong>, non solo il tasso nominale. Un prestito con tasso basso ma spese elevate può costare più di uno con tasso leggermente superiore senza spese.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Fattori che Influenzano il Tuo Tasso di Interesse
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Riducono il tasso:</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Buon merito creditizio</li>
                  <li>• Anticipo elevato (20%+)</li>
                  <li>• Reddito stabile e documentato</li>
                  <li>• Durata breve (24-36 mesi)</li>
                  <li>• Auto nuova vs usata</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">✗ Aumentano il tasso:</h4>
                <ul className="text-sm text-red-900 space-y-1">
                  <li>• Segnalazioni CRIF negative</li>
                  <li>• Anticipo basso o assente</li>
                  <li>• Reddito irregolare</li>
                  <li>• Durata lunga (72+ mesi)</li>
                  <li>• Auto usata o datata</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Quanto Anticipo Versare?
            </h3>
            <p className="mb-4">
              L'<strong>anticipo</strong> (o acconto) è fondamentale per ottenere condizioni migliori:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Minimo consigliato:</strong> 10-15% del prezzo del veicolo</li>
              <li><strong>Ideale:</strong> 20-30% per i tassi migliori</li>
              <li><strong>Vantaggi:</strong> Rata ridotta, meno interessi, maggiore approvazione</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📊 Esempio Pratico
              </p>
              <p className="text-sm text-blue-900">
                Auto da <strong>20.000 €</strong> finanziata per <strong>48 mesi</strong> al <strong>5,5% TAEG</strong>:<br />
                • Con anticipo del 10% (2.000 €): Rata mensile di <strong>414 €</strong><br />
                • Con anticipo del 20% (4.000 €): Rata mensile di <strong>368 €</strong><br />
                <strong className="text-blue-700">Risparmi 46 €/mese e 2.208 € sul prestito!</strong>
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Tassi Medi Prestito Auto in Italia (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Tipo di Veicolo</th>
                    <th className="px-4 py-2 text-left border">Durata</th>
                    <th className="px-4 py-2 text-right border">TAEG Medio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">Nuova</td>
                    <td className="px-4 py-2 border">24-36 mesi</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">4,5% - 6,5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Nuova</td>
                    <td className="px-4 py-2 border">48-60 mesi</td>
                    <td className="px-4 py-2 text-right border">5,5% - 7,5%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Usata recente</td>
                    <td className="px-4 py-2 border">24-48 mesi</td>
                    <td className="px-4 py-2 text-right border">6,5% - 8,5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Usata datata</td>
                    <td className="px-4 py-2 border">12-36 mesi</td>
                    <td className="px-4 py-2 text-right border text-red-700">8,0% - 11,0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Principali Finanziarie Auto in Italia
            </h3>
            <p className="mb-4">
              Puoi ottenere un prestito auto presso:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Banche tradizionali:</strong> Intesa Sanpaolo, UniCredit, BNL, Banco BPM</li>
              <li><strong>Banche online:</strong> Findomestic, Compass, Agos, Santander Consumer Bank</li>
              <li><strong>Finanziarie costruttori:</strong> FCA Bank, BMW Financial Services, Volkswagen Financial Services</li>
              <li><strong>Mediatori creditizi:</strong> Facile.it, MutuiOnline, PrestitiOnline</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Documenti Necessari per la Richiesta
            </h3>
            <div className="bg-neutral-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold mb-3">Per Lavoratori Dipendenti:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>✓ Documento d'identità (CI o passaporto)</li>
                <li>✓ Codice fiscale</li>
                <li>✓ Ultime 2 buste paga</li>
                <li>✓ CUD o modello 730</li>
                <li>✓ Estratto conto bancario</li>
              </ul>
              
              <h4 className="font-bold mb-3">Per Lavoratori Autonomi:</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Documento d'identità</li>
                <li>✓ Codice fiscale e Partita IVA</li>
                <li>✓ Ultimi 2 modelli Unico</li>
                <li>✓ Visura camerale (se impresa)</li>
                <li>✓ Estratti conto (6 mesi)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calcola la Tua Rata
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="prezzoVeicolo" className="text-base font-semibold">Prezzo del Veicolo (€)</Label>
              <Input
                id="prezzoVeicolo"
                type="text"
                value={prezzoVeicolo}
                onChange={(e) => setPrezzoVeicolo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="anticipo" className="text-base font-semibold">Anticipo (€)</Label>
              <Input
                id="anticipo"
                type="text"
                value={anticipo}
                onChange={(e) => setAnticipo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="durata" className="text-base font-semibold">Durata (mesi)</Label>
              <Input
                id="durata"
                type="number"
                value={durata}
                onChange={(e) => setDurata(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="tassoAnnuo" className="text-base font-semibold">Tasso di Interesse Annuo (%)</Label>
              <Input
                id="tassoAnnuo"
                type="text"
                value={tassoAnnuo}
                onChange={(e) => setTassoAnnuo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>
          </div>

          <Button
            onClick={calcolaPrestito}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calcola il Finanziamento
          </Button>

          {risultato && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Importo da Finanziare</p>
                <p className="text-3xl font-bold text-neutral-800">{formatEUR(risultato.importoFinanziare)}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Anticipo: {risultato.percentualeAnticipo.toFixed(1)}% del prezzo
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">La Tua Rata Mensile Sarà</p>
                <p className="text-4xl font-bold text-green-700">{formatEUR(risultato.rataMensile)}</p>
                <p className="text-xs text-green-600 mt-1">Per {durata} mesi</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Costo Totale</p>
                  <p className="text-xl font-bold text-neutral-800">{formatEUR(risultato.costoTotale)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Totale Interessi</p>
                  <p className="text-xl font-bold text-red-600">{formatEUR(risultato.interessiTotali)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">TAEG</p>
                  <p className="text-xl font-bold text-blue-600">{risultato.taeg.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Nota:</strong> Questo calcolo è una stima. Il TAEG reale può variare in base alle spese e assicurazioni di ogni finanziaria.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Consigli per Ottenere il Miglior Prestito Auto
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Confronta Almeno 3 Offerte</h3>
                <p className="text-sm text-neutral-600">
                  I tassi possono variare di 2-3 punti tra finanziarie. Usa un comparatore online.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Verifica il Tuo CRIF</h3>
                <p className="text-sm text-neutral-600">
                  Un buon punteggio CRIF può ridurre il tasso fino al 2%. Controlla prima di richiedere.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Scegli Durate Brevi</h3>
                <p className="text-sm text-neutral-600">
                  Un prestito a 36 mesi costa molto meno di uno a 60 mesi in termini di interessi.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Leggi Bene il Contratto</h3>
                <p className="text-sm text-neutral-600">
                  Verifica penali per estinzione anticipata, assicurazioni facoltative e spese nascoste.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            Questo calcolatore è uno strumento informativo. I risultati sono stime e possono variare in base alle condizioni di ogni finanziaria.
          </p>
        </div>
      </div>
    </>
  );
}
