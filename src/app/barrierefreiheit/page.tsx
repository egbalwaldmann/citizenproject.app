'use client';

import Layout from '@/components/Layout';

export default function Barrierefreiheit() {
    return (
        <Layout currentPage="barrierefreiheit">
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm my-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Erklärung zur Barrierefreiheit</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <p>
                            Wir sind bemüht, unsere Webseiten im Einklang mit den nationalen Rechtsvorschriften zur Umsetzung der Richtlinie (EU) 2016/2102 des Europäischen Parlaments und des Rates barrierefrei zugänglich zu machen.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Stand der Vereinbarkeit mit den Anforderungen</h2>
                        <p>
                            Diese Website ist als Proof of Concept entwickelt worden. Wir arbeiten kontinuierlich daran, die Barrierefreiheit zu verbessern.
                            Aktuell sind folgende Maßnahmen umgesetzt:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Verwendung von semantischem HTML</li>
                            <li>Ausreichende Kontraste bei Texten und Hintergründen</li>
                            <li>Skalierbarkeit von Schriften</li>
                            <li>Tastaturnavigierbarkeit der wesentlichen Elemente</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Kontakt / Feedback</h2>
                        <p>
                            Sollten Ihnen Mängel in Bezug auf die barrierefreie Gestaltung auffallen, wenden Sie sich bitte an:<br /><br />
                            Egbal Waldmann<br />
                            E-Mail: <a href="mailto:egbal@waldmann.dev" className="text-indigo-600 hover:text-indigo-800">egbal@waldmann.dev</a>
                        </p>
                    </section>
                </div>
            </div>
        </Layout>
    );
}
