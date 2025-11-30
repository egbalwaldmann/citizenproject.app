'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';

interface Stakeholder {
  id: string;
  name: string;
  einfluss: 'hoch' | 'mittel' | 'niedrig' | '';
  chanceRisiko: string;
  quantInteresse: string;
  qualInteresse: string;
  rolle: string[];
  einbeziehung: string[];
}

export default function StakeholderAnalyse() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    {
      id: '1',
      name: '',
      einfluss: '',
      chanceRisiko: '',
      quantInteresse: '',
      qualInteresse: '',
      rolle: [],
      einbeziehung: []
    }
  ]);

  const [showHelp, setShowHelp] = useState(false);

  const einflussStufen = ['hoch', 'mittel', 'niedrig'];
  const chanceRisikoOptionen = ['Chance', 'Risiko', 'offen'];
  const interesseStufen = ['hoch', 'mittel', 'niedrig', 'offen'];
  const rollenOptionen = [
    'Sponsor',
    'Partner',
    'Multiplikator/Plattform',
    'Kontaktvermittler',
    'Input/Info'
  ];
  const einbeziehungOptionen = [
    'Information/Bericht',
    'Dialog',
    'Kollaboration (punktuell)',
    'Partnerschaft (längerfristig)'
  ];

  const addStakeholder = () => {
    const newStakeholder: Stakeholder = {
      id: Date.now().toString(),
      name: '',
      einfluss: '',
      chanceRisiko: '',
      quantInteresse: '',
      qualInteresse: '',
      rolle: [],
      einbeziehung: []
    };
    setStakeholders([...stakeholders, newStakeholder]);
  };

  const removeStakeholder = (id: string) => {
    if (stakeholders.length > 1) {
      setStakeholders(stakeholders.filter(s => s.id !== id));
    }
  };

  const updateStakeholder = (id: string, field: keyof Stakeholder, value: any) => {
    setStakeholders(stakeholders.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const toggleMultiSelect = (id: string, field: 'rolle' | 'einbeziehung', value: string) => {
    setStakeholders(stakeholders.map(s => {
      if (s.id === id) {
        const currentArray = s[field];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(v => v !== value)
          : [...currentArray, value];
        return { ...s, [field]: newArray };
      }
      return s;
    }));
  };

  const handleExport = () => {
    // Export as TSV
    const headers = [
      'Stakeholder',
      'Einfluss',
      'Chance / Risiko',
      'quant. Interesse',
      'qual. Interesse',
      'Rolle für Projekt',
      'Art d. Einbeziehung'
    ];

    const rows = stakeholders.map(s => [
      s.name,
      s.einfluss,
      s.chanceRisiko,
      s.quantInteresse,
      s.qualInteresse,
      s.rolle.join(', '),
      s.einbeziehung.join(', ')
    ]);

    const tsvContent = [headers, ...rows].map(row => row.join('\t')).join('\n');

    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stakeholder-analyse.tsv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(stakeholders, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stakeholder-analyse.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEinflussColor = (einfluss: string) => {
    switch (einfluss) {
      case 'hoch': return 'bg-red-100 text-red-800';
      case 'mittel': return 'bg-yellow-100 text-yellow-800';
      case 'niedrig': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const loadExampleData = () => {
    if (confirm('Möchten Sie die aktuellen Daten mit Beispieldaten überschreiben?')) {
      setStakeholders([
        {
          id: '1',
          name: 'Geschäftsführung / Auftraggeber',
          einfluss: 'hoch',
          chanceRisiko: 'Chance',
          quantInteresse: 'hoch',
          qualInteresse: 'Strategische Weiterentwicklung, Effizienzsteigerung',
          rolle: ['Sponsor'],
          einbeziehung: ['Information/Bericht', 'Dialog']
        },
        {
          id: '2',
          name: 'Projektteam (Kernteam)',
          einfluss: 'mittel',
          chanceRisiko: 'Chance',
          quantInteresse: 'hoch',
          qualInteresse: 'Fachliche Umsetzung, Kompetenzerweiterung',
          rolle: ['Partner', 'Input/Info'],
          einbeziehung: ['Kollaboration (punktuell)', 'Dialog']
        },
        {
          id: '3',
          name: 'Betriebsrat',
          einfluss: 'hoch',
          chanceRisiko: 'Risiko',
          quantInteresse: 'mittel',
          qualInteresse: 'Einhaltung von Mitarbeiterrechten, Datenschutz',
          rolle: ['Input/Info'],
          einbeziehung: ['Dialog', 'Information/Bericht']
        },
        {
          id: '4',
          name: 'Endanwender / User',
          einfluss: 'niedrig',
          chanceRisiko: 'Chance',
          quantInteresse: 'hoch',
          qualInteresse: 'Einfache Bedienbarkeit, Arbeitserleichterung',
          rolle: ['Input/Info'],
          einbeziehung: ['Dialog', 'Kollaboration (punktuell)']
        },
        {
          id: '5',
          name: 'Externe IT-Dienstleister',
          einfluss: 'mittel',
          chanceRisiko: 'offen',
          quantInteresse: 'mittel',
          qualInteresse: 'Folgeaufträge, Referenzprojekt',
          rolle: ['Partner'],
          einbeziehung: ['Partnerschaft (längerfristig)']
        }
      ]);
    }
  };

  return (
    <Layout currentPage="">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stakeholder-Analyse</h1>
            <p className="text-gray-600 mt-2">
              Identifizieren und bewerten Sie relevante Stakeholder für Ihr Projekt
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadExampleData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📋 Beispiel laden
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              {showHelp ? '❌' : '❓'} Hilfe
            </button>
            <button
              onClick={handleExport}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              📥 TSV Export
            </button>
            <button
              onClick={handleExportJSON}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              💾 JSON Export
            </button>
          </div>
        </div>

        {/* Help Section */}
        {showHelp && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Anleitung zur Stakeholder-Analyse</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <strong>Einfluss:</strong> Wie viel Einfluss hat der Stakeholder auf das Projekt?
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><span className="text-red-800">Hoch:</span> Kann Projekterfolg maßgeblich beeinflussen</li>
                  <li><span className="text-yellow-800">Mittel:</span> Hat relevanten, aber nicht entscheidenden Einfluss</li>
                  <li><span className="text-green-800">Niedrig:</span> Minimaler direkter Einfluss</li>
                </ul>
              </div>
              <div>
                <strong>Chance / Risiko:</strong> Stellt der Stakeholder eine Chance oder ein Risiko dar?
              </div>
              <div>
                <strong>Interesse:</strong> Wie interessiert ist der Stakeholder am Projekt?
              </div>
              <div>
                <strong>Rolle:</strong> Welche Rolle(n) nimmt der Stakeholder im Projekt ein?
              </div>
              <div>
                <strong>Art der Einbeziehung:</strong> Wie sollte der Stakeholder eingebunden werden?
              </div>
            </div>
          </div>
        )}

        {/* Add Stakeholder Button */}
        <div className="mb-6">
          <button
            onClick={addStakeholder}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            ➕ Stakeholder hinzufügen
          </button>
        </div>

        {/* Stakeholders List */}
        <div className="space-y-6">
          {stakeholders.map((stakeholder, index) => (
            <div key={stakeholder.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Stakeholder #{index + 1}
                </h3>
                {stakeholders.length > 1 && (
                  <button
                    onClick={() => removeStakeholder(stakeholder.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    🗑️ Entfernen
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stakeholder *
                  </label>
                  <input
                    type="text"
                    value={stakeholder.name}
                    onChange={(e) => updateStakeholder(stakeholder.id, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                    placeholder="Name oder Bezeichnung des Stakeholders"
                  />
                </div>

                {/* Einfluss */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Einfluss
                  </label>
                  <div className="flex gap-2">
                    {einflussStufen.map(stufe => (
                      <button
                        key={stufe}
                        onClick={() => updateStakeholder(stakeholder.id, 'einfluss', stufe)}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${stakeholder.einfluss === stufe
                          ? getEinflussColor(stufe) + ' border-current'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {stufe.charAt(0).toUpperCase() + stufe.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chance / Risiko */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chance / Risiko
                  </label>
                  <input
                    type="text"
                    value={stakeholder.chanceRisiko}
                    onChange={(e) => updateStakeholder(stakeholder.id, 'chanceRisiko', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                    placeholder="z.B. Chance, Risiko, offen"
                  />
                </div>

                {/* Quantitatives Interesse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantitatives Interesse
                  </label>
                  <div className="flex gap-2">
                    {['hoch', 'mittel', 'niedrig'].map(stufe => (
                      <button
                        key={stufe}
                        onClick={() => updateStakeholder(stakeholder.id, 'quantInteresse', stufe)}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${stakeholder.quantInteresse === stufe
                          ? getEinflussColor(stufe) + ' border-current'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {stufe.charAt(0).toUpperCase() + stufe.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qualitatives Interesse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualitatives Interesse
                  </label>
                  <textarea
                    value={stakeholder.qualInteresse}
                    onChange={(e) => updateStakeholder(stakeholder.id, 'qualInteresse', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                    placeholder="Welches Interesse hat der Stakeholder am Projekt?"
                  />
                </div>

                {/* Rolle für Projekt */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rolle für Projekt (Mehrfachauswahl möglich)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {rollenOptionen.map(rolle => (
                      <button
                        key={rolle}
                        onClick={() => toggleMultiSelect(stakeholder.id, 'rolle', rolle)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${stakeholder.rolle.includes(rolle)
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-500'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {stakeholder.rolle.includes(rolle) ? '✓ ' : ''}{rolle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Art der Einbeziehung */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Art der Einbeziehung (Mehrfachauswahl möglich)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {einbeziehungOptionen.map(art => (
                      <button
                        key={art}
                        onClick={() => toggleMultiSelect(stakeholder.id, 'einbeziehung', art)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${stakeholder.einbeziehung.includes(art)
                          ? 'bg-green-100 text-green-800 border-green-500'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {stakeholder.einbeziehung.includes(art) ? '✓ ' : ''}{art}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Zusammenfassung</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-900">{stakeholders.length}</div>
              <div className="text-sm text-gray-600">Stakeholder erfasst</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">🔴</div>
              <div className="text-2xl font-bold text-red-600">
                {stakeholders.filter(s => s.einfluss === 'hoch').length}
              </div>
              <div className="text-sm text-gray-600">Hoher Einfluss</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">
                {stakeholders.filter(s => s.name && s.einfluss).length}
              </div>
              <div className="text-sm text-gray-600">Vollständig ausgefüllt</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => {
              if (confirm('Möchten Sie alle Daten wirklich zurücksetzen?')) {
                setStakeholders([{
                  id: '1',
                  name: '',
                  einfluss: '',
                  chanceRisiko: '',
                  quantInteresse: '',
                  qualInteresse: '',
                  rolle: [],
                  einbeziehung: []
                }]);
              }
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Zurücksetzen
          </button>
          <button
            onClick={handleExport}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            📥 TSV Export
          </button>
          <button
            onClick={handleExportJSON}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            💾 JSON Export
          </button>
        </div>
      </div>
    </Layout>
  );
}
