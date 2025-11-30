

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      // Get the last 3 projects
      setRecentProjects(projects.slice(-3).reverse());
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-purple-200">

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="group">
                <h1 className="text-2xl font-bold text-indigo-600">
                  CitizenProject<span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse mx-0.5 group-hover:scale-125 transition-transform"></span>App
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium">
                Startseite
              </Link>
              <Link href="/projects" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Projekte
              </Link>

              {/* Dropdown for Resources */}
              <div className="relative group">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 inline-flex items-center">
                  Ressourcen
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-0 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/processes"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Prozesse
                  </Link>
                  <Link
                    href="/templates"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Vorlagen
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    href="/tasks"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Aufgaben
                  </Link>
                  <Link
                    href="/team"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Team
                  </Link>
                  <Link
                    href="/files"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Dateien
                  </Link>
                </div>
              </div>

              <a
                href="https://github.com/egbalwaldmann/citizenproject.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-md transition-colors"
                aria-label="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Willkommen bei CitizenProject.App
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Die moderne Plattform für Bürgerbeteiligung und Projektmanagement.
          </p>
          <p className="mt-2 text-sm text-gray-400 font-medium bg-white/50 inline-block px-3 py-1 rounded-full backdrop-blur-sm border border-gray-100">
            🚧 Proof of Concept
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Create New */}
          <Link href="/setup" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-indigo-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Neues Projekt</h2>
            <p className="text-gray-600">
              Starte ein neues Vorhaben mit unserem geführten Setup-Assistenten.
            </p>
          </Link>

          {/* My Projects */}
          <Link href="/projects" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-indigo-200">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📂
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Meine Projekte</h2>
            <p className="text-gray-600">
              Übersicht aller laufenden Projekte, Status und Fortschritte.
            </p>
          </Link>

          {/* Templates */}
          <Link href="/templates" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-indigo-200">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📋
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Vorlagen & Tools</h2>
            <p className="text-gray-600">
              Zugriff auf Stakeholder-Analysen, Kommunikationspläne und mehr.
            </p>
          </Link>
        </div>

        {/* Recent Projects Section */}
        {recentProjects.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Zuletzt bearbeitet</h2>
              <Link href="/projects" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Alle ansehen →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-900 truncate">{project.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">Fortschritt: {project.progress}%</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Alles was du für dein Projekt brauchst</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Gantt-Charts</h3>
              <p className="text-sm text-gray-600">Visualisiere deinen Zeitplan und Abhängigkeiten.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="text-2xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">Finanzübersicht</h3>
              <p className="text-sm text-gray-600">Behalte Budget und Ausgaben im Blick.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="text-2xl mb-3">👥</div>
              <h3 className="font-bold text-gray-900 mb-2">Stakeholder</h3>
              <p className="text-sm text-gray-600">Analysiere und manage deine Interessengruppen.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="text-2xl mb-3">📢</div>
              <h3 className="font-bold text-gray-900 mb-2">Kommunikation</h3>
              <p className="text-sm text-gray-600">Plane deine PR und interne Kommunikation.</p>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/50 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 flex items-center gap-4">
              <span>&copy; {new Date().getFullYear()} CitizenProject.App - Proof of Concept</span>
              <span className="text-gray-300">|</span>
              <Link href="/team" className="hover:text-indigo-600 transition-colors">
                Team
              </Link>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/impressum" className="hover:text-indigo-600 transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-indigo-600 transition-colors">
                Datenschutz
              </Link>
              <Link href="/barrierefreiheit" className="hover:text-indigo-600 transition-colors">
                Barrierefreiheit
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
