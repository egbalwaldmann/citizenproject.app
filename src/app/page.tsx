

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

    </div>
  );
}
