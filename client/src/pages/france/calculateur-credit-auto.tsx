import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalculateurCreditAutoFrance() {
  const [prixVehicule, setPrixVehicule] = useState("25000");
  const [apportPersonnel, setApportPersonnel] = useState("5000");
  const [duree, setDuree] = useState("48");
  const [tauxAnnuel, setTauxAnnuel] = useState("4.5");
  const [resultat, setResultat] = useState<any>(null);

  const calculerCredit = () => {
    const prix = parseFloat(prixVehicule.replace(/,/g, ""));
    const apport = parseFloat(apportPersonnel.replace(/,/g, ""));
    const mois = parseInt(duree);
    const tauxAnnuelNum = parseFloat(tauxAnnuel.replace(",", "."));

    if (isNaN(prix) || isNaN(apport) || isNaN(mois) || isNaN(tauxAnnuelNum)) {
      alert("Veuillez remplir tous les champs correctement");
      return;
    }

    const montantFinancer = prix - apport;
    const tauxMensuel = tauxAnnuelNum / 100 / 12;
    
    const mensualite = montantFinancer * (tauxMensuel * Math.pow(1 + tauxMensuel, mois)) / (Math.pow(1 + tauxMensuel, mois) - 1);
    
    const coutTotal = mensualite * mois;
    const interetsTotal = coutTotal - montantFinancer;
    const taeg = tauxAnnuelNum;

    setResultat({
      montantFinancer,
      mensualite,
      coutTotal,
      interetsTotal,
      taeg,
      pourcentageApport: (apport / prix) * 100
    });
  };

  const formatEUR = (valeur: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(valeur);
  };

  return (
    <>
      <Helmet>
        <title>Calculateur de Crédit Auto France 2025 | TAEG et Mensualités</title>
        <meta name="description" content="Calculateur gratuit de crédit automobile en France. Calculez votre mensualité, TAEG, intérêts totaux et trouvez les meilleurs taux pour votre financement auto." />
        <meta name="keywords" content="calculateur crédit auto France, financement automobile, crédit voiture, TAEG, mensualité auto, calculateur prêt auto" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/france/calculateur-credit-auto" />
        <html lang="fr-FR" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculateur de Crédit Auto en France
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculez votre mensualité, TAEG et le coût total de votre financement automobile gratuitement
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Comment Fonctionne le Crédit Auto en France ?
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              Le <strong>crédit automobile</strong> (ou prêt auto) est l'une des solutions les plus courantes pour financer l'achat d'un véhicule en France. Vous empruntez une somme d'argent auprès d'un organisme de crédit et la remboursez par <strong>mensualités fixes</strong> sur une période généralement comprise entre <strong>12 et 84 mois</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Qu'est-ce que le TAEG et Pourquoi est-il Important ?
            </h3>
            <p className="mb-4">
              Le <strong>TAEG (Taux Annuel Effectif Global)</strong> est l'indicateur le plus important pour comparer les offres de crédit auto en France. Il inclut :
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Le taux d'intérêt nominal :</strong> Le coût de l'argent emprunté</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Les frais de dossier :</strong> Frais administratifs de l'organisme</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>L'assurance emprunteur :</strong> Souvent obligatoire</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Autres frais :</strong> Garanties, frais de courtage éventuels</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Conseil Important
              </p>
              <p className="text-sm text-yellow-900">
                Comparez toujours le <strong>TAEG</strong>, pas seulement le taux nominal. Un crédit avec un taux bas mais des frais élevés peut coûter plus cher qu'un crédit avec un taux légèrement supérieur sans frais.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Facteurs qui Influencent Votre Taux d'Intérêt
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Réduisent votre taux :</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Bon dossier de crédit</li>
                  <li>• Apport personnel important (20%+)</li>
                  <li>• Revenus stables et élevés</li>
                  <li>• Durée courte (24-36 mois)</li>
                  <li>• Véhicule neuf vs occasion</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">✗ Augmentent votre taux :</h4>
                <ul className="text-sm text-red-900 space-y-1">
                  <li>• Fichage Banque de France</li>
                  <li>• Apport faible ou inexistant</li>
                  <li>• Revenus irréguliers</li>
                  <li>• Durée longue (72+ mois)</li>
                  <li>• Véhicule d'occasion ancien</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Quel Apport Personnel Prévoir ?
            </h3>
            <p className="mb-4">
              L'<strong>apport personnel</strong> est crucial pour obtenir de meilleures conditions :
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Minimum recommandé :</strong> 10% du prix du véhicule</li>
              <li><strong>Idéal :</strong> 20% à 30% pour les meilleurs taux</li>
              <li><strong>Avantages :</strong> Mensualité réduite, moins d'intérêts, meilleure acceptation</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📊 Exemple Concret
              </p>
              <p className="text-sm text-blue-900">
                Véhicule de <strong>25 000 €</strong> financé sur <strong>48 mois</strong> à <strong>4,5% TAEG</strong> :<br />
                • Avec apport de 10% (2 500 €) : Mensualité de <strong>515 €</strong><br />
                • Avec apport de 20% (5 000 €) : Mensualité de <strong>458 €</strong><br />
                <strong className="text-blue-700">Économie de 57 €/mois et 2 736 € sur le crédit !</strong>
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Taux Moyens de Crédit Auto en France (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Type de Véhicule</th>
                    <th className="px-4 py-2 text-left border">Durée</th>
                    <th className="px-4 py-2 text-right border">TAEG Moyen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">Neuf</td>
                    <td className="px-4 py-2 border">24-36 mois</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">3,5% - 5,0%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Neuf</td>
                    <td className="px-4 py-2 border">48-60 mois</td>
                    <td className="px-4 py-2 text-right border">4,5% - 6,5%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Occasion récente</td>
                    <td className="px-4 py-2 border">24-48 mois</td>
                    <td className="px-4 py-2 text-right border">5,0% - 7,0%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Occasion ancienne</td>
                    <td className="px-4 py-2 border">12-36 mois</td>
                    <td className="px-4 py-2 text-right border text-red-700">6,5% - 9,5%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Principaux Organismes de Crédit Auto en France
            </h3>
            <p className="mb-4">
              Vous pouvez obtenir un crédit automobile auprès de :
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Banques traditionnelles :</strong> BNP Paribas, Crédit Agricole, Société Générale, LCL</li>
              <li><strong>Banques en ligne :</strong> Boursorama, Fortuneo, Hello bank!</li>
              <li><strong>Organismes spécialisés :</strong> Cetelem, Cofidis, Sofinco, Franfinance</li>
              <li><strong>Constructeurs automobiles :</strong> PSA Finance, RCI Bank (Renault), BMW Financial Services</li>
              <li><strong>Courtiers en crédit :</strong> Meilleurtaux, Empruntis, Cafpi</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Documents Nécessaires pour Votre Demande
            </h3>
            <div className="bg-neutral-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold mb-3">Pour les Salariés :</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>✓ Pièce d'identité (CNI ou passeport)</li>
                <li>✓ Justificatif de domicile (moins de 3 mois)</li>
                <li>✓ 3 derniers bulletins de salaire</li>
                <li>✓ Dernier avis d'imposition</li>
                <li>✓ RIB (Relevé d'Identité Bancaire)</li>
              </ul>
              
              <h4 className="font-bold mb-3">Pour les Indépendants :</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Pièce d'identité</li>
                <li>✓ Justificatif de domicile</li>
                <li>✓ 2 derniers bilans comptables</li>
                <li>✓ Extrait Kbis (moins de 3 mois)</li>
                <li>✓ Derniers avis d'imposition</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calculez Votre Mensualité
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="prixVehicule" className="text-base font-semibold">Prix du Véhicule (€)</Label>
              <Input
                id="prixVehicule"
                type="text"
                value={prixVehicule}
                onChange={(e) => setPrixVehicule(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="apportPersonnel" className="text-base font-semibold">Apport Personnel (€)</Label>
              <Input
                id="apportPersonnel"
                type="text"
                value={apportPersonnel}
                onChange={(e) => setApportPersonnel(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="duree" className="text-base font-semibold">Durée (mois)</Label>
              <Input
                id="duree"
                type="number"
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="tauxAnnuel" className="text-base font-semibold">Taux d'Intérêt Annuel (%)</Label>
              <Input
                id="tauxAnnuel"
                type="text"
                value={tauxAnnuel}
                onChange={(e) => setTauxAnnuel(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>
          </div>

          <Button
            onClick={calculerCredit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculer le Financement
          </Button>

          {resultat && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Montant à Financer</p>
                <p className="text-3xl font-bold text-neutral-800">{formatEUR(resultat.montantFinancer)}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Apport : {resultat.pourcentageApport.toFixed(1)}% du prix
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Votre Mensualité Sera</p>
                <p className="text-4xl font-bold text-green-700">{formatEUR(resultat.mensualite)}</p>
                <p className="text-xs text-green-600 mt-1">Pendant {duree} mois</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Coût Total</p>
                  <p className="text-xl font-bold text-neutral-800">{formatEUR(resultat.coutTotal)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total des Intérêts</p>
                  <p className="text-xl font-bold text-red-600">{formatEUR(resultat.interetsTotal)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">TAEG</p>
                  <p className="text-xl font-bold text-blue-600">{resultat.taeg.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Note :</strong> Ce calcul est une estimation. Le TAEG réel peut varier selon les frais et assurances de chaque organisme.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Conseils pour Obtenir le Meilleur Crédit Auto
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Comparez au Moins 3 Offres</h3>
                <p className="text-sm text-neutral-600">
                  Les taux peuvent varier de 2 à 3 points entre organismes. Utilisez un comparateur en ligne.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Négociez les Frais de Dossier</h3>
                <p className="text-sm text-neutral-600">
                  Ces frais sont souvent négociables. Demandez leur réduction ou suppression.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Privilégiez les Durées Courtes</h3>
                <p className="text-sm text-neutral-600">
                  Un crédit sur 36 mois coûte beaucoup moins cher qu'un crédit sur 60 mois.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Vérifiez le Droit de Remboursement Anticipé</h3>
                <p className="text-sm text-neutral-600">
                  Assurez-vous de pouvoir rembourser par anticipation sans pénalités excessives.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            Ce calculateur est un outil informatif. Les résultats sont des estimations et peuvent varier selon les conditions de chaque organisme de crédit.
          </p>
        </div>
      </div>
    </>
  );
}
