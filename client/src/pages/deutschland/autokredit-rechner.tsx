import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function AutokreditRechnerDeutschland() {
  const [fahrzeugpreis, setFahrzeugpreis] = useState("25000");
  const [anzahlung, setAnzahlung] = useState("5000");
  const [laufzeit, setLaufzeit] = useState("60");
  const [zinssatz, setZinssatz] = useState("4.5");
  const [ergebnis, setErgebnis] = useState<{
    monatsrate: number;
    gesamtbetrag: number;
    gesamtzinsen: number;
    tilgungsplan: AmortizationRow[];
  } | null>(null);

  const berechneKredit = () => {
    const preis = parseFloat(fahrzeugpreis);
    const anzahlungBetrag = parseFloat(anzahlung);
    const monate = parseInt(laufzeit);
    const jahresZins = parseFloat(zinssatz) / 100;
    const monatsZins = jahresZins / 12;
    const kreditbetrag = preis - anzahlungBetrag;

    if (kreditbetrag <= 0 || monate <= 0 || monatsZins < 0) return;

    const rate = kreditbetrag * (monatsZins * Math.pow(1 + monatsZins, monate)) / (Math.pow(1 + monatsZins, monate) - 1);
    const gesamtbetrag = rate * monate;
    const gesamtzinsen = gesamtbetrag - kreditbetrag;

    const tilgungsplan: AmortizationRow[] = [];
    let restschuld = kreditbetrag;

    for (let i = 1; i <= monate; i++) {
      const zinsen = restschuld * monatsZins;
      const tilgung = rate - zinsen;
      restschuld -= tilgung;

      tilgungsplan.push({
        month: i,
        payment: rate,
        principal: tilgung,
        interest: zinsen,
        balance: Math.max(0, restschuld)
      });
    }

    setErgebnis({
      monatsrate: rate,
      gesamtbetrag,
      gesamtzinsen,
      tilgungsplan
    });
  };

  const formatEUR = (wert: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(wert);
  };

  return (
    <>
      <Helmet>
        <title>Autokredit Rechner Deutschland 2025 | Kfz-Finanzierung berechnen</title>
        <meta name="description" content="Kostenloser Autokredit Rechner für Deutschland. Berechnen Sie Ihre monatliche Rate, effektiven Jahreszins und Gesamtkosten für Ihre Autofinanzierung. Vergleichen Sie Zinssätze online." />
        <meta name="keywords" content="autokredit rechner, kfz finanzierung rechner, auto finanzierung deutschland, autokredit vergleich, effektiver jahreszins, monatsrate berechnen, autofinanzierung" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/deutschland/autokredit-rechner" />
        <html lang="de-DE" />
        <meta property="og:title" content="Autokredit Rechner Deutschland | Kfz-Finanzierung berechnen" />
        <meta property="og:description" content="Kostenloses Tool zur Berechnung Ihrer Autofinanzierung. Ermitteln Sie Monatsrate, Zinsen und Gesamtkosten." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/deutschland/autokredit-rechner" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "Autokredit Rechner Deutschland",
          "description": "Kostenloser Rechner für Autofinanzierung in Deutschland",
          "provider": {
            "@type": "Organization",
            "name": "Autokredit Rechner"
          },
          "featureList": ["Monatsrate berechnen", "Effektiver Jahreszins", "Tilgungsplan", "Gesamtkosten"],
          "areaServed": "DE"
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Kfz-Finanzierung Rechner",
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "operatingSystem": "Web"
        })}
      </script>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Autokredit Rechner – Berechnen Sie Ihre Kfz-Finanzierung in Deutschland
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Möchten Sie ein neues oder gebrauchtes Auto kaufen und benötigen eine Finanzierung? Mit unserem Autokredit Rechner können Sie einfach Ihre monatliche Rate, den Zinssatz und die Gesamtkosten des Kredits berechnen.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Wie funktioniert der Autokredit Rechner
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              Die Berechnung folgt dem <strong>Annuitätendarlehen-Modell</strong>, das in Deutschland am häufigsten von Banken und Finanzinstituten verwendet wird. Die Simulation berücksichtigt:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Fahrzeugpreis und Anzahlung</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Effektiver Jahreszins</strong> – durchschnittlich 4,5% in Deutschland</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Laufzeit der Finanzierung</strong> – von 12 bis 84 Monaten</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Gesamtzinsen</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Gesamtbetrag der Finanzierung</strong></span>
              </li>
            </ul>

            <p className="mb-6">
              Nach Abschluss der Berechnung sehen Sie den vollständigen Tilgungsplan mit der Entwicklung der Restschuld und den Gesamtkosten des Kredits.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                <Info className="inline h-5 w-5 mr-1" />
                Finanzbildung und Transparenz
              </p>
              <p className="text-sm text-blue-900">
                Dieser Rechner wurde entwickelt, um Transparenz und Finanzbildung zu fördern. Das Verständnis der tatsächlichen Kosten einer Autofinanzierung ermöglicht es Ihnen, fundierte Entscheidungen zu treffen und Überschuldung zu vermeiden. Wir empfehlen immer, mehrere Angebote zu vergleichen und die Vertragsbedingungen sorgfältig zu lesen, bevor Sie eine finanzielle Verpflichtung eingehen.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Berechnen Sie Ihre Autofinanzierung
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="fahrzeugpreis" className="text-base font-semibold">Fahrzeugpreis (€)</Label>
              <Input
                id="fahrzeugpreis"
                type="number"
                value={fahrzeugpreis}
                onChange={(e) => setFahrzeugpreis(e.target.value)}
                className="mt-2 text-lg"
                placeholder="25000"
              />
            </div>

            <div>
              <Label htmlFor="anzahlung" className="text-base font-semibold">Anzahlung (€)</Label>
              <Input
                id="anzahlung"
                type="number"
                value={anzahlung}
                onChange={(e) => setAnzahlung(e.target.value)}
                className="mt-2 text-lg"
                placeholder="5000"
              />
            </div>

            <div>
              <Label htmlFor="laufzeit" className="text-base font-semibold">Laufzeit (Monate)</Label>
              <Input
                id="laufzeit"
                type="number"
                value={laufzeit}
                onChange={(e) => setLaufzeit(e.target.value)}
                className="mt-2 text-lg"
                placeholder="60"
              />
            </div>

            <div>
              <Label htmlFor="zinssatz" className="text-base font-semibold">Effektiver Jahreszins (%)</Label>
              <Input
                id="zinssatz"
                type="number"
                step="0.1"
                value={zinssatz}
                onChange={(e) => setZinssatz(e.target.value)}
                className="mt-2 text-lg"
                placeholder="4.5"
              />
            </div>
          </div>

          <Button
            onClick={berechneKredit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Monatsrate berechnen
          </Button>

          {ergebnis && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Kreditbetrag</p>
                <p className="text-3xl font-bold text-neutral-800">
                  {formatEUR(parseFloat(fahrzeugpreis) - parseFloat(anzahlung))}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Ihre Monatsrate</p>
                <p className="text-4xl font-bold text-green-700">{formatEUR(ergebnis.monatsrate)}</p>
                <p className="text-xs text-green-600 mt-1">Für {laufzeit} Monate</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Gesamtbetrag</p>
                  <p className="text-xl font-bold text-neutral-800">{formatEUR(ergebnis.gesamtbetrag)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Gesamtzinsen</p>
                  <p className="text-xl font-bold text-red-600">{formatEUR(ergebnis.gesamtzinsen)}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Hinweis:</strong> Diese Berechnung ist indikativ. Die tatsächlichen Werte können je nach den spezifischen Bedingungen jedes Finanzinstituts variieren.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {ergebnis && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tilgungsplan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Monat</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Tilgung</TableHead>
                      <TableHead>Zinsen</TableHead>
                      <TableHead>Restschuld</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ergebnis.tilgungsplan.slice(0, 12).map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{formatEUR(row.payment)}</TableCell>
                        <TableCell>{formatEUR(row.principal)}</TableCell>
                        <TableCell>{formatEUR(row.interest)}</TableCell>
                        <TableCell>{formatEUR(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {ergebnis.tilgungsplan.length > 12 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Zeigt die ersten 12 Monate von {ergebnis.tilgungsplan.length} Monaten
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Vorteile des Autokredit Rechners
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Vergleichen Sie verschiedene Zinssätze und Laufzeiten</h3>
                <p className="text-sm text-neutral-600">
                  Bevor Sie einen Kredit beantragen, probieren Sie verschiedene Kombinationen aus, um die beste Lösung zu finden.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Verstehen Sie die Auswirkung der Anzahlung</h3>
                <p className="text-sm text-neutral-600">
                  Sehen Sie, wie eine höhere Anzahlung die monatliche Rate erheblich reduziert.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Berechnen Sie die Gesamtkosten der Finanzierung</h3>
                <p className="text-sm text-neutral-600">
                  Basierend auf realen Daten des deutschen Marktes mit durchschnittlich 4,5% effektivem Jahreszins.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Alles online, ohne Verpflichtung</h3>
                <p className="text-sm text-neutral-600">
                  Führen Sie unbegrenzte Simulationen durch, ohne persönliche Daten oder Kontakte zu teilen.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Autofinanzierung in Deutschland – Was Sie wissen sollten
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              In Deutschland nutzen mehr als die Hälfte der Autokäufer eine <strong>Autofinanzierung</strong>. Verträge können direkt mit Banken, Finanzinstituten oder über Autohändler (Leasing, Ballonfinanzierung, Direktkredit) abgeschlossen werden.
            </p>

            <p className="mb-4">
              Der <strong>durchschnittliche effektive Jahreszins</strong> liegt zwischen <strong>3,5% und 6%</strong>, abhängig vom Kundenprofil, Fahrzeugtyp und Laufzeit. Der durchschnittlich finanzierte Betrag liegt bei <strong>€20.000 bis €30.000</strong>, mit Laufzeiten zwischen <strong>48 und 72 Monaten</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Vor Vertragsunterzeichnung immer prüfen:
            </h3>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>Den <strong>effektiven Jahreszins</strong> (nicht nur den Sollzins)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>Die <strong>Gesamtkosten</strong> der Finanzierung</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>Alle <strong>Gebühren und Versicherungen</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>Die Bedingungen für <strong>vorzeitige Rückzahlung</strong></span>
              </li>
            </ul>

            <div className="bg-neutral-50 p-6 rounded-lg my-6">
              <h4 className="font-bold text-neutral-800 mb-3">💡 Wichtiger Tipp</h4>
              <p className="text-sm text-neutral-700">
                Experimentieren Sie mit dem Rechner, indem Sie die Anzahlung oder Laufzeit ändern, und sehen Sie, wie sich dies auf die monatliche Rate auswirkt. Eine Anzahlung von 20% bis 30% des Fahrzeugwerts kann die Gesamtzinsen erheblich reduzieren.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Nutzen Sie den Rechner und finden Sie heraus, wie viel Sie für Ihr Auto zahlen werden
          </h2>
          
          <p className="text-neutral-700 mb-4">
            Unser Rechner wurde entwickelt, um deutschen Verbrauchern zu helfen, fundierte Entscheidungen zu treffen. Sie müssen kein Finanzexperte sein – füllen Sie einfach die Felder aus und lassen Sie den Rechner die Berechnungen für Sie durchführen.
          </p>

          <p className="text-neutral-700">
            Dieses Tool ist völlig kostenlos, erfordert keine Registrierung und respektiert Ihre Privatsphäre. Nutzen Sie es so oft Sie möchten, um die beste Finanzierungslösung für Ihr nächstes Auto zu finden.
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            Dieser Rechner ist ein Informationswerkzeug. Die Ergebnisse sind ungefähre Angaben und können je nach den spezifischen Bedingungen jedes Finanzinstituts variieren. Konsultieren Sie immer einen Fachmann, bevor Sie finanzielle Entscheidungen treffen.
          </p>
        </div>
      </div>
    </>
  );
}
