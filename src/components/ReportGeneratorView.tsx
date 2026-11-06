import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Sparkles,
  Download,
  Loader2,
  Building,
  UserCheck
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { NotificationService } from '../services/notificationService';

export const ReportGeneratorView: React.FC = () => {
  const patients = StorageService.getPatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  
  const [reportType, setReportType] = useState<'LETTRE_SORTIE' | 'COMPTE_RENDU_HOSPITALISATION' | 'BILLET_TRANSFERT' | 'PROTOCOLE_OPERATOIRE'>('LETTRE_SORTIE');
  const [medecinNom, setMedecinNom] = useState<string>('Dr. Patrick Kalambayi (Chef de Clinique)');
  const [etablissement, setEtablissement] = useState<string>('Cliniques Universitaires de Kinshasa — Département de Médecine Interne');
  const [serviceDestinataire, setServiceDestinataire] = useState<string>('Médecin traitant / Centre de Santé de référence');

  const [diagnosticPrincipal, setDiagnosticPrincipal] = useState<string>('Paludisme grave à Plasmodium falciparum avec prostration et thrombopénie modérée, guéri');
  const [motifHospitalisation, setMotifHospitalisation] = useState<string>('Accès fébrile aigu à 39.5°C avec intolérance digestive totale et asthénie majeure');
  const [resumeSejour, setResumeSejour] = useState<string>('Traitement d\'attaque par Artésunate injectable (2,4 mg/kg à H0, H12, H24). Relais réussi par Artéméther-Luméfantrine PO pendant 3 jours. Apyrexie durable depuis J2. Goutte épaisse de contrôle à J3 négative.');
  const [traitementSortie, setTraitementSortie] = useState<string>('1. Paracétamol 1g si céphalées ou température > 38°C (max 3g/j)\n2. Fumarate ferreux + Acide folique 1 cp/j pendant 1 mois\n3. Utilisation stricte de moustiquaire imprégnée d\'insecticide (MILD)');
  const [consignesSuivi, setConsignesSuivi] = useState<string>('Consultation de contrôle à J14 avec NFS et goutte épaisse. Consulter en urgence si réapparition de la fièvre ou signes d\'ictère.');

  // AI & Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    const payload = {
      reportType,
      etablissement,
      medecinNom,
      serviceDestinataire,
      patient: {
        nom: `${selectedPatient?.nom} ${selectedPatient?.postnom}`,
        code: selectedPatient?.codeDossier,
        age: selectedPatient?.ageAns,
        sexe: selectedPatient?.sexe,
        poids: selectedPatient?.poidsKg
      },
      diagnosticPrincipal,
      motifHospitalisation,
      resumeSejour,
      traitementSortie,
      consignesSuivi
    };

    try {
      const res = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setGeneratedReport(data.report || 'Compte rendu généré avec succès.');

      NotificationService.addNotification({
        titre: 'Nouveau Compte Rendu Médical Archivé',
        message: `Le document médical pour ${selectedPatient?.codeDossier || 'le patient'} est prêt pour impression ou transfert.`,
        categorie: 'PATIENT',
        priorite: 'NORMALE',
        lienTab: 'rapports'
      });
    } catch {
      // Deterministic standard document fallback
      const today = new Date().toLocaleDateString('fr-FR');
      let fallback = `=================================================================\n`;
      fallback += `${etablissement.toUpperCase()}\n`;
      fallback += `SERVICE DE SOINS MÉDICAUX ET HOSPITALISATION\n`;
      fallback += `=================================================================\n\n`;
      fallback += `DOCUMENT : ${reportType === 'LETTRE_SORTIE' ? 'LETTRE DE SORTIE D\'HOSPITALISATION' : reportType === 'BILLET_TRANSFERT' ? 'BILLET DE TRANSFERT D\'URGENCE' : 'COMPTE RENDU CLINIQUE'}\n`;
      fallback += `Date d'édition : ${today}\n`;
      fallback += `Praticien rédacteur : ${medecinNom}\n`;
      fallback += `Destinataire : ${serviceDestinataire}\n\n`;
      fallback += `IDENTIFICATION DU PATIENT :\n`;
      fallback += `- Nom et Postnom : ${selectedPatient?.nom} ${selectedPatient?.postnom}\n`;
      fallback += `- Dossier : ${selectedPatient?.codeDossier} · Sexe : ${selectedPatient?.sexe} · Âge : ${selectedPatient?.ageAns} ans · Poids : ${selectedPatient?.poidsKg} kg\n\n`;
      fallback += `1. DIAGNOSTIC PRINCIPAL RETENU :\n${diagnosticPrincipal}\n\n`;
      fallback += `2. MOTIF D'ADMISSION INITIAL :\n${motifHospitalisation}\n\n`;
      fallback += `3. ÉVOLUTION CLINIQUE ET THÉRAPEUTIQUE EN SALLE :\n${resumeSejour}\n\n`;
      fallback += `4. ORDONNANCE ET TRAITEMENT DE SORTIE :\n${traitementSortie}\n\n`;
      fallback += `5. CONSIGNES DE SURVEILLANCE ET RENDEZ-VOUS :\n${consignesSuivi}\n\n`;
      fallback += `Signature et cachet du médecin :\n\n\n___________________________________\n${medecinNom}`;
      setGeneratedReport(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedReport) return;
    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            Générateur de Comptes Rendus & Billets Médicaux
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Rédaction assistée de lettres de sortie, comptes rendus d'hospitalisation et billets de transfert urgent aux normes hospitalières.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {generatedReport && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer Document</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            Paramètres du Document Médical
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                Type de Document
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="LETTRE_SORTIE">Lettre de Sortie d'Hospitalisation</option>
                <option value="COMPTE_RENDU_HOSPITALISATION">Compte Rendu d'Hospitalisation (CRH)</option>
                <option value="BILLET_TRANSFERT">Billet de Transfert d'Urgence</option>
                <option value="PROTOCOLE_OPERATOIRE">Protocole Opératoire / Acte</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                Dossier Patient
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-semibold"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.codeDossier} — {p.nom} {p.postnom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                Établissement / Hôpital
              </label>
              <input
                type="text"
                value={etablissement}
                onChange={(e) => setEtablissement(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                Médecin Rédacteur
              </label>
              <input
                type="text"
                value={medecinNom}
                onChange={(e) => setMedecinNom(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Diagnostic Principal Retenu
            </label>
            <input
              type="text"
              value={diagnosticPrincipal}
              onChange={(e) => setDiagnosticPrincipal(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-semibold"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Motif d'Admission & Résumé Clinique
            </label>
            <textarea
              rows={2}
              value={motifHospitalisation}
              onChange={(e) => setMotifHospitalisation(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Évolution en Salle & Traitements Reçus
            </label>
            <textarea
              rows={3}
              value={resumeSejour}
              onChange={(e) => setResumeSejour(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Traitement de Sortie Prescrit
            </label>
            <textarea
              rows={2}
              value={traitementSortie}
              onChange={(e) => setTraitementSortie(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Consignes d'Alerte & Rendez-vous de Contrôle
            </label>
            <textarea
              rows={2}
              value={consignesSuivi}
              onChange={(e) => setConsignesSuivi(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mise en page médicale IA en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Générer le Document Structuré avec l'IA
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Document Preview */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Aperçu Officiel du Document
            </h3>
            <span className="text-[10px] text-slate-400">Édition & Impression</span>
          </div>

          {generatedReport ? (
            <textarea
              rows={24}
              value={generatedReport}
              onChange={(e) => setGeneratedReport(e.target.value)}
              className="w-full text-xs p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg text-slate-400">
              <FileText className="w-12 h-12 stroke-[1.2] text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Aucun document généré pour le moment.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Remplissez les rubriques cliniques à gauche et cliquez sur « Générer le Document Structuré » pour composer la lettre ou le billet de transfert.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
