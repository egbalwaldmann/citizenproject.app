'use client';

import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Templates() {
  const templates = [
    // Created templates (available now)
    {
      id: 'arbeitspaket',
      title: 'Arbeitspaketbeschreibung',
      description: 'Detaillierte Vorlage zur Beschreibung von Arbeitspaketen mit Zielen, Maßnahmen, Ressourcen und Zeitplanung',
      icon: '📋',
      category: 'Projektmanagement',
      url: '/templates/arbeitspaket',
      features: [
        'Ziele und Maßnahmen definieren',
        'Zeitplan mit Meilensteinen',
        'Ressourcen- und Unterstützungsplanung',
        'Export als JSON'
      ]
    },
    {
      id: 'stakeholder',
      title: 'Stakeholder-Analyse',
      description: 'Identifikation und Bewertung relevanter Stakeholder',
      icon: '👥',
      category: 'Kommunikation',
      url: '/templates/stakeholder',
      features: [
        'Stakeholder identifizieren',
        'Einfluss und Interesse bewerten',
        'Rollen und Einbeziehung definieren',
        'Export als TSV/JSON'
      ]
    },
    {
      id: 'kommunikation',
      title: 'Externe Kommunikation / ÖA',
      description: 'Planung der externen Kommunikation und Öffentlichkeitsarbeit',
      icon: '📢',
      category: 'Kommunikation',
      url: '/templates/kommunikation',
      features: [
        'Zielgruppen definieren',
        'Kommunikationsziele festlegen',
        'Kanäle und Formate auswählen',
        'Export als TSV/JSON'
      ]
    },
    // Coming soon templates
    {
      id: 'projektantrag',
      title: 'Projektantrag',
      description: 'Vorlage für Förderanträge und Projektbeschreibungen',
      icon: '📝',
      category: 'Förderung',
      url: '/templates/projektantrag',
      features: [
        'Projektziele und -beschreibung',
        'Finanzplanung',
        'Zeitplan und Meilensteine',
        'Team und Qualifikationen'
      ],
      comingSoon: true
    },
    {
      id: 'risikoanalyse',
      title: 'Risikoanalyse',
      description: 'Systematische Erfassung und Bewertung von Projektrisiken',
      icon: '⚠️',
      category: 'Risikomanagement',
      url: '/templates/risikoanalyse',
      features: [
        'Risikoidentifikation',
        'Bewertung (Wahrscheinlichkeit & Auswirkung)',
        'Maßnahmenplanung',
        'Risiko-Matrix'
      ],
      comingSoon: true
    },
    {
      id: 'meilensteinplan',
      title: 'Meilensteinplan',
      description: 'Übersichtliche Planung wichtiger Projektereignisse',
      icon: '🎯',
      category: 'Planung',
      url: '/templates/meilensteinplan',
      features: [
        'Meilensteine definieren',
        'Zeitliche Einordnung',
        'Verantwortlichkeiten',
        'Gantt-Visualisierung'
      ],
      comingSoon: true
    },
    {
      id: 'lessons-learned',
      title: 'Lessons Learned',
      description: 'Dokumentation von Projekterfahrungen und -erkenntnissen',
      icon: '💡',
      category: 'Wissensmanagement',
      url: '/templates/lessons-learned',
      features: [
        'Was lief gut?',
        'Was lief schlecht?',
        'Empfehlungen für Folgeprojekte',
        'Best Practices'
      ],
      comingSoon: true
    }
  ];

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <Layout currentPage="">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projekt-Templates</h1>
          <p className="text-gray-600 mt-2">
            Vorlagen für professionelles Projektmanagement – speziell für Hochschulen, NGOs und öffentliche Einrichtungen
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Diese Templates basieren auf bewährten Projektmanagement-Methoden und sind auf die Bedürfnisse
                nicht-kommerzieller Institutionen zugeschnitten.
              </p>
            </div>
          </div>
        </div>

        {/* Templates by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm mr-3">
                {category}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates
                .filter((t) => t.category === category)
                .map((template) => (
                  <div
                    key={template.id}
                    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                      template.comingSoon ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{template.icon}</div>
                        {template.comingSoon && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                            Demnächst
                          </span>
                        )}
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {template.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {template.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {template.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <svg
                              className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Action Button */}
                      {template.comingSoon ? (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                        >
                          In Entwicklung
                        </button>
                      ) : (
                        <Link
                          href={template.url}
                          className="block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Template öffnen →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Help Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📚 Hilfe und Anleitungen
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Benötigen Sie Unterstützung bei der Nutzung der Templates? Unsere Dokumentation
            hilft Ihnen bei der effektiven Projektplanung und -durchführung.
          </p>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              📖 Dokumentation
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              🎥 Video-Tutorials
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              💬 Support kontaktieren
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
