import moment from 'moment';
import 'moment/locale/de';

// Set locale globally for this module
moment.locale('de');

// ============================================
// KONFIGURATION & KONSTANTEN
// ============================================

export const BUDGET_CONFIG = {
    PHASE_1_BUDGET: 95000,
    PHASE_1_MONTHS: 6,
    MAX_HOURS_PHASE_1: 1900,
    HOLIDAYS_PHASE_1_WEEKDAYS: 0,
    PHASE_2_BUDGET: 63000,
    PHASE_2_MONTHS: 4,
    MAX_HOURS_PHASE_2: 1269,
    HOLIDAYS_PHASE_2_WEEKDAYS: 4,
    VACATION_DAYS_PER_MONTH: 20 / 12, // 20 days per year
    TEAM_SIZE: 2,
};

// ============================================
// TABELLEN-KONFIGURATION (VERGLEICH)
// ============================================

export const COLUMN_CONFIG = {
    software: 'Software',
    dsgvo: 'DSGVO',
    zielgruppe: 'Zielgruppe',
    socialAcademic: 'Geeignet für gesellschaftliche Institutionen (nicht-kommerziell)',
    pmLevel: 'PM-Erfahrung',
    templates: 'Prozess-Templates',
    pmHilfe: 'Geführte Abläufe',
    wissenstransfer: 'Wissenstransfer',
    barrierefreiheit: 'Barrierefreiheit',
    vendorLock: 'Anbieterabhängigkeit (Open-Core)',
    anpassbar: 'Anpassbarkeit',
    dateien: 'Dateimanagement',
    ki: 'KI-Agenten (DSGVO?)',
    kollaborativ: 'Kollaborative Bearbeitung von Dokumenten',
} as const;

export const COLUMN_ORDER = Object.keys(COLUMN_CONFIG) as (keyof typeof COLUMN_CONFIG)[];

export const TABLE_DATA = [
    {
        software: { content: 'CitizenProject.App' },
        dsgvo: 'Hoch',
        zielgruppe: 'Bildung / Nonprofit',
        pmLevel: 'Anfänger',
        templates: 'Ja',
        socialAcademic: 'Ja',
        pmHilfe: 'Ja',
        wissenstransfer: 'Ja',
        barrierefreiheit: 'Hoch',
        vendorLock: 'Kein / wenig',
        anpassbar: 'Sehr Hoch',
        dateien: 'Integriert',
        ki: 'Geplant',
        kollaborativ: 'Ja',
    },
    {
        software: { content: 'OpenProject' },
        dsgvo: 'Hoch',
        zielgruppe: 'Unternehmen / Organisationen',
        pmLevel: 'Fortgeschritten',
        templates: 'Teilweise',
        socialAcademic: 'Nein',
        pmHilfe: 'Nein',
        wissenstransfer: 'Begrenzt',
        barrierefreiheit: 'Mittel',
        vendorLock: 'Mittel',
        anpassbar: 'Hoch',
        dateien: 'Integriert',
        ki: 'Nein',
        kollaborativ: 'Nein',
    },
    {
        software: { content: 'Redmine' },
        dsgvo: 'Mittel',
        zielgruppe: 'Tech / Engineering-Teams',
        pmLevel: 'Experte',
        templates: 'Nein',
        socialAcademic: 'Nein',
        pmHilfe: 'Nein',
        wissenstransfer: 'Nein',
        barrierefreiheit: 'Niedrig',
        vendorLock: 'Kein / wenig',
        anpassbar: 'Hoch',
        dateien: 'Anhänge',
        ki: 'Nein',
        kollaborativ: 'Nein',
    },
    {
        software: { content: 'Taiga' },
        dsgvo: 'Mittel',
        zielgruppe: 'Tech / Engineering-Teams',
        pmLevel: 'Fortgeschritten',
        templates: 'Agile/Scrum',
        socialAcademic: 'Nein',
        pmHilfe: 'Nein',
        wissenstransfer: 'Begrenzt',
        barrierefreiheit: 'Mittel',
        vendorLock: 'Kein / wenig',
        anpassbar: 'Mittel',
        dateien: 'Anhänge',
        ki: 'Nein',
        kollaborativ: 'Nein',
    },
    {
        software: { content: 'Tuleap' },
        dsgvo: 'Hoch',
        zielgruppe: 'Tech / Engineering-Teams',
        pmLevel: 'Experte',
        templates: 'Ja',
        socialAcademic: 'Nein',
        pmHilfe: 'Nein',
        wissenstransfer: 'Begrenzt',
        barrierefreiheit: 'Mittel',
        vendorLock: 'Mittel',
        anpassbar: 'Sehr Hoch',
        dateien: 'Integriert',
        ki: 'Nein',
        kollaborativ: 'Nein',
    },
    {
        software: { content: 'Kanboard' },
        dsgvo: 'Niedrig',
        zielgruppe: 'Kanban-Teams',
        pmLevel: 'Anfänger',
        templates: 'Nein',
        socialAcademic: 'Nein',
        pmHilfe: 'Nein',
        wissenstransfer: 'Nein',
        barrierefreiheit: 'Niedrig',
        vendorLock: 'Kein / wenig',
        anpassbar: 'Niedrig',
        dateien: 'Anhänge',
        ki: 'Nein',
        kollaborativ: 'Nein',
    },
    {
        software: { content: 'Wekan' },
        dsgvo: 'Niedrig',
        zielgruppe: 'Kanban-Teams',
        pmLevel: 'Anfänger',
        templates: 'Nein',
        socialAcademic: 'Nein',
        pmHilfe: 'Nein',
        wissenstransfer: 'Nein',
        barrierefreiheit: 'Niedrig',
        vendorLock: 'Kein / wenig',
        anpassbar: 'Niedrig',
        dateien: 'Anhänge',
        ki: 'Nein',
        kollaborativ: 'Nein',
    },
    {
        software: { content: 'Odoo Project' },
        dsgvo: 'Mittel',
        zielgruppe: 'Unternehmen / Organisationen',
        pmLevel: 'Fortgeschritten',
        templates: 'Teilweise',
        socialAcademic: 'Nein',
        pmHilfe: 'Nein',
        wissenstransfer: 'Begrenzt',
        barrierefreiheit: 'Niedrig',
        vendorLock: 'Hoch',
        anpassbar: 'Hoch',
        dateien: 'Integriert',
        ki: 'Nein',
        kollaborativ: 'Nein',
    },
    {
        software: { content: 'ERPNext Projects' },
        dsgvo: 'Mittel',
        zielgruppe: 'Unternehmen / Organisationen',
        pmLevel: 'Fortgeschritten',
        templates: 'Teilweise',
        socialAcademic: 'Nein',
        pmHilfe: 'Nein',
        wissenstransfer: 'Begrenzt',
        barrierefreiheit: 'Mittel',
        vendorLock: 'Hoch',
        anpassbar: 'Hoch',
        dateien: 'Integriert',
        ki: 'Nein',
        kollaborativ: 'Nein',
    }
];

