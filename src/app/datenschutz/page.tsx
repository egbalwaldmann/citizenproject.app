'use client';

import Layout from '@/components/Layout';

export default function Datenschutz() {
    return (
        <Layout currentPage="datenschutz">
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm my-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Datenschutz auf einen Blick</h2>
                        <h3 className="font-medium text-gray-900 mt-2">Allgemeine Hinweise</h3>
                        <p>
                            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                            Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Allgemeine Hinweise und Pflichtinformationen</h2>
                        <h3 className="font-medium text-gray-900 mt-2">Datenschutz</h3>
                        <p>
                            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und
                            entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                        </p>
                        <h3 className="font-medium text-gray-900 mt-2">Hinweis zur verantwortlichen Stelle</h3>
                        <p>
                            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
                            Egbal Waldmann<br />
                            Kaiser-Friedrich-Str. 131<br />
                            14469 Potsdam<br />
                            Telefon: +49 160 4980070<br />
                            E-Mail: egbal@waldmann.dev<br /><br />
                            Dr. Manuela Hackel
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Datenerfassung auf unserer Website</h2>
                        <p>
                            Da dies ein Proof of Concept ist, werden keine personenbezogenen Daten dauerhaft gespeichert oder an Dritte weitergegeben.
                            Eingegebene Daten (z.B. in Formularen) werden lediglich im lokalen Speicher Ihres Browsers (LocalStorage) für Demonstrationszwecke abgelegt.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Cookies</h2>
                        <p>
                            Diese Website verwendet keine Cookies. Es werden keine Informationen auf Ihrem Endgerät in Form von Cookies gespeichert oder ausgelesen.
                            Die Speicherung von Daten erfolgt ausschließlich über den lokalen Speicher (LocalStorage) Ihres Browsers, der technisch notwendig ist, um die Funktionalität des Proof of Concepts zu demonstrieren.
                        </p>
                    </section>
                </div>
            </div>
        </Layout>
    );
}
