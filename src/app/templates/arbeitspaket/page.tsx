'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';

export default function Arbeitspaket() {
  const [formData, setFormData] = useState({
    nummer: '',
    bezeichnung: '',
    verantwortlich: '',
    ziele: '',
    massnahmen: ['', '', '', '', '', '', '', ''],
    ergebnisse: ['', '', '', ''],
    startDatum: '',
    endeDatum: '',
    fortschritt: {
      '25': '',
      '50': '',
      '75': '',
      '100': ''
    },
    unterstuetzung: [
      { was: '', durchWen: '', zeitraum: '' },
      { was: '', durchWen: '', zeitraum: '' },
      { was: '', durchWen: '', zeitraum: '' },
      { was: '', durchWen: '', zeitraum: '' }
    ],
    ressourcen: [
      { was: '', stueck: '', zeitraum: '' },
      { was: '', stueck: '', zeitraum: '' },
      { was: '', stueck: '', zeitraum: '' },
      { was: '', stueck: '', zeitraum: '' },
      { was: '', stueck: '', zeitraum: '' },
      { was: '', stueck: '', zeitraum: '' }
    ],
    ersteSchritte: ['', '', '', '']
  });

  const updateMassnahme = (index: number, value: string) => {
    const newMassnahmen = [...formData.massnahmen];
    newMassnahmen[index] = value;
    setFormData({ ...formData, massnahmen: newMassnahmen });
  };

  const updateErgebnis = (index: number, value: string) => {
    const newErgebnisse = [...formData.ergebnisse];
    newErgebnisse[index] = value;
    setFormData({ ...formData, ergebnisse: newErgebnisse });
  };

  const updateUnterstuetzung = (index: number, field: 'was' | 'durchWen' | 'zeitraum', value: string) => {
    const newUnterstuetzung = [...formData.unterstuetzung];
    newUnterstuetzung[index] = { ...newUnterstuetzung[index], [field]: value };
    setFormData({ ...formData, unterstuetzung: newUnterstuetzung });
  };

  const updateRessource = (index: number, field: 'was' | 'stueck' | 'zeitraum', value: string) => {
    const newRessourcen = [...formData.ressourcen];
    newRessourcen[index] = { ...newRessourcen[index], [field]: value };
    setFormData({ ...formData, ressourcen: newRessourcen });
  };

  const updateErsterSchritt = (index: number, value: string) => {
    const newErsteSchritte = [...formData.ersteSchritte];
    newErsteSchritte[index] = value;
    setFormData({ ...formData, ersteSchritte: newErsteSchritte });
  };

  const handleSave = () => {
    console.log('Arbeitspaket gespeichert:', formData);
    alert('Arbeitspaket wurde gespeichert! (Demo-Modus)');
  };

  const handleExport = () => {
    const jsonString = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arbeitspaket-${formData.nummer || 'neu'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout currentPage="">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Arbeitspaketbeschreibung</h1>
            <p className="text-gray-600 mt-2">Erstellen Sie eine detaillierte Arbeitspaketbeschreibung für Ihr Projekt</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              📥 Exportieren
            </button>
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              💾 Speichern
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Header Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nummer</label>
              <input
                type="text"
                value={formData.nummer}
                onChange={(e) => setFormData({ ...formData, nummer: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="z.B. AP-001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bezeichnung</label>
              <input
                type="text"
                value={formData.bezeichnung}
                onChange={(e) => setFormData({ ...formData, bezeichnung: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Name des Arbeitspakets"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Verantwortlich</label>
              <input
                type="text"
                value={formData.verantwortlich}
                onChange={(e) => setFormData({ ...formData, verantwortlich: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Name der verantwortlichen Person"
              />
            </div>
          </div>

          {/* Ziele Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ziele</label>
            <textarea
              value={formData.ziele}
              onChange={(e) => setFormData({ ...formData, ziele: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Beschreiben Sie die Ziele dieses Arbeitspakets..."
            />
          </div>

          {/* Maßnahmen Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maßnahmen (Unterarbeitspakete/Aufgaben)</h3>
            <div className="space-y-3">
              {formData.massnahmen.map((massnahme, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={massnahme}
                    onChange={(e) => updateMassnahme(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Maßnahme ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ergebnisse / Outputs Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ergebnisse / Outputs</h3>
            <div className="space-y-3">
              {formData.ergebnisse.map((ergebnis, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={ergebnis}
                    onChange={(e) => updateErgebnis(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Ergebnis ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Zeitplan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start</label>
                <input
                  type="date"
                  value={formData.startDatum}
                  onChange={(e) => setFormData({ ...formData, startDatum: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ende</label>
                <input
                  type="date"
                  value={formData.endeDatum}
                  onChange={(e) => setFormData({ ...formData, endeDatum: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Fortschritt-Zeitpunkte</label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['25', '50', '75', '100'].map((percent) => (
                  <div key={percent}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{percent}%</label>
                    <input
                      type="date"
                      value={formData.fortschritt[percent as keyof typeof formData.fortschritt]}
                      onChange={(e) => setFormData({
                        ...formData,
                        fortschritt: { ...formData.fortschritt, [percent]: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benötigte Unterstützung Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benötigte Unterstützung</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Was</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Durch wen</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Zeitraum</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.unterstuetzung.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.was}
                          onChange={(e) => updateUnterstuetzung(index, 'was', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Benötigte Unterstützung"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.durchWen}
                          onChange={(e) => updateUnterstuetzung(index, 'durchWen', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Person/Team"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.zeitraum}
                          onChange={(e) => updateUnterstuetzung(index, 'zeitraum', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="z.B. KW 10-12"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benötigte Ressourcen Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benötigte Ressourcen</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ressource</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Stück</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Zeitraum</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.ressourcen.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.was}
                          onChange={(e) => updateRessource(index, 'was', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="z.B. Laptop, Budget, Raum"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.stueck}
                          onChange={(e) => updateRessource(index, 'stueck', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Anzahl"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.zeitraum}
                          onChange={(e) => updateRessource(index, 'zeitraum', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="z.B. Jan-Mrz"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Erste Schritte Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Erste Schritte</h3>
            <div className="space-y-3">
              {formData.ersteSchritte.map((schritt, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={schritt}
                    onChange={(e) => updateErsterSchritt(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Erster Schritt ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                if (confirm('Möchten Sie das Formular wirklich zurücksetzen?')) {
                  window.location.reload();
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
              📥 Exportieren
            </button>
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              💾 Speichern
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