// ============================================
// GANTT-CHART DATEN
// ============================================

export const GROUP_IDS = {
    PHASES: 1,
    MONTHS: 2,
    WEEKS: 3,
    SPRINTS: 4,
    MILESTONES_CONCEPT: 5,
    MILESTONES_TECH: 6,
    MILESTONES_STABILIZATION: 7
} as const;

export const TIMELINE_GROUPS = [
    { id: GROUP_IDS.PHASES, title: 'Förderphasen', stackItems: false, height: 50 },
    { id: GROUP_IDS.MONTHS, title: 'Fördermonate', stackItems: false, height: 50 },
    { id: GROUP_IDS.WEEKS, title: 'Kalenderwochen', stackItems: false, height: 50 },
    { id: GROUP_IDS.SPRINTS, title: 'Sprints', stackItems: false, height: 50 },
    { id: GROUP_IDS.MILESTONES_CONCEPT, title: 'Meilensteine Konzept', stackItems: true, height: 100 },
    { id: GROUP_IDS.MILESTONES_TECH, title: 'Meilensteine Tech', stackItems: true, height: 100 },
    { id: GROUP_IDS.MILESTONES_STABILIZATION, title: 'Meilensteine Verstetigung', stackItems: true, height: 100 }
];

// Helper to generate Sprints automatically
const generateSprints = () => {
    const sprints = [];
    const sprintStyle = { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0, textAlign: 'center' as const };

    // Phase 1 Sprints (1-13)
    let startDate = moment('2026-06-01');
    for (let i = 1; i <= 13; i++) {
        const end = startDate.clone().add(13, 'days').endOf('day');
        sprints.push({
            id: 100 + i,
            group: GROUP_IDS.SPRINTS,
            title: `${i}`,
            start_time: startDate.valueOf(),
            end_time: end.valueOf(),
            canMove: false,
            canResize: false,
            itemProps: { style: sprintStyle }
        });
        startDate.add(14, 'days');
    }

    // Phase 2 Sprints (14-22)
    startDate = moment('2026-12-01');
    for (let i = 14; i <= 22; i++) {
        const end = startDate.clone().add(13, 'days').endOf('day');
        sprints.push({
            id: 100 + i,
            group: GROUP_IDS.SPRINTS,
            title: `${i}`,
            start_time: startDate.valueOf(),
            end_time: end.valueOf(),
            canMove: false,
            canResize: false,
            itemProps: { style: sprintStyle }
        });
        startDate.add(14, 'days');
    }

    return sprints;
};

