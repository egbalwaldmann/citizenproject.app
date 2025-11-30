'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';

export default function Processes() {
    const [processes, setProcesses] = useState([
        {
            id: 'init',
            title: 'Initiierung',
            items: [
                { id: 'p1', label: 'Projektsteckbrief erstellen', checked: true },
                { id: 'p2', label: 'Stakeholder identifizieren & analysieren', checked: false },
                { id: 'p3', label: 'Projektziele (SMART) definieren', checked: false },
                { id: 'p4', label: 'Erstes Kick-off Meeting', checked: false },
            ]
        },
        {
            id: 'plan',
            title: 'Planung',
            items: [
                { id: 'p5', label: 'Arbeitspakete definieren (WBS)', checked: false },
                { id: 'p6', label: 'Zeitplan / Meilensteine festlegen', checked: false },
                { id: 'p7', label: 'Ressourcen & Budget planen', checked: false },
                { id: 'p8', label: 'Kommunikationsplan erstellen', checked: false },
                { id: 'p9', label: 'Risikoanalyse durchführen', checked: false },
            ]
        },
        {
            id: 'exec',
            title: 'Durchführung & Steuerung',
            items: [
                { id: 'p10', label: 'Regelmäßige Status-Meetings', checked: false },
                { id: 'p11', label: 'Aufgabenverteilung & Tracking', checked: false },
                { id: 'p12', label: 'Qualitätssicherung der Ergebnisse', checked: false },
                { id: 'p13', label: 'Stakeholder-Kommunikation', checked: false },
            ]
        },
        {
            id: 'close',
            title: 'Abschluss',
            items: [
                { id: 'p14', label: 'Projektabnahme', checked: false },
                { id: 'p15', label: 'Lessons Learned Workshop', checked: false },
                { id: 'p16', label: 'Projektabschlussbericht', checked: false },
                { id: 'p17', label: 'Team-Entlastung & Feier', checked: false },
            ]
        }
    ]);

    const toggleItem = (groupId: string, itemId: string) => {
        setProcesses(processes.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    items: group.items.map(item =>
                        item.id === itemId ? { ...item, checked: !item.checked } : item
                    )
                };
            }
            return group;
        }));
    };

    const calculateProgress = () => {
        const totalItems = processes.reduce((acc, group) => acc + group.items.length, 0);
        const checkedItems = processes.reduce((acc, group) =>
            acc + group.items.filter(i => i.checked).length, 0);
        return Math.round((checkedItems / totalItems) * 100);
    };

    return (
        <Layout currentPage="processes">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Prozess-Checkliste</h1>
                    <p className="text-gray-600 mt-2">
                        Ein Leitfaden durch alle Phasen deines Projekts. Hake ab, was erledigt ist.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Gesamtfortschritt</span>
                        <span className="text-sm font-bold text-indigo-600">{calculateProgress()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>
                </div>

                <div className="space-y-6">
                    {processes.map((group) => (
                        <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">{group.title}</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {group.items.map((item) => (
                                        <label
                                            key={item.id}
                                            className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer hover:bg-gray-50 ${item.checked ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="checkbox"
                                                    checked={item.checked}
                                                    onChange={() => toggleItem(group.id, item.id)}
                                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <span className={`font-medium ${item.checked ? 'text-indigo-900 line-through opacity-75' : 'text-gray-900'}`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
