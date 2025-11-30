'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';

export default function KalkulationPage() {
    // Constants from the image
    const PHASE_1_BUDGET = 95000;
    const PHASE_1_MONTHS = 6;
    const MAX_HOURS_PHASE_1 = 1900;
    const HOLIDAYS_PHASE_1_WEEKDAYS = 0;
    const PHASE_2_BUDGET = 63000;
    const PHASE_2_MONTHS = 4;
    const MAX_HOURS_PHASE_2 = 1269;
    const HOLIDAYS_PHASE_2_WEEKDAYS = 4;
    const VACATION_DAYS_PER_MONTH = 20 / 12; // 20 days per year
    const TEAM_SIZE = 2;

    // Helper functions
    const getDaysUntil = (dateString: string) => {
        const target = new Date(dateString);
        const today = new Date();
        const diff = target.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const formatDaysRelative = (dateString: string) => {
        const days = getDaysUntil(dateString);
        if (days < 0) {
            return `vor ${Math.abs(days)} Tagen`;
        } else if (days === 0) {
            return 'heute';
        } else {
            return `in ${days} Tagen`;
        }
    };

    const getDurationInDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diff = endDate.getTime() - startDate.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    // State for calculation
    const [hourlyRate, setHourlyRate] = useState(50); // Default hourly rate assumption
    const [materialCostPercentage, setMaterialCostPercentage] = useState(0); // Default 0%
    const [egbalHours, setEgbalHours] = useState(48);
    const [manuelaHours, setManuelaHours] = useState(12);

    // Calculations
    const totalBudget = PHASE_1_BUDGET + PHASE_2_BUDGET;
    const totalMonths = PHASE_1_MONTHS + PHASE_2_MONTHS;

    // Phase 1 Calculations
    const phase1MaterialCosts = PHASE_1_BUDGET * (materialCostPercentage / 100);
    const phase1Personnel = PHASE_1_BUDGET - phase1MaterialCosts;
    const phase1EgbalHours = egbalHours * 4.33 * PHASE_1_MONTHS;
    const phase1ManuelaHours = manuelaHours * 4.33 * PHASE_1_MONTHS;
    const phase1TeamHours = phase1EgbalHours + phase1ManuelaHours;
    const phase1HourlyRate = phase1TeamHours > 0 ? phase1Personnel / phase1TeamHours : 0;
    const phase1EgbalPay = phase1HourlyRate * phase1EgbalHours;
    const phase1ManuelaPay = phase1HourlyRate * phase1ManuelaHours;

    // Phase 1 Net Calculations
    const phase1VacationDays = VACATION_DAYS_PER_MONTH * PHASE_1_MONTHS;
    const phase1DeductibleDays = HOLIDAYS_PHASE_1_WEEKDAYS + phase1VacationDays;
    const phase1EgbalDeduction = phase1DeductibleDays * (egbalHours / 5);
    const phase1ManuelaDeduction = phase1DeductibleDays * (manuelaHours / 5);
    const phase1EgbalNetHours = Math.max(0, phase1EgbalHours - phase1EgbalDeduction);
    const phase1ManuelaNetHours = Math.max(0, phase1ManuelaHours - phase1ManuelaDeduction);
    const phase1TeamNetHours = phase1EgbalNetHours + phase1ManuelaNetHours;


    // Phase 2 Calculations
    const phase2MaterialCosts = PHASE_2_BUDGET * (materialCostPercentage / 100);
    const phase2Personnel = PHASE_2_BUDGET - phase2MaterialCosts;
    const phase2EgbalHours = egbalHours * 4.33 * PHASE_2_MONTHS;
    const phase2ManuelaHours = manuelaHours * 4.33 * PHASE_2_MONTHS;
    const phase2TeamHours = phase2EgbalHours + phase2ManuelaHours;
    const phase2HourlyRate = phase2TeamHours > 0 ? phase2Personnel / phase2TeamHours : 0;
    const phase2EgbalPay = phase2HourlyRate * phase2EgbalHours;
    const phase2ManuelaPay = phase2HourlyRate * phase2ManuelaHours;

    // Phase 2 Net Calculations
    const phase2VacationDays = VACATION_DAYS_PER_MONTH * PHASE_2_MONTHS;
    const phase2DeductibleDays = HOLIDAYS_PHASE_2_WEEKDAYS + phase2VacationDays;
    const phase2EgbalDeduction = phase2DeductibleDays * (egbalHours / 5);
    const phase2ManuelaDeduction = phase2DeductibleDays * (manuelaHours / 5);
    const phase2EgbalNetHours = Math.max(0, phase2EgbalHours - phase2EgbalDeduction);
    const phase2ManuelaNetHours = Math.max(0, phase2ManuelaHours - phase2ManuelaDeduction);
    const phase2TeamNetHours = phase2EgbalNetHours + phase2ManuelaNetHours;

    // Total Calculations
    const totalMaterialCosts = phase1MaterialCosts + phase2MaterialCosts;
    const totalPersonnel = phase1Personnel + phase2Personnel;
    const totalEgbalPay = phase1EgbalPay + phase2EgbalPay;
    const totalManuelaPay = phase1ManuelaPay + phase2ManuelaPay;
    const totalAvgHourlyRate = (phase1HourlyRate + phase2HourlyRate) / 2; // Approximate or weighted? Weighted is better:
    const totalTeamHours = phase1TeamHours + phase2TeamHours;
    const totalWeightedHourlyRate = totalTeamHours > 0 ? totalPersonnel / totalTeamHours : 0;
    const totalTeamNetHours = phase1TeamNetHours + phase2TeamNetHours;


    return (
        <Layout currentPage="kalkulation">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Interne Projekt-Kalkulation</h1>
                    <p className="text-gray-600 bg-yellow-50 inline-block px-4 py-1 rounded-full border border-yellow-200 text-sm">
                        🔒 Vertraulich: Nur für Egbal & Manuela
                    </p>
                </div>

                {/* Settings Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Einstellungen</h2>
                        <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                            <span className="text-gray-700 font-medium mr-2">Gesamtbudget:</span>
                            <span className="text-xl font-bold text-gray-900">{totalBudget.toLocaleString('de-DE')} €</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Material Costs */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sachkosten-Anteil (%)
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="relative rounded-md shadow-sm w-full">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={materialCostPercentage}
                                        onChange={(e) => setMaterialCostPercentage(Number(e.target.value))}
                                        className="block w-full rounded-md border-gray-300 pr-8 focus:border-indigo-500 focus:ring-indigo-500 py-2 text-gray-900"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500 sm:text-sm">%</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Vom Gesamtbudget abgezogen.</p>
                        </div>

                        {/* Egbal Hours */}
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Egbal (Stunden/Woche)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="48"
                                value={egbalHours}
                                onChange={(e) => setEgbalHours(Number(e.target.value))}
                                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer mb-2"
                            />
                            <div className="flex justify-between items-end">
                                <div className="text-2xl font-bold text-indigo-700">{egbalHours} h</div>
                                <div className="text-sm text-indigo-600 mb-1">{Math.round((egbalHours / 48) * 100)}%</div>
                            </div>
                        </div>

                        {/* Manuela Hours */}
                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                            <label className="block text-sm font-medium text-purple-900 mb-2">
                                Manuela (Stunden/Woche)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="48"
                                value={manuelaHours}
                                onChange={(e) => setManuelaHours(Number(e.target.value))}
                                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer mb-2"
                            />
                            <div className="flex justify-between items-end">
                                <div className="text-2xl font-bold text-purple-700">{manuelaHours} h</div>
                                <div className="text-sm text-purple-600 mb-1">{Math.round((manuelaHours / 48) * 100)}%</div>
                            </div>
                        </div>

                        {/* Team Sum Hours */}
                        <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Beide (Gesamt)
                            </label>
                            <div className="mb-2 h-2"></div> {/* Spacer to align with sliders */}
                            <div className="text-2xl font-bold text-gray-900">{egbalHours + manuelaHours} h</div>
                        </div>
                    </div>
                </div>

                {/* Visual Timeline of Phases */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Projektlaufzeit im Kontext (2025 – 2027)</h3>
                    <div className="relative h-24 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        {/* Year Markers */}
                        <div className="absolute inset-0 flex divide-x divide-gray-300/50">
                            {/* 2025 */}
                            <div className="flex-1 relative bg-gray-50/30">
                                <div className="absolute top-1 left-2 text-xs font-bold text-gray-400 uppercase">2025</div>
                                <div className="absolute inset-0 flex divide-x divide-gray-200/50">
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q1</span></div>
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q2</span></div>
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q3</span></div>
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q4</span></div>
                                </div>
                            </div>
                            {/* 2026 */}
                            <div className="flex-1 relative bg-gray-50/30">
                                <div className="absolute top-1 left-2 text-xs font-bold text-gray-400 uppercase">2026</div>
                                <div className="absolute inset-0 flex divide-x divide-gray-200/50">
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q1</span></div>
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q2</span></div>
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q3</span></div>
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q4</span></div>
                                </div>
                            </div>
                            {/* 2027 */}
                            <div className="flex-1 relative bg-gray-50/30">
                                <div className="absolute top-1 left-2 text-xs font-bold text-gray-400 uppercase">2027</div>
                                <div className="absolute inset-0 flex divide-x divide-gray-200/50">
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q1</span></div>
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q2</span></div>
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q3</span></div>
                                    <div className="flex-1 flex items-end justify-center pb-1"><span className="text-[8px] text-gray-300">Q4</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Application Phase Bar */}
                        <div
                            className="absolute top-8 h-10 bg-blue-50 border border-blue-200 border-dashed rounded-md flex items-center justify-center shadow-sm group hover:bg-blue-100 transition-colors cursor-help z-10"
                            style={{ left: '25%', width: '5.5%' }}
                            title="Bewerbungszeitraum: 01.10.2025 – 30.11.2025"
                        >
                            <div className="text-[10px] font-bold text-blue-800 leading-tight text-center px-1 truncate w-full">Bewerbung</div>
                        </div>

                        {/* Selection Phase Bar */}
                        <div
                            className="absolute top-8 h-10 bg-yellow-50 border border-yellow-200 border-dashed rounded-md flex items-center justify-center shadow-sm group hover:bg-yellow-100 transition-colors cursor-help z-10"
                            style={{ left: '30.5%', width: '8.3%' }}
                            title="Auswahlphase: 01.12.2025 – 01.03.2026"
                        >
                            <div className="text-[10px] font-bold text-yellow-800 leading-tight text-center px-1 truncate w-full">Auswahl</div>
                        </div>

                        {/* Formal Application Phase Bar (Gap Filler) */}
                        <div
                            className="absolute top-8 h-10 bg-gray-50 border border-gray-200 border-dashed rounded-md flex items-center justify-center shadow-sm group hover:bg-gray-100 transition-colors cursor-help z-10"
                            style={{ left: '38.8%', width: '8.3%' }}
                            title="Formale Antragstellung: 01.03.2026 – 31.05.2026"
                        >
                            <div className="text-[10px] font-bold text-gray-600 leading-tight text-center px-1 truncate w-full">Antrag</div>
                        </div>

                        {/* Phase 1 Bar */}
                        <div
                            className="absolute top-8 h-10 bg-green-100 border border-green-300 rounded-md flex items-center justify-center shadow-sm group hover:bg-green-200 transition-colors cursor-help z-10"
                            style={{ left: '47.2%', width: '16.7%' }}
                            title="Phase 1: 01.06.2026 – 01.12.2026"
                        >
                            <div className="flex flex-col items-center leading-none">
                                <div className="text-[10px] font-bold text-green-800 truncate w-full text-center">Phase 1</div>
                                <div className="text-[9px] text-green-700 font-medium mt-0.5">Start {formatDaysRelative('2026-06-01')}</div>
                            </div>
                        </div>

                        {/* Phase 2 Bar */}
                        <div
                            className="absolute top-8 h-10 bg-purple-100 border border-purple-300 rounded-md flex items-center justify-center shadow-sm group hover:bg-purple-200 transition-colors cursor-help z-10"
                            style={{ left: '63.9%', width: '11.1%' }}
                            title="Phase 2: 01.12.2026 – 31.03.2027"
                        >
                            <div className="flex flex-col items-center leading-none">
                                <div className="text-[10px] font-bold text-purple-800 truncate w-full text-center">Phase 2</div>
                                <div className="text-[9px] text-purple-700 font-medium mt-0.5">Start {formatDaysRelative('2026-12-01')}</div>
                            </div>
                        </div>
                    </div>
                    {/* Date Labels below */}
                    <div className="relative w-full h-12 mt-0 text-[10px] text-gray-400 font-mono">
                        {/* Marker: Application Start */}
                        <div className="absolute left-[25%] top-0 h-3 border-l border-dashed border-gray-300 transform -translate-x-1/2"></div>
                        <div className="absolute left-[25%] top-3 transform -translate-x-1/2 text-center whitespace-nowrap">
                            01. Okt. 2025
                            <span className="block text-[9px] text-gray-300">{formatDaysRelative('2025-10-01')}</span>
                        </div>

                        {/* Marker: Selection Start */}
                        <div className="absolute left-[30.5%] top-0 h-3 border-l border-dashed border-gray-300 transform -translate-x-1/2"></div>
                        <div className="absolute left-[30.5%] top-10 transform -translate-x-1/2 text-center whitespace-nowrap">
                            01. Dez. 2025
                            <span className="block text-[9px] text-gray-300">{formatDaysRelative('2025-12-01')}</span>
                        </div>

                        {/* Marker: Formal Application Start */}
                        <div className="absolute left-[38.8%] top-0 h-3 border-l border-dashed border-gray-300 transform -translate-x-1/2"></div>
                        <div className="absolute left-[38.8%] top-3 transform -translate-x-1/2 text-center whitespace-nowrap">
                            01. März 2026
                            <span className="block text-[9px] text-gray-300">{formatDaysRelative('2026-03-01')}</span>
                        </div>

                        {/* Marker: Phase 1 Start */}
                        <div className="absolute left-[47.2%] top-0 h-3 border-l border-dashed border-gray-300 transform -translate-x-1/2"></div>
                        <div className="absolute left-[47.2%] top-10 transform -translate-x-1/2 text-center whitespace-nowrap">
                            01. Juni 2026
                            <span className="block text-[9px] text-gray-300">{formatDaysRelative('2026-06-01')}</span>
                        </div>

                        {/* Marker: Phase 2 Start */}
                        <div className="absolute left-[63.9%] top-0 h-3 border-l border-dashed border-gray-300 transform -translate-x-1/2"></div>
                        <div className="absolute left-[63.9%] top-3 transform -translate-x-1/2 text-center whitespace-nowrap">
                            01. Dez. 2026
                            <span className="block text-[9px] text-gray-300">{formatDaysRelative('2026-12-01')}</span>
                        </div>

                        {/* Marker: End */}
                        <div className="absolute left-[75%] top-0 h-3 border-l border-dashed border-gray-300 transform -translate-x-1/2"></div>
                        <div className="absolute left-[75%] top-10 transform -translate-x-1/2 text-center whitespace-nowrap">
                            31. März 2027
                            <span className="block text-[9px] text-gray-300">{formatDaysRelative('2027-03-31')}</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-4 divide-x divide-gray-200">
                        {/* Headers */}
                        <div className="p-6 bg-gray-50 font-bold text-gray-500 uppercase tracking-wider text-sm flex items-center">
                            Bereich
                        </div>
                        <div className="p-6 bg-green-50">
                            <div className="font-bold text-green-900 uppercase tracking-wider text-sm mb-1">Phase 1</div>
                            <div className="text-xs text-green-700">Reguläre Förderung (6 Mon.)</div>
                        </div>
                        <div className="p-6 bg-purple-50">
                            <div className="font-bold text-purple-900 uppercase tracking-wider text-sm mb-1">Phase 2</div>
                            <div className="text-xs text-purple-700">Second-Stage (4 Mon.)</div>
                        </div>
                        <div className="p-6 bg-gray-800 text-white">
                            <div className="font-bold uppercase tracking-wider text-sm mb-1">Gesamt</div>
                            <div className="text-xs text-gray-400">Projektlaufzeit (10 Mon.)</div>
                        </div>

                        {/* Row: Budget */}
                        <div className="p-4 font-medium text-gray-900 border-t border-gray-100">Budget</div>
                        <div className="p-4 font-mono text-gray-800 border-t border-gray-100">{PHASE_1_BUDGET.toLocaleString('de-DE')} €</div>
                        <div className="p-4 font-mono text-gray-800 border-t border-gray-100">{PHASE_2_BUDGET.toLocaleString('de-DE')} €</div>
                        <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100">{totalBudget.toLocaleString('de-DE')} €</div>

                        {/* Row: Sachkosten */}
                        <div className="p-4 font-medium text-gray-900 border-t border-gray-100">Sachkosten ({materialCostPercentage}%)</div>
                        <div className="p-4 font-mono text-red-600 border-t border-gray-100">-{phase1MaterialCosts.toLocaleString('de-DE')} €</div>
                        <div className="p-4 font-mono text-red-600 border-t border-gray-100">-{phase2MaterialCosts.toLocaleString('de-DE')} €</div>
                        <div className="p-4 font-mono font-bold text-red-600 border-t border-gray-100">-{totalMaterialCosts.toLocaleString('de-DE')} €</div>

                        {/* Row: Personal */}
                        <div className="p-4 font-medium text-gray-900 border-t border-gray-100 bg-gray-50/50">Verfügbar für Personal</div>
                        <div className="p-4 font-mono font-bold text-green-600 border-t border-gray-100 bg-green-50/30">{phase1Personnel.toLocaleString('de-DE')} €</div>
                        <div className="p-4 font-mono font-bold text-purple-600 border-t border-gray-100 bg-purple-50/30">{phase2Personnel.toLocaleString('de-DE')} €</div>
                        <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100 bg-gray-50/50">{totalPersonnel.toLocaleString('de-DE')} €</div>

                        {/* Row: Hours (Gross) */}
                        <div className="p-4 font-medium text-gray-900 border-t border-gray-100">
                            Geplante Stunden (Brutto)
                        </div>
                        <div className={`p-4 font-mono border-t border-gray-100 ${phase1TeamHours > MAX_HOURS_PHASE_1 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                            {phase1TeamHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                        </div>
                        <div className={`p-4 font-mono border-t border-gray-100 ${phase2TeamHours > MAX_HOURS_PHASE_2 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                            {phase2TeamHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                        </div>
                        <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100">
                            {totalTeamHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                        </div>

                        {/* Row: Max Hours Limit */}
                        <div className="p-4 font-medium text-gray-500 border-t border-gray-100 bg-gray-50/30 italic">
                            Max. zulässig (Prototype Fund)
                        </div>
                        <div className="p-4 font-mono text-gray-500 border-t border-gray-100 bg-gray-50/30 italic">
                            {MAX_HOURS_PHASE_1.toLocaleString('de-DE')} h
                        </div>
                        <div className="p-4 font-mono text-gray-500 border-t border-gray-100 bg-gray-50/30 italic">
                            {MAX_HOURS_PHASE_2.toLocaleString('de-DE')} h
                        </div>
                        <div className="p-4 font-mono text-gray-500 border-t border-gray-100 bg-gray-50/30 italic">
                            {(MAX_HOURS_PHASE_1 + MAX_HOURS_PHASE_2).toLocaleString('de-DE')} h
                        </div>

                        {/* Row: Hours (Net/Productive) */}
                        <div className="p-4 font-medium text-gray-900 border-t border-gray-100 bg-yellow-50/50">
                            Produktiv-Stunden (Netto)
                            <div className="text-xs text-gray-500 font-normal mt-1">Abz. Urlaub (20 Tage/Jahr) & Feiertage</div>
                        </div>
                        <div className="p-4 font-mono text-gray-700 border-t border-gray-100 bg-yellow-50/30">
                            {phase1TeamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                        </div>
                        <div className="p-4 font-mono text-gray-700 border-t border-gray-100 bg-yellow-50/30">
                            {phase2TeamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                        </div>
                        <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100 bg-yellow-50/50">
                            {totalTeamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                            <div className="text-xs text-gray-500 mt-1 font-normal">
                                {((totalTeamNetHours / (MAX_HOURS_PHASE_1 + MAX_HOURS_PHASE_2)) * 100).toLocaleString('de-DE', { maximumFractionDigits: 1 })}% vom Limit
                            </div>
                        </div>

                        {/* Row: Person Days (PT) */}
                        <div className="p-4 font-medium text-gray-900 border-t border-gray-100 bg-gray-50/50">
                            Personentage (PT)
                            <div className="text-xs text-gray-400 font-normal mt-1">1 PT = 8 Std. (Brutto)</div>
                        </div>
                        <div className="p-4 font-mono text-gray-600 border-t border-gray-100 bg-gray-50/30">{(phase1TeamHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        <div className="p-4 font-mono text-gray-600 border-t border-gray-100 bg-gray-50/30">{(phase2TeamHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100 bg-gray-50/50">{(totalTeamHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>

                        {/* Row: Stundensatz */}
                        <div className="p-4 font-medium text-gray-900 border-t border-gray-100">Sich ergebender Stundensatz</div>
                        <div className="p-4 font-mono text-gray-600 border-t border-gray-100">{phase1HourlyRate.toLocaleString('de-DE', { maximumFractionDigits: 2 })} €/h</div>
                        <div className="p-4 font-mono text-gray-600 border-t border-gray-100">{phase2HourlyRate.toLocaleString('de-DE', { maximumFractionDigits: 2 })} €/h</div>
                        <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100">{totalWeightedHourlyRate.toLocaleString('de-DE', { maximumFractionDigits: 2 })} €/h (Ø)</div>

                        {/* Spacer */}
                        <div className="col-span-4 h-8 bg-gray-50 border-t border-gray-200"></div>

                        {/* Egbal Section */}
                        <div className="p-4 font-bold text-indigo-900 border-t border-gray-200 bg-indigo-50 flex items-center gap-2">
                            <span>👨‍💻 Egbal</span>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-indigo-50/10">
                            <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                            <div className="font-bold text-indigo-700">{phase1EgbalPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich</div>
                            <div className="font-mono text-gray-700">{(phase1EgbalPay / PHASE_1_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                            <div className="font-mono text-gray-700">{phase1EgbalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                            <div className="font-mono text-gray-700">{(phase1EgbalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-indigo-50/10">
                            <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                            <div className="font-bold text-indigo-700">{phase2EgbalPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich</div>
                            <div className="font-mono text-gray-700">{(phase2EgbalPay / PHASE_2_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                            <div className="font-mono text-gray-700">{phase2EgbalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                            <div className="font-mono text-gray-700">{(phase2EgbalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-indigo-50/30">
                            <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                            <div className="font-bold text-indigo-900 text-lg">{totalEgbalPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Ø Monatlich</div>
                            <div className="font-mono text-gray-900 font-bold">{(totalEgbalPay / totalMonths).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                            <div className="font-mono text-gray-900 font-bold">{(phase1EgbalHours + phase2EgbalHours).toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                            <div className="font-mono text-gray-900 font-bold">{((phase1EgbalHours + phase2EgbalHours) / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        </div>

                        {/* Manuela Section */}
                        <div className="p-4 font-bold text-purple-900 border-t border-gray-200 bg-purple-50 flex items-center gap-2">
                            <span>👩‍🔬 Manuela</span>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-purple-50/10">
                            <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                            <div className="font-bold text-purple-700">{phase1ManuelaPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich</div>
                            <div className="font-mono text-gray-700">{(phase1ManuelaPay / PHASE_1_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                            <div className="font-mono text-gray-700">{phase1ManuelaHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                            <div className="font-mono text-gray-700">{(phase1ManuelaHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-purple-50/10">
                            <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                            <div className="font-bold text-purple-700">{phase2ManuelaPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich</div>
                            <div className="font-mono text-gray-700">{(phase2ManuelaPay / PHASE_2_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                            <div className="font-mono text-gray-700">{phase2ManuelaHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                            <div className="font-mono text-gray-700">{(phase2ManuelaHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-purple-50/30">
                            <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                            <div className="font-bold text-purple-900 text-lg">{totalManuelaPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Ø Monatlich</div>
                            <div className="font-mono text-gray-900 font-bold">{(totalManuelaPay / totalMonths).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                            <div className="font-mono text-gray-900 font-bold">{(phase1ManuelaHours + phase2ManuelaHours).toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                            <div className="font-mono text-gray-900 font-bold">{((phase1ManuelaHours + phase2ManuelaHours) / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        </div>

                        {/* Beide (Team) Section */}
                        <div className="p-4 font-bold text-gray-900 border-t-4 border-gray-300 bg-gray-100 flex items-center gap-2">
                            <span>👥 Beide (Team)</span>
                        </div>
                        <div className="p-4 border-t-4 border-gray-300 bg-gray-50">
                            <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                            <div className="font-bold text-gray-900">{(phase1EgbalPay + phase1ManuelaPay).toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich (Kombiniert)</div>
                            <div className="font-mono text-gray-700">{((phase1EgbalPay + phase1ManuelaPay) / PHASE_1_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Stunden (Brutto / Netto)</div>
                            <div className="font-mono text-gray-700">
                                {phase1TeamHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="font-bold text-gray-800">{phase1TeamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                            <div className="font-mono text-gray-700">{(phase1TeamHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        </div>
                        <div className="p-4 border-t-4 border-gray-300 bg-gray-50">
                            <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                            <div className="font-bold text-gray-900">{(phase2EgbalPay + phase2ManuelaPay).toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich (Kombiniert)</div>
                            <div className="font-mono text-gray-700">{((phase2EgbalPay + phase2ManuelaPay) / PHASE_2_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Stunden (Brutto / Netto)</div>
                            <div className="font-mono text-gray-700">
                                {phase2TeamHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="font-bold text-gray-800">{phase2TeamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                            <div className="font-mono text-gray-700">{(phase2TeamHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        </div>
                        <div className="p-4 border-t-4 border-gray-300 bg-gray-200">
                            <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                            <div className="font-bold text-gray-900 text-lg">{(totalEgbalPay + totalManuelaPay).toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Ø Monatlich (Kombiniert)</div>
                            <div className="font-mono text-gray-900 font-bold">{((totalEgbalPay + totalManuelaPay) / totalMonths).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Stunden (Brutto / Netto)</div>
                            <div className="font-mono text-gray-900 font-bold">
                                {totalTeamHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="font-bold text-gray-900">{totalTeamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                            <div className="font-mono text-gray-900 font-bold">{(totalTeamHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                        </div>
                    </div>
                </div>

                {/* Holidays Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Feiertage & Relevante Termine</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Phase 1 Holidays */}
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                            <div className="text-xs text-green-800 uppercase font-bold mb-3">Reguläre Förderphase (01.06.2026 – 01.12.2026)</div>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex justify-between border-b border-green-100 pb-2 last:border-0">
                                    <span className="font-mono font-bold">03.10.2026</span>
                                    <span>Tag der Deutschen Einheit</span>
                                </li>
                                <li className="flex justify-between border-b border-green-100 pb-2 last:border-0">
                                    <span className="font-mono font-bold">31.10.2026</span>
                                    <span>Reformationstag</span>
                                </li>
                            </ul>
                            <p className="text-xs text-green-600 mt-4 italic">
                                Hinweis: Weihnachten (25./26.12.2026) liegt nach dem 01.12. und fällt somit nicht in diese Phase.
                            </p>
                        </div>

                        {/* Phase 2 Holidays */}
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                            <div className="text-xs text-purple-800 uppercase font-bold mb-3">Second-Stage-Förderphase (01.12.2026 – 31.03.2027)</div>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex justify-between border-b border-purple-100 pb-2 last:border-0">
                                    <span className="font-mono font-bold">25.12.2026</span>
                                    <span>1. Weihnachtstag</span>
                                </li>
                                <li className="flex justify-between border-b border-purple-100 pb-2 last:border-0">
                                    <span className="font-mono font-bold">26.12.2026</span>
                                    <span>2. Weihnachtstag</span>
                                </li>
                                <li className="flex justify-between border-b border-purple-100 pb-2 last:border-0">
                                    <span className="font-mono font-bold">01.01.2027</span>
                                    <span>Neujahr</span>
                                </li>
                                <li className="flex justify-between border-b border-purple-100 pb-2 last:border-0">
                                    <span className="font-mono font-bold">26.03.2027</span>
                                    <span>Karfreitag</span>
                                </li>
                                <li className="flex justify-between border-b border-purple-100 pb-2 last:border-0">
                                    <span className="font-mono font-bold">29.03.2027</span>
                                    <span>Ostermontag</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
