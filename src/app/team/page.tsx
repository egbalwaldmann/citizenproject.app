'use client';

import Layout from '@/components/Layout';

export default function TeamPage() {
  return (
    <Layout currentPage="team">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Unser Team</h1>
          <p className="text-xl text-gray-600">
            Die Köpfe hinter CitizenProject.App
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Egbal Waldmann */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-8 text-center border border-white/50">
            <div className="w-32 h-32 bg-indigo-100 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
              👨‍💻
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Egbal Waldmann</h2>
            <p className="text-indigo-600 font-medium mb-4">Entwicklung & Technik</p>
            <p className="text-gray-600 mb-6">
              Verantwortlich für die technische Umsetzung, Architektur und Entwicklung der Plattform.
            </p>
            <a href="mailto:egbal@waldmann.dev" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              egbal@waldmann.dev
            </a>
          </div>

          {/* Dr. Manuela Hackel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-8 text-center border border-white/50">
            <div className="w-32 h-32 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
              👩‍🔬
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dr. Manuela Hackel</h2>
            <p className="text-indigo-600 font-medium mb-4">Projektmanagement & Konzeption</p>
            <p className="text-gray-600 mb-6">
              Erfahrene Projektmanagerin, verantwortlich für die fachliche Konzeption und strategische Ausrichtung.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
