import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">CitizenProject.App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/projects" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Projects
              </Link>
              <Link href="/tasks" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Tasks
              </Link>
              <Link href="/team" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Team
              </Link>
              <Link href="/files" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Files
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Projektmanagement für Bildung, NGOs und öffentliche Institutionen
          </h1>
          <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
            CitizenProject.App unterstützt Hochschulen, NGOs, Vereine und öffentliche Einrichtungen dabei, komplexe Projekte ohne teure Software
            und Spezialwissen zu planen, umzusetzen und nachhaltig zu dokumentieren.
          </p>
          
          <div className="flex justify-center space-x-4 mb-12">
            <Link 
              href="/dashboard"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/projects"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Projekte entdecken
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Für Nonprofits & Bildung gemacht</h3>
              <p className="text-gray-800">
                Optimierte Workflows für Hochschulen, NGOs, Vereine und öffentliche Einrichtungen – von Drittmittelprojekten bis Kulturveranstaltungen.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">DSGVO-konform & Vendor-Lock-in-frei</h3>
              <p className="text-gray-800">
                Open Source, Datenresidenz in Europa und keine proprietären Abhängigkeiten – geeignet für den öffentlichen Dienst.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-4">🧭</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Hilft Projektmanagement-Laien</h3>
              <p className="text-gray-800">
                Geführte Abläufe, Vorlagen und Wissenstransfer statt leerer Tools – damit Teams ohne PM-Erfahrung sicher starten können.
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Section */}
        <section className="mt-20 max-w-7xl mx-auto text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Warum CitizenProject.App?</h2>
          <p className="text-gray-700 mb-2">
            Projekte sind Alltag in Hochschulen, Verwaltungen, NGOs und Vereinen – doch oft fehlen Zeit, Budget und Projektmanagement-Wissen.
          </p>
          <p className="text-gray-700 mb-2">
            Bestehende Tools sind häufig zu teuer, zu komplex oder nicht DSGVO-konform. Wissen aus Projekten bleibt an einzelnen Personen hängen
            und geht beim Wechsel von Mitarbeitenden verloren.
          </p>
          <p className="text-gray-700">
            CitizenProject.App setzt hier an: als offene, anpassbare Plattform, die gute Projektpraxis für zivilgesellschaftliche Akteure
            zugänglich macht – im Sinne der Sustainable Development Goals (SDGs).
          </p>
        </section>

        {/* Target Groups Section */}
        <section className="mt-16 max-w-7xl mx-auto text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wer profitiert?</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <span className="font-semibold">Bildung & Forschung:</span> Hochschulen, Schulen und Forschungseinrichtungen mit komplexen
              Projektlandschaften.
            </li>
            <li>
              <span className="font-semibold">NGOs & Vereine:</span> gemeinnützige Organisationen, Kultur- und Bürgerinitiativen mit knappen Ressourcen.
            </li>
            <li>
              <span className="font-semibold">Öffentliche Einrichtungen:</span> Ministerien, Verwaltungen und andere öffentlich-rechtliche Träger
              mit hohen Compliance-Anforderungen.
            </li>
            <li>
              <span className="font-semibold">Internationale Partner ohne IT-Know-how:</span> Projektverbünde, die einfache, webbasierte Lösungen brauchen.
            </li>
          </ul>
        </section>

        {/* Team Section */}
        <section className="mt-16 max-w-7xl mx-auto text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wer wir sind</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Egbal Waldmann – Tech & Produkt</h3>
              <p className="text-gray-800 mb-2">
                Full‑Stack‑Entwickler mit Fokus auf Webanwendungen, agilen Projekten und digitalen Tools in Hochschulen und NGOs.
              </p>
              <p className="text-gray-800">
                Motivation: faire, zugängliche Open‑Source‑Software für Bildung und Zivilgesellschaft, die komplexe Projekte ohne Vendor‑Lock‑in ermöglicht.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dr. Manuela Hackel – Projektmanagement & Inhalte</h3>
              <p className="text-gray-800 mb-2">
                Projektmanagerin mit PMP‑Zertifikat und langjähriger Erfahrung in Hochschulen, Vereinen und öffentlichen Institutionen.
              </p>
              <p className="text-gray-800">
                Bringt Wissen aus traditionellen und hybriden Projektformen ein, definiert Qualitätskriterien und sorgt für praxisnahe Vorlagen und Abläufe.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
