'use client';

import Layout from '@/components/Layout';

export default function Impressum() {
    return (
        <Layout currentPage="impressum">
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm my-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Angaben gemäß § 5 TMG & Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                        <p>
                            Egbal Waldmann<br />
                            Kaiser-Friedrich-Str. 131<br />
                            14469 Potsdam<br /><br />
                            Dr. Manuela Hackel
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Kontakt</h2>
                        <p>
                            Telefon: +49 160 4980070<br />
                            E-Mail: <a href="mailto:egbal@waldmann.dev" className="text-indigo-600 hover:text-indigo-800">egbal@waldmann.dev</a>
                        </p>
                    </section>

                    <section className="text-sm text-gray-500 mt-8 pt-8 border-t">
                        <p>
                            Dieses Impressum gilt für das Projekt "CitizenProject.App", welches als Proof of Concept erstellt wurde.
                        </p>
                    </section>
                </div>
            </div>
        </Layout >
    );
}
