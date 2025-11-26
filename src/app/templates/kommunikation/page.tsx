'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';

interface Kommunikationsplan {
  id: string;
  zielgruppe: string;
  kommunikationsziele: string;
  inhalteThemen: string;
  anlaesseHaeufigkeit: string;
  kanaele: string[];
  medialeFormate: string[];
  verantwortlich: string;
}

export default function KommunikationsplanungTemplate() {
  const [eintraege, setEintraege] = useState<Kommunikationsplan[]>([
    {
      id: '1',
      zielgruppe: '',
      kommunikationsziele: '',
      inhalteThemen: '',
      anlaesseHaeufigkeit: '',
      kanaele: [],
      medialeFormate: [],
      verantwortlich: ''
    }
  ]);

  const [showHelp, setShowHelp] = useState(false);

  // Vordefinierte Optionen
  const kanaeleOptionen = [
    'E-Mail',
    'Newsletter',
    'Website',
    'Social Media (LinkedIn)',
    'Social Media (Twitter/X)',
    'Social Media (Instagram)',
    'Social Media (Facebook)',
    'Pressemitteilung',
    'Blog',
    'Veranstaltungen',
    'Konferenzen',
    'Workshops',
    'Webinare',
    'Print-Medien',
    'Telefon',
    'Persönliche Gespräche'
  ];

  const formateOptionen = [
    'Textbeitrag',
    'Bildmaterial',
    'Video',
    'Infografik',
    'Podcast',
    'Präsentation',
    'Broschüre',
    'Factsheet',
    'Whitepaper',
    'Case Study',
    'Interview',
    'Pressemappe',
    'Flyer',
    'Poster',
    'Bericht'
  ];

  const addEintrag = () => {
    const newEintrag: Kommunikationsplan = {
      id: Date.now().toString(),
      zielgruppe: '',
      kommunikationsziele: '',
      inhalteThemen: '',
      anlaesseHaeufigkeit: '',
      kanaele: [],
      medialeFormate: [],
      verantwortlich: ''
    };
    setEintraege([...eintraege, newEintrag]);
  };

  const removeEintrag = (id: string) => {
    if (eintraege.length > 1) {
      setEintraege(eintraege.filter(e => e.id !== id));
    }
  };

  const updateEintrag = (id: string, field: keyof Kommunikationsplan, value: any) => {
    setEintraege(eintraege.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const toggleMultiSelect = (id: string, field: 'kanaele' | 'medialeFormate', value: string) => {
    setEintraege(eintraege.map(e => {
      if (e.id === id) {
        const currentArray = e[field];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(v => v !== value)
          : [...currentArray, value];
        return { ...e, [field]: newArray };
      }
      return e;
    }));
  };

  const handleExportTSV = () => {
    const headers = [
      'Zielgruppe',
      'Kommunikationsziele',
      'Inhalte / Themen',
      'Anlässe / Häufigkeit',
      'Kanäle',
      'Mediale Formate',
      'verantwortlich'
    ];

    const rows = eintraege.map(e => [
      e.zielgruppe,
      e.kommunikationsziele,
      e.inhalteThemen,
      e.anlaesseHaeufigkeit,
      e.kanaele.join(', '),
      e.medialeFormate.join(', '),
      e.verantwortlich
    ]);

    const tsvContent = [headers, ...rows].map(row => row.join('\t')).join('\n');

    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kommunikationsplanung.tsv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(eintraege, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kommunikationsplanung.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout currentPage="">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Planung Externe Kommunikation / ÖA</h1>
            <p className="text-gray-600 mt-2">
              Systematische Planung der externen Kommunikation und Öffentlichkeitsarbeit für Ihr Projekt
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              {showHelp ? '❌' : '❓'} Hilfe
            </button>
            <button
              onClick={handleExportTSV}
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
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Anleitung zur Kommunikationsplanung</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <strong>Zielgruppe:</strong> Wen möchten Sie erreichen? (z.B. Förderer, Partner, Fachpublikum, breite Öffentlichkeit)
              </div>
              <div>
                <strong>Kommunikationsziele:</strong> Was möchten Sie bei dieser Zielgruppe erreichen? (z.B. Informieren, Überzeugen, Mobilisieren, Image aufbauen)
              </div>
              <div>
                <strong>Inhalte / Themen:</strong> Welche Botschaften und Themen sind relevant?
              </div>
              <div>
                <strong>Anlässe / Häufigkeit:</strong> Wann und wie oft kommunizieren? (z.B. monatlich, bei Meilensteinen, Events)
              </div>
              <div>
                <strong>Kanäle:</strong> Über welche Kommunikationswege erreichen Sie die Zielgruppe?
              </div>
              <div>
                <strong>Mediale Formate:</strong> In welchem Format bereiten Sie die Inhalte auf?
              </div>
              <div>
                <strong>Verantwortlich:</strong> Wer ist für die Umsetzung zuständig?
              </div>
            </div>
          </div>
        )}

        {/* Add Entry Button */}
        <div className="mb-6">
          <button
            onClick={addEintrag}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            ➕ Zielgruppe hinzufügen
          </button>
        </div>

        {/* Entries List */}
        <div className="space-y-6">
          {eintraege.map((eintrag, index) => (
            <div key={eintrag.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Zielgruppe #{index + 1}
                </h3>
                {eintraege.length > 1 && (
                  <button
                    onClick={() => removeEintrag(eintrag.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    🗑️ Entfernen
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Zielgruppe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zielgruppe *
                  </label>
                  <input
                    type="text"
                    value={eintrag.zielgruppe}
                    onChange={(e) => updateEintrag(eintrag.id, 'zielgruppe', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="z.B. Förderer, Partner, Fachpublikum, Medien..."
                  />
                </div>

                {/* Kommunikationsziele */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kommunikationsziele
                  </label>
                  <textarea
                    value={eintrag.kommunikationsziele}
                    onChange={(e) => updateEintrag(eintrag.id, 'kommunikationsziele', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Was möchten Sie bei dieser Zielgruppe erreichen?"
                  />
                </div>

                {/* Inhalte / Themen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inhalte / Themen
                  </label>
                  <textarea
                    value={eintrag.inhalteThemen}
                    onChange={(e) => updateEintrag(eintrag.id, 'inhalteThemen', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Welche Botschaften und Themen sind relevant?"
                  />
                </div>

                {/* Anlässe / Häufigkeit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anlässe / Häufigkeit
                  </label>
                  <input
                    type="text"
                    value={eintrag.anlaesseHaeufigkeit}
                    onChange={(e) => updateEintrag(eintrag.id, 'anlaesseHaeufigkeit', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="z.B. monatlich, quartalsweise, bei Projektmeilensteinen..."
                  />
                </div>

                {/* Kanäle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kanäle (Mehrfachauswahl möglich)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {kanaeleOptionen.map(kanal => (
                      <button
                        key={kanal}
                        onClick={() => toggleMultiSelect(eintrag.id, 'kanaele', kanal)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                          eintrag.kanaele.includes(kanal)
                            ? 'bg-blue-100 text-blue-800 border-blue-500'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {eintrag.kanaele.includes(kanal) ? '✓ ' : ''}{kanal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mediale Formate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mediale Formate (Mehrfachauswahl möglich)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formateOptionen.map(format => (
                      <button
                        key={format}
                        onClick={() => toggleMultiSelect(eintrag.id, 'medialeFormate', format)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                          eintrag.medialeFormate.includes(format)
                            ? 'bg-purple-100 text-purple-800 border-purple-500'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {eintrag.medialeFormate.includes(format) ? '✓ ' : ''}{format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verantwortlich */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verantwortlich
                  </label>
                  <input
                    type="text"
                    value={eintrag.verantwortlich}
                    onChange={(e) => updateEintrag(eintrag.id, 'verantwortlich', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Name der verantwortlichen Person oder Stelle"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Zusammenfassung</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-900">{eintraege.length}</div>
              <div className="text-sm text-gray-600">Zielgruppen definiert</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">📢</div>
              <div className="text-2xl font-bold text-blue-600">
                {new Set(eintraege.flatMap(e => e.kanaele)).size}
              </div>
              <div className="text-sm text-gray-600">Verschiedene Kanäle</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(eintraege.flatMap(e => e.medialeFormate)).size}
              </div>
              <div className="text-sm text-gray-600">Verschiedene Formate</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">
                {eintraege.filter(e => e.zielgruppe && e.kommunikationsziele && e.verantwortlich).length}
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
                setEintraege([{
                  id: '1',
                  zielgruppe: '',
                  kommunikationsziele: '',
                  inhalteThemen: '',
                  anlaesseHaeufigkeit: '',
                  kanaele: [],
                  medialeFormate: [],
                  verantwortlich: ''
                }]);
              }
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Zurücksetzen
          </button>
          <button
            onClick={handleExportTSV}
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
