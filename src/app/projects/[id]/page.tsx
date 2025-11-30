'use client';

import Layout from '@/components/Layout';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

// Mock Data Types
interface Task {
    id: string;
    title: string;
    assignee: string;
    dueDate: string;
    status: 'open' | 'in-progress' | 'done';
    urgent?: boolean;
}

interface WorkPackage {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: 'planned' | 'active' | 'completed';
    tasks: Task[];
}

interface FinanceItem {
    category: string;
    budget: number;
    actual: number;
    status: 'ok' | 'warning' | 'critical';
}

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [project, setProject] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [wpFilter, setWpFilter] = useState<'all' | 'mine' | 'urgent'>('all');
    const [ganttView, setGanttView] = useState<'project' | 'detailed'>('project');

    // Mock Data Generation (in a real app, this would come from the backend/project data)
    const workPackages: WorkPackage[] = [
        {
            id: 'wp1',
            title: 'AP 1: Projektinitialisierung',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'completed',
            tasks: [
                { id: 't1', title: 'Kick-off Meeting', assignee: 'Alice Johnson', dueDate: '2024-01-05', status: 'done' },
                { id: 't2', title: 'Stakeholder Analyse', assignee: 'Bob Smith', dueDate: '2024-01-15', status: 'done' }
            ]
        },
        {
            id: 'wp2',
            title: 'AP 2: Konzeption & Planung',
            startDate: '2024-02-01',
            endDate: '2024-03-31',
            status: 'active',
            tasks: [
                { id: 't3', title: 'Feinkonzept erstellen', assignee: 'Alice Johnson', dueDate: '2024-02-20', status: 'in-progress', urgent: true },
                { id: 't4', title: 'Ressourcenplanung', assignee: 'Carol Davis', dueDate: '2024-02-25', status: 'open' },
                { id: 't5', title: 'Budgetfreigabe', assignee: 'David Wilson', dueDate: '2024-02-15', status: 'open', urgent: true }
            ]
        },
        {
            id: 'wp3',
            title: 'AP 3: Durchführung',
            startDate: '2024-04-01',
            endDate: '2024-08-31',
            status: 'planned',
            tasks: [
                { id: 't6', title: 'Entwicklung MVP', assignee: 'Dev Team', dueDate: '2024-06-30', status: 'open' },
                { id: 't7', title: 'Testing', assignee: 'QA Team', dueDate: '2024-07-15', status: 'open' }
            ]
        }
    ];

    const finances: FinanceItem[] = [
        { category: 'Personalkosten', budget: 50000, actual: 15000, status: 'ok' },
        { category: 'Reisekosten', budget: 5000, actual: 4500, status: 'warning' },
        { category: 'Material / Lizenzen', budget: 10000, actual: 2000, status: 'ok' },
        { category: 'Externe Dienstleister', budget: 20000, actual: 25000, status: 'critical' }
    ];

    useEffect(() => {
        const savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
            const projects = JSON.parse(savedProjects);
            const foundProject = projects.find((p: any) => p.id.toString() === resolvedParams.id);
            setProject(foundProject);
        }
    }, [resolvedParams.id]);

    if (!project) return <div>Laden...</div>;

    // Render Functions
    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Projektstatus</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Gesamtfortschritt</span>
                            <span className="font-bold text-indigo-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-green-700">3</div>
                            <div className="text-xs text-green-600">Offene Meilensteine</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-red-700">2</div>
                            <div className="text-xs text-red-600">Überfällige Aufgaben</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Team & Kontakt</h3>
                <div className="space-y-3">
                    {project.team && project.team.map((member: string, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                    {member.charAt(0)}
                                </div>
                                <span className="text-gray-900">{member}</span>
                            </div>
                            <a href={`mailto:${member.toLowerCase().replace(' ', '.')}@example.com`} className="text-gray-400 hover:text-indigo-600">
                                ✉️
                            </a>
                        </div>
                    ))}
                    <Link href="/team" className="block text-center text-sm text-indigo-600 hover:text-indigo-800 mt-4">
                        Zur vollständigen Kontaktliste →
                    </Link>
                </div>
            </div>
        </div>
    );

    const renderWorkPackages = () => (
        <div className="space-y-6">
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setWpFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${wpFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
                >
                    Alle Pakete
                </button>
                <button
                    onClick={() => setWpFilter('mine')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${wpFilter === 'mine' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
                >
                    Meine Pakete
                </button>
                <button
                    onClick={() => setWpFilter('urgent')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${wpFilter === 'urgent' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
                >
                    ⚠️ Dringend / Überfällig
                </button>
            </div>

            {workPackages.map((wp) => (
                <div key={wp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <details className="group" open>
                        <summary className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="transform group-open:rotate-90 transition-transform">▶</span>
                                <h3 className="font-bold text-gray-900">{wp.title}</h3>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${wp.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    wp.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {wp.status}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">{wp.startDate} - {wp.endDate}</span>
                        </summary>
                        <div className="p-4 border-t border-gray-200">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <th className="pb-2">Aufgabe</th>
                                        <th className="pb-2">Verantwortlich</th>
                                        <th className="pb-2">Deadline</th>
                                        <th className="pb-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {wp.tasks.map(task => (
                                        <tr key={task.id} className={`border-b last:border-0 ${task.urgent ? 'bg-red-50' : ''}`}>
                                            <td className="py-3 font-medium text-gray-900">
                                                {task.urgent && '⚠️ '} {task.title}
                                            </td>
                                            <td className="py-3 text-gray-600">{task.assignee}</td>
                                            <td className="py-3 text-gray-600">{task.dueDate}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-xs ${task.status === 'done' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>
            ))}
        </div>
    );

    const renderFinances = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {finances.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-900">{item.category}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full font-bold ${item.status === 'ok' ? 'bg-green-100 text-green-800' :
                                item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {item.status === 'ok' ? 'Im Plan' : item.status === 'warning' ? 'Kritisch' : 'Über Budget'}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Ausgegeben: {item.actual.toLocaleString()} €</span>
                                <span className="text-gray-900 font-medium">Budget: {item.budget.toLocaleString()} €</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full ${item.status === 'critical' ? 'bg-red-600' :
                                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-600'
                                        }`}
                                    style={{ width: `${Math.min((item.actual / item.budget) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-right text-gray-500">
                                {Math.round((item.actual / item.budget) * 100)}% verbraucht
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">Gesamtbudget Status</h4>
                <p className="text-indigo-800 text-sm">
                    Das Projekt liegt insgesamt bei <strong>52% Budgetausschöpfung</strong>.
                    Achtung: Der Posten "Externe Dienstleister" überschreitet das geplante Budget deutlich.
                </p>
            </div>
        </div>
    );

    const renderGantt = () => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Zeitplan (Gantt)</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setGanttView('project')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${ganttView === 'project' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
                    >
                        Projektübersicht
                    </button>
                    <button
                        onClick={() => setGanttView('detailed')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${ganttView === 'detailed' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
                    >
                        Detailansicht
                    </button>
                </div>
            </div>

            {/* Simplified Gantt Visualization */}
            <div className="min-w-[800px]">
                {/* Timeline Header */}
                <div className="grid grid-cols-12 gap-1 mb-4 border-b pb-2">
                    {['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'].map(m => (
                        <div key={m} className="text-xs font-bold text-gray-500 text-center">{m}</div>
                    ))}
                </div>

                {/* Gantt Bars */}
                <div className="space-y-4">
                    {workPackages.map((wp, idx) => (
                        <div key={wp.id} className="relative">
                            <div className="flex items-center justify-between text-sm mb-1 px-2">
                                <span className="font-medium text-gray-900">{wp.title}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-1 h-8 bg-gray-50 rounded">
                                {/* This is a mock positioning logic. In a real app, calculate col-start and col-span based on dates */}
                                <div
                                    className={`rounded h-6 mt-1 flex items-center px-2 text-xs text-white font-medium shadow-sm
                    ${idx === 0 ? 'col-start-1 col-span-1 bg-green-500' :
                                            idx === 1 ? 'col-start-2 col-span-2 bg-blue-500' :
                                                'col-start-4 col-span-5 bg-indigo-400'}
                  `}
                                >
                                    {wp.status}
                                </div>
                            </div>

                            {/* Subtasks in Detail View */}
                            {ganttView === 'detailed' && (
                                <div className="mt-2 space-y-1 pl-4 border-l-2 border-gray-200 ml-2">
                                    {wp.tasks.map((task, tIdx) => (
                                        <div key={task.id} className="grid grid-cols-12 gap-1 h-6">
                                            <div
                                                className={`rounded h-4 mt-1 opacity-70
                          ${idx === 0 ? 'col-start-1 col-span-1 bg-green-400' :
                                                        idx === 1 ? `col-start-${2 + tIdx} col-span-1 bg-blue-400` :
                                                            `col-start-${4 + tIdx} col-span-1 bg-indigo-300`}
                        `}
                                                title={task.title}
                                            ></div>
                                            <span className="col-span-3 text-xs text-gray-500 ml-2 flex items-center">{task.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Projekteinstellungen</h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meine Rolle im Projekt</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white">
                        <option>Projektleitung</option>
                        <option>Mitarbeiter</option>
                        <option>Stakeholder / Beobachter</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Standardansicht</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white">
                        <option>Übersicht</option>
                        <option>Arbeitspakete (Kanban)</option>
                        <option>Gantt-Chart</option>
                    </select>
                </div>

                <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Benachrichtigungen</h4>
                    <div className="space-y-3">
                        <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                            <span className="ml-2 text-gray-700">Bei neuen Aufgaben</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                            <span className="ml-2 text-gray-700">Wenn Budget überschritten wird</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                            <span className="ml-2 text-gray-700">Täglicher Statusbericht per E-Mail</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4">
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
                        Einstellungen speichern
                    </button>
                </div>
            </div>
        </div>
    );

    const renderNotifications = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900">Benachrichtigungen</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {[
                    { text: 'Budget für "Externe Dienstleister" kritisch!', time: 'Vor 2 Stunden', type: 'alert' },
                    { text: 'Neue Aufgabe zugewiesen: "Feinkonzept erstellen"', time: 'Gestern', type: 'info' },
                    { text: 'Meilenstein "Kick-off" abgeschlossen', time: 'Vor 3 Tagen', type: 'success' }
                ].map((notif, i) => (
                    <div key={i} className="p-4 flex items-start gap-4 hover:bg-gray-50">
                        <div className={`text-xl ${notif.type === 'alert' ? 'text-red-500' :
                            notif.type === 'success' ? 'text-green-500' : 'text-blue-500'
                            }`}>
                            {notif.type === 'alert' ? '⚠️' : notif.type === 'success' ? '✅' : 'ℹ️'}
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium">{notif.text}</p>
                            <p className="text-sm text-gray-500">{notif.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <Layout currentPage="projects">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/projects" className="text-gray-500 hover:text-gray-700">
                            ← Zurück zur Übersicht
                        </Link>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                            <p className="text-gray-600 mt-1">{project.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href="/calendar"
                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                📅 Kalender
                            </Link>
                            <button
                                onClick={() => alert('Aufgaben-Erstellung folgt im nächsten Schritt!')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                + Neue Aufgabe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 mb-8 overflow-x-auto">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'overview', label: 'Übersicht' },
                            { id: 'work-packages', label: 'Arbeitspakete' },
                            { id: 'finance', label: 'Finanzen' },
                            { id: 'gantt', label: 'Zeitplan (Gantt)' },
                            { id: 'notifications', label: 'Benachrichtigungen' },
                            { id: 'settings', label: 'Einstellungen' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'work-packages' && renderWorkPackages()}
                    {activeTab === 'finance' && renderFinances()}
                    {activeTab === 'gantt' && renderGantt()}
                    {activeTab === 'notifications' && renderNotifications()}
                    {activeTab === 'settings' && renderSettings()}
                </div>
            </div>
        </Layout>
    );
}
