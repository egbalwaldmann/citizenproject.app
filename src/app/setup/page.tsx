'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';
import Link from 'next/link';

export default function ProjectSetupWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        projectType: '',
        teamSize: '',
        duration: '',
        complexity: '',
        budget: '',
        projectName: '',
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const updateFormData = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Was für ein Projekt möchtest du starten?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Forschungsprojekt', 'Veranstaltung / Event', 'Kooperationsprojekt', 'IT / Software-Entwicklung', 'Soziales Engagement / NGO', 'Sonstiges'].map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            updateFormData('projectType', type);
                            handleNext();
                        }}
                        className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${formData.projectType === type
                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                            : 'border-gray-200 hover:border-indigo-300'
                            }`}
                    >
                        <span className="block text-lg font-medium text-gray-900">{type}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Wie groß ist das Team und der Zeitrahmen?</h2>

            <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">Wie viele Personen sollen mitarbeiten?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Ein Mitarbeiter', 'Zwei bis fünf Mitarbeiter', 'Mehr als fünf Mitarbeiter'].map((size) => (
                        <button
                            key={size}
                            onClick={() => updateFormData('teamSize', size)}
                            className={`p-4 border rounded-lg text-center transition-colors ${formData.teamSize === size
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">Geschätzte Dauer?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Ein Monat und kürzer', 'Zwei bis sechs Monate', '6 Monate bis ein Jahr', 'Länger als ein Jahr'].map((duration) => (
                        <button
                            key={duration}
                            onClick={() => updateFormData('duration', duration)}
                            className={`p-4 border rounded-lg text-center transition-colors ${formData.duration === duration
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                                }`}
                        >
                            {duration}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 font-medium">
                    ← Zurück
                </button>
                <button
                    onClick={handleNext}
                    disabled={!formData.teamSize || !formData.duration}
                    className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${!formData.teamSize || !formData.duration
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    Weiter
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Wie komplex ist das Vorhaben?</h2>

            <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">Anzahl der Teilprojekte</label>
                <div className="space-y-3">
                    {[
                        { value: 'Nur ein Teilprojekt', desc: 'Überschaubar, Fokus auf ein Hauptziel' },
                        { value: 'Zwei bis fünf Teilprojekte', desc: 'Mittlere Komplexität, Koordination erforderlich' },
                        { value: 'Mehr als fünf Teilprojekte', desc: 'Hohe Komplexität, umfangreiches Programmmanagement' }
                    ].map((item) => (
                        <button
                            key={item.value}
                            onClick={() => updateFormData('complexity', item.value)}
                            className={`w-full p-4 border rounded-lg text-left transition-colors flex items-center justify-between ${formData.complexity === item.value
                                ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600'
                                : 'bg-white border-gray-300 hover:border-indigo-400'
                                }`}
                        >
                            <span className="font-medium text-gray-900">{item.value}</span>
                            <span className="text-sm text-gray-500">{item.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 font-medium">
                    ← Zurück
                </button>
                <button
                    onClick={handleNext}
                    disabled={!formData.complexity}
                    className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${!formData.complexity
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    Weiter
                </button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Zusammenfassung & Empfehlung</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dein Projektprofil:</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Typ</dt>
                        <dd className="mt-1 text-lg text-gray-900">{formData.projectType}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Teamgröße</dt>
                        <dd className="mt-1 text-lg text-gray-900">{formData.teamSize}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Dauer</dt>
                        <dd className="mt-1 text-lg text-gray-900">{formData.duration}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Komplexität</dt>
                        <dd className="mt-1 text-lg text-gray-900">{formData.complexity}</dd>
                    </div>
                </dl>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Unsere Empfehlung:</h3>
                <p className="text-indigo-800 mb-4">
                    Basierend auf deinen Angaben empfehlen wir dir das <strong>
                        {formData.complexity === 'Mehr als fünf Teilprojekte' ? 'Umfangreiche Projekt-Template' :
                            formData.complexity === 'Zwei bis fünf Teilprojekte' ? 'Standard-Projekt-Template' : 'Lean-Projekt-Template'}
                    </strong>.
                </p>
                <ul className="list-disc list-inside text-indigo-700 space-y-1 mb-4">
                    <li>Vorkonfigurierte Phasen für {formData.projectType}</li>
                    <li>Rollenverteilung für {formData.teamSize}</li>
                    {formData.complexity === 'Mehr als fünf Teilprojekte' && <li>Erweiterte Reporting-Funktionen aktiviert</li>}
                </ul>
            </div>

            <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gib deinem Projekt einen Namen:</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg text-gray-900 placeholder-gray-500"
                    placeholder="Mein tolles Projekt"
                    value={formData.projectName}
                    onChange={(e) => updateFormData('projectName', e.target.value)}
                />
            </div>

            <div className="flex justify-between pt-6 items-center">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 font-medium">
                    ← Zurück
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (!formData.projectName) return;

                        // Create new project object
                        const newProject = {
                            id: Date.now(), // Simple ID generation
                            name: formData.projectName,
                            description: `Ein ${formData.projectType} Projekt mit ${formData.teamSize} und einer Dauer von ${formData.duration}. Komplexität: ${formData.complexity}`,
                            progress: 0,
                            status: 'planning',
                            team: [], // Empty team for now
                            startDate: new Date().toISOString().split('T')[0],
                            deadline: '', // No deadline set yet
                            budget: '' // No budget set yet
                        };

                        // Save to localStorage
                        const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
                        localStorage.setItem('projects', JSON.stringify([...existingProjects, newProject]));

                        // Navigate to projects page
                        window.location.href = '/projects';
                    }}
                    className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${!formData.projectName
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'
                        }`}
                    disabled={!formData.projectName}
                >
                    Projekt erstellen 🚀
                </button>
            </div>
        </div>
    );

    return (
        <Layout currentPage="setup">
            <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                            <span>Start</span>
                            <span>Details</span>
                            <span>Komplexität</span>
                            <span>Abschluss</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(step / 4) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