const MILESTONE_STYLE_CONCEPT = { background: '#ef4444', borderStyle: 'solid', borderWidth: '0 1px 0 0', borderColor: 'white', borderRadius: 0, textAlign: 'center' as const };
const MILESTONE_STYLE_TECH = { background: '#8b5cf6', borderStyle: 'solid', borderWidth: '0 1px 0 0', borderColor: 'white', borderRadius: 0, textAlign: 'center' as const };

export const STATIC_TIMELINE_ITEMS = [
    // --- FÖRDERPHASEN ---
    { id: 1, group: GROUP_IDS.PHASES, title: 'Förderphase 1', start_time: moment('2026-06-01').valueOf(), end_time: moment('2026-11-30').endOf('day').valueOf(), itemProps: { style: { background: '#64748b', borderStyle: 'none', borderRadius: 0, textAlign: 'center' as const } } },
    { id: 2, group: GROUP_IDS.PHASES, title: 'Förderphase 2', start_time: moment('2026-12-01').valueOf(), end_time: moment('2027-03-31').endOf('day').valueOf(), itemProps: { style: { background: '#f59e0b', borderStyle: 'none', borderRadius: 0, textAlign: 'center' as const } } },

    // --- SPRINTS ---
    ...generateSprints(),

    // --- MEILENSTEINE ---
    // First Stage
    { id: 401, group: GROUP_IDS.MILESTONES_CONCEPT, title: 'M1 (Analyse & Konzept 1)', start_time: moment('2026-06-01').isoWeek(23).startOf('isoWeek').valueOf(), end_time: moment('2026-06-01').isoWeek(29).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_CONCEPT }, description: 'Analyse & Konzept 1: Zielgruppenanalyse, Projektarten, Grundprozesse, Qualitätskriterien, Informationsarchitektur, Backlog' },
    { id: 402, group: GROUP_IDS.MILESTONES_TECH, title: 'M2 (Setup & Tech)', start_time: moment('2026-06-01').isoWeek(23).startOf('isoWeek').valueOf(), end_time: moment('2026-06-01').isoWeek(24).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_TECH }, description: 'Setup & Tech: Analyse bestehender PM-Software, Repo, CI/CD, Hosting, DB, Auth, Rollenmodell, Sicherheits- und Datenschutzbasis' },
    { id: 403, group: GROUP_IDS.MILESTONES_CONCEPT, title: 'M3 (Konzept 2)', start_time: moment('2026-06-01').isoWeek(30).startOf('isoWeek').valueOf(), end_time: moment('2026-06-01').isoWeek(31).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_CONCEPT }, description: 'Konzept 2: Templates' },
    { id: 404, group: GROUP_IDS.MILESTONES_TECH, title: 'M4 (Core-Prototyp)', start_time: moment('2026-06-01').isoWeek(25).startOf('isoWeek').valueOf(), end_time: moment('2026-06-01').isoWeek(33).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_TECH }, description: 'Core-Prototyp: Projektanlage, erste Projektarten, Basisprozesse, Projektrollen, Ansichten, geführte Schritte, Templates, Wissensstruktur' },
    { id: 405, group: GROUP_IDS.MILESTONES_TECH, title: 'M5 (Feature-Ausbau)', start_time: moment('2026-06-01').isoWeek(34).startOf('isoWeek').valueOf(), end_time: moment('2026-06-01').isoWeek(37).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_TECH }, description: 'Feature-Ausbau: weitere Projektarten, Prozesspfade, Tipps, Kalenderlogik, Benachrichtigungen' },
    { id: 406, group: GROUP_IDS.MILESTONES_CONCEPT, title: 'M6 (Pilotphase 1)', start_time: moment('2026-06-01').isoWeek(38).startOf('isoWeek').valueOf(), end_time: moment('2026-06-01').isoWeek(43).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_CONCEPT }, description: 'Pilotphase 1: reale Pilotprojekte, Interviews, Usability-Tests, Logging, Priorisierung für Verbesserungen' },
    { id: 407, group: GROUP_IDS.MILESTONES_TECH, title: 'M7 (Stabilisierung)', start_time: moment('2026-06-01').isoWeek(44).startOf('isoWeek').valueOf(), end_time: moment('2026-06-01').isoWeek(48).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_TECH }, description: 'Stabilisierung: technische Optimierung, UX-Verbesserungen, Prototyp-Release, Nutzer- und Entwicklerdokumentation, OSS-Release' },
    { id: 408, group: GROUP_IDS.MILESTONES_CONCEPT, title: 'M8 (Revision)', start_time: moment('2026-06-01').isoWeek(47).startOf('isoWeek').valueOf(), end_time: moment('2026-06-01').isoWeek(48).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_CONCEPT }, description: 'Revision: Planung Second Stage' },

    // Second Stage
    // FIX: Use explicit year to avoid ISO week year issues at year boundaries
    { id: 409, group: GROUP_IDS.MILESTONES_CONCEPT, title: 'M9 (Erweiterung)', start_time: moment('2026-06-01').isoWeek(49).startOf('isoWeek').valueOf(), end_time: moment().year(2027).isoWeek(4).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_CONCEPT }, description: 'Erweiterung des Prototypen: zusätzliche Institutionen, strukturierte Tests, Kontextinterviews, Nutzungsanalyse, priorisierte Maßnahmen' },
    { id: 410, group: GROUP_IDS.MILESTONES_CONCEPT, title: 'M10 (Wissensaufbau)', start_time: moment().year(2027).isoWeek(5).startOf('isoWeek').valueOf(), end_time: moment().year(2027).isoWeek(8).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_CONCEPT }, description: 'Wissensaufbau: Best-Practice-Guides, Projektartenkatalog, verbesserte Templates, Onboarding-Materialien, Dokumentstruktur' },

    // Verstetigung
    { id: 411, group: GROUP_IDS.MILESTONES_STABILIZATION, title: 'M11 (Communityaufbau)', start_time: moment('2026-06-01').isoWeek(49).startOf('isoWeek').valueOf(), end_time: moment().year(2027).isoWeek(12).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_TECH }, description: 'Communityaufbau: Kommunikationskanäle, Governance-Modell, Ankerinstitutionen, Workshops für frühe Nutzergruppen' },
    { id: 412, group: GROUP_IDS.MILESTONES_STABILIZATION, title: 'M12 (Verstetigung)', start_time: moment().year(2027).isoWeek(5).startOf('isoWeek').valueOf(), end_time: moment().year(2027).isoWeek(12).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_TECH }, description: 'Verstetigung: Betriebsmodell, Finanzierungsszenarien, Roadmap, Implementierungsleitfaden, Abschlussbericht zur nachhaltigen Nutzung' },
];

