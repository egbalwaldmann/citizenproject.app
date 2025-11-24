'use client';

import Link from 'next/link';

export default function Intern() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">CitizenProject.App</Link>
              <span className="ml-4 text-sm bg-red-100 text-red-800 px-2 py-1 rounded">INTERN</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <a 
                href="https://github.com/egbalwaldmann/citizenproject.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-md transition-colors"
                aria-label="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interne Ressourcen</h1>
          <p className="text-gray-600 mt-2">Vergleiche, Analysen und interne Dokumentation für das CitizenProject.App Team</p>
        </div>

        {/* Software Comparison Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Projektmanagement-Software Vergleich</h2>
          <p className="text-gray-600 mb-6">
            Detaillierter Vergleich führender Projektmanagement-Lösungen mit Fokus auf Open Source, EU-Datenresidenz und DSGVO-Konformität
          </p>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                      Software
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Open Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EU Datenresidenz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DSGVO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max. User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Komplexe Projekte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kosten/Nutzer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anfängerfreundlich
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wissensmanagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KI-Integration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projekttypen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anpassbarkeit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* CitizenProject.App - Highlighted */}
                  <tr className="bg-indigo-50 border-l-4 border-indigo-500">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky left-0 z-10 bg-indigo-50 text-indigo-900">
                      CitizenProject.App
                      <span className="ml-2 text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">Empfehlung</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Unbegrenzt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-green-600">0€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★★</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★★</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Geplant</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Agil, Hybrid, Traditionell</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★★</td>
                  </tr>
                  
                  {/* OpenProject */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky left-0 z-10 bg-white text-gray-900">OpenProject</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Unbegrenzt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">0€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Agil, Traditionell</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★☆☆</td>
                  </tr>
                  
                  {/* Jira */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky left-0 z-10 bg-white text-gray-900">Jira</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Unbegrenzt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">7,50€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★☆☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Agil</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★☆☆</td>
                  </tr>
                  
                  {/* Asana */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky left-0 z-10 bg-white text-gray-900">Asana</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">10,99€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★☆☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Agil, Hybrid</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★☆☆</td>
                  </tr>
                  
                  {/* Trello */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky left-0 z-10 bg-white text-gray-900">Trello</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">200</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">5€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★★</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★☆☆☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kanban</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★☆☆☆</td>
                  </tr>
                  
                  {/* Notion */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky left-0 z-10 bg-white text-gray-900">Notion</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Unbegrenzt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">4€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★★</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Hybrid</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★☆</td>
                  </tr>
                  
                  {/* ClickUp */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky left-0 z-10 bg-white text-gray-900">ClickUp</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Unbegrenzt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">9€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Agil, Hybrid, Traditionell</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★☆</td>
                  </tr>
                  
                  {/* Monday.com */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky left-0 z-10 bg-white text-gray-900">Monday.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Unbegrenzt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">8€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★☆☆☆</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Agil, Hybrid</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">★★★★☆</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Warum CitizenProject.App?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>• <strong>Vollständig Open Source</strong> - Transparenz und Community-getrieben</p>
                  <p>• <strong>EU-Datenresidenz</strong> - Ihre Daten bleiben in Europa</p>
                  <p>• <strong>Kostenlos</strong> - Keine versteckten Kosten oder User-Limits</p>
                  <p>• <strong>Bildungsfokus</strong> - Speziell für Universitäten und NGOs entwickelt</p>
                  <p>• <strong>Maximal anpassbar</strong> - Für alle Projekttypen und Prozesse</p>
                  <p>• <strong>DSGVO-konform</strong> - Datenschutz von Grund auf mitgedacht</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}