// Helper to generate Funding Months (M1-M10)
const generateMonthItems = () => {
    const months = [];
    const startDate = moment('2026-06-01');
    for (let i = 0; i < 10; i++) {
        const start = startDate.clone().add(i, 'months');
        const end = start.clone().endOf('month');
        months.push({
            id: 500 + i,
            group: GROUP_IDS.MONTHS,
            title: `${i + 1}`,
            start_time: start.valueOf(),
            end_time: end.valueOf(),
            itemProps: { style: { background: i < 6 ? '#dbeafe' : '#fef3c7', color: i < 6 ? '#1e40af' : '#92400e', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', textAlign: 'center' as const, borderRadius: 0 } }
        });
    }
    return months;
};

// Helper to generate Calendar Weeks
const generateWeekItems = () => {
    const weeks = [];
    const startDate = moment('2026-06-01').startOf('isoWeek');
    const endDate = moment('2027-03-31').endOf('isoWeek');
    let current = startDate.clone();
    let idCounter = 600;

    while (current.isBefore(endDate)) {
        const end = current.clone().endOf('isoWeek');
        weeks.push({
            id: idCounter++,
            group: GROUP_IDS.WEEKS,
            title: `${current.isoWeek()}`,
            start_time: current.valueOf(),
            end_time: end.valueOf(),
            itemProps: { style: { background: '#f3f4f6', color: '#6b7280', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', fontSize: '10px', textAlign: 'center' as const, borderRadius: 0 } }
        });
        current.add(1, 'weeks');
    }
    return weeks;
};

export const ALL_TIMELINE_ITEMS = [
    ...STATIC_TIMELINE_ITEMS,
    ...generateMonthItems(),
    ...generateWeekItems()
];
