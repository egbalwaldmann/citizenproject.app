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
    YEARS: 9,
    CALENDAR_MONTHS: 10,
    PHASES: 1,
    QUARTERS: 8,
    MONTHS: 2,
    WEEKS: 3,
    SPRINTS: 4,
    MILESTONES_CONCEPT: 5,
    MILESTONES_TECH: 6,
    MILESTONES_STABILIZATION: 7
} as const;



// Helper to generate Sprints automatically
const generateSprints = () => {
    const sprints = [];
    const sprintStyle = { background: '#000000', color: 'white', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0, textAlign: 'center' as const };

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

const MILESTONE_STYLE_CONCEPT = { background: '#000000', color: 'white', borderStyle: 'solid', borderWidth: '0 1px 0 0', borderColor: 'white', borderRadius: 0, textAlign: 'center' as const, fontWeight: 'bold' };
const MILESTONE_STYLE_TECH = { background: '#000000', color: 'white', borderStyle: 'solid', borderWidth: '0 1px 0 0', borderColor: 'white', borderRadius: 0, textAlign: 'center' as const, fontWeight: 'bold' };

export const STATIC_TIMELINE_ITEMS = [
    // --- FÖRDERPHASEN ---
    { id: 1, group: GROUP_IDS.PHASES, title: 'Förderphase 1', start_time: moment('2026-06-01').valueOf(), end_time: moment('2026-11-30').endOf('day').valueOf(), itemProps: { style: { background: '#000000', color: 'white', borderStyle: 'none', borderRadius: 0, textAlign: 'center' as const, fontWeight: 'bold' } } },
    { id: 2, group: GROUP_IDS.PHASES, title: 'Förderphase 2', start_time: moment('2026-12-01').valueOf(), end_time: moment('2027-03-31').endOf('day').valueOf(), itemProps: { style: { background: '#000000', color: 'white', borderStyle: 'none', borderRadius: 0, textAlign: 'center' as const, fontWeight: 'bold' } } },

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
    // FIX: Use explicit year (mid-year anchor) to avoid ISO week year issues at year boundaries
    { id: 409, group: GROUP_IDS.MILESTONES_CONCEPT, title: 'M9 (Erweiterung)', start_time: moment('2026-06-01').isoWeek(49).startOf('isoWeek').valueOf(), end_time: moment('2027-06-01').isoWeek(4).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_CONCEPT }, description: 'Erweiterung des Prototypen: zusätzliche Institutionen, strukturierte Tests, Kontextinterviews, Nutzungsanalyse, priorisierte Maßnahmen' },
    { id: 410, group: GROUP_IDS.MILESTONES_CONCEPT, title: 'M10 (Wissensaufbau)', start_time: moment('2027-06-01').isoWeek(5).startOf('isoWeek').valueOf(), end_time: moment('2027-06-01').isoWeek(8).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_CONCEPT }, description: 'Wissensaufbau: Best-Practice-Guides, Projektartenkatalog, verbesserte Templates, Onboarding-Materialien, Dokumentstruktur' },

    // Verstetigung
    { id: 411, group: GROUP_IDS.MILESTONES_STABILIZATION, title: 'M11 (Communityaufbau)', start_time: moment('2026-06-01').isoWeek(49).startOf('isoWeek').valueOf(), end_time: moment('2027-06-01').isoWeek(12).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_TECH }, description: 'Communityaufbau: Kommunikationskanäle, Governance-Modell, Ankerinstitutionen, Workshops für frühe Nutzergruppen' },
    { id: 412, group: GROUP_IDS.MILESTONES_STABILIZATION, title: 'M12 (Verstetigung)', start_time: moment('2027-06-01').isoWeek(5).startOf('isoWeek').valueOf(), end_time: moment('2027-06-01').isoWeek(12).endOf('isoWeek').valueOf(), itemProps: { style: MILESTONE_STYLE_TECH }, description: 'Verstetigung: Betriebsmodell, Finanzierungsszenarien, Roadmap, Implementierungsleitfaden, Abschlussbericht zur nachhaltigen Nutzung' },
];

// Helper to generate Years
// Helper to generate Years
const generateYearItems = () => {
    const years = [];
    const startDate = moment('2026-01-01');
    const endDate = moment('2027-12-31');

    let current = startDate.clone().startOf('year');
    let idCounter = 900;

    while (current.isBefore(endDate) || current.isSame(endDate, 'year')) {
        const end = current.clone().endOf('year');
        years.push({
            id: idCounter++,
            group: GROUP_IDS.YEARS,
            title: `${current.year()}`,
            start_time: current.valueOf(),
            end_time: end.valueOf(),
            itemProps: { style: { background: '#000000', color: 'white', borderWidth: '0 2px 0 0', borderStyle: 'solid', borderColor: 'white', textAlign: 'center' as const, borderRadius: 0, fontWeight: 'bold', fontSize: '14px' } }
        });
        current.add(1, 'year');
    }
    return years;
};

// Helper to generate Calendar Months (Jan, Feb...)
const generateCalendarMonthItems = () => {
    const months = [];
    const startDate = moment('2026-01-01').startOf('month');
    const endDate = moment('2027-12-31').endOf('month');

    let current = startDate.clone();
    let idCounter = 1000;

    while (current.isBefore(endDate)) {
        const end = current.clone().endOf('month');
        months.push({
            id: idCounter++,
            group: GROUP_IDS.CALENDAR_MONTHS,
            title: current.format('MMMM'), // Full month name (e.g. "Juni")
            start_time: current.valueOf(),
            end_time: end.valueOf(),
            itemProps: { style: { background: '#000000', color: 'white', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', textAlign: 'center' as const, borderRadius: 0, fontSize: '12px', fontWeight: '500' } }
        });
        current.add(1, 'month');
    }
    return months;
};

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
            itemProps: { style: { background: '#000000', color: 'white', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', textAlign: 'center' as const, borderRadius: 0, fontWeight: 'bold' } }
        });
    }
    return months;
};

// Helper to generate Quarters
const generateQuarterItems = () => {
    const quarters = [];
    const startDate = moment('2026-01-01'); // Start of full year
    const endDate = moment('2027-12-31');   // End of full year

    let current = startDate.clone().startOf('quarter');
    let idCounter = 800;

    while (current.isBefore(endDate)) {
        const end = current.clone().endOf('quarter');
        quarters.push({
            id: idCounter++,
            group: GROUP_IDS.QUARTERS,
            title: `Q${current.quarter()} ${current.year()}`,
            start_time: current.valueOf(),
            end_time: end.valueOf(),
            itemProps: { style: { background: '#000000', color: 'white', borderWidth: '0 2px 0 0', borderStyle: 'solid', borderColor: 'white', textAlign: 'center' as const, borderRadius: 0, fontWeight: 'bold' } }
        });
        current.add(1, 'quarter');
    }
    return quarters;
};

// Helper to generate Calendar Weeks
const generateWeekItems = () => {
    const weeks = [];
    const startDate = moment('2026-01-01').startOf('isoWeek');
    const endDate = moment('2027-12-31').endOf('isoWeek');
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
            itemProps: { style: { background: '#000000', color: 'white', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', fontSize: '11px', textAlign: 'center' as const, borderRadius: 0, fontWeight: '500' } }
        });
        current.add(1, 'weeks');
    }
    return weeks;
};

export const ALL_TIMELINE_ITEMS = [
    ...STATIC_TIMELINE_ITEMS,
    ...generateYearItems(),
    ...generateQuarterItems(),
    ...generateCalendarMonthItems(),
    ...generateMonthItems(),
    ...generateWeekItems()
];

// Helper to calculate dynamic group height based on overlaps
const calculateGroupHeight = (groupId: number, defaultHeight = 50) => {
    const itemsInGroup = ALL_TIMELINE_ITEMS.filter(item => item.group === groupId);
    if (itemsInGroup.length === 0) return defaultHeight;

    // Simple overlap detection
    // We sort items by start time
    const sortedItems = [...itemsInGroup].sort((a, b) => a.start_time - b.start_time);

    let maxOverlapDepth = 1;

    // Check for overlaps
    for (let i = 0; i < sortedItems.length; i++) {
        let currentOverlap = 1;
        for (let j = i + 1; j < sortedItems.length; j++) {
            // If the next item starts before the current item ends, we have an overlap
            if (sortedItems[j].start_time < sortedItems[i].end_time) {
                currentOverlap++;
            }
        }
        if (currentOverlap > maxOverlapDepth) {
            maxOverlapDepth = currentOverlap;
        }
    }

    // If we have overlaps, increase height (50px per row roughly)
    return maxOverlapDepth > 1 ? maxOverlapDepth * 50 : defaultHeight;
};

export const TIMELINE_GROUPS = [
    { id: GROUP_IDS.YEARS, title: 'Jahre', stackItems: false, height: 50 },
    { id: GROUP_IDS.QUARTERS, title: 'Quartale', stackItems: false, height: 50 },
    { id: GROUP_IDS.CALENDAR_MONTHS, title: 'Monate', stackItems: false, height: 50 },
    { id: GROUP_IDS.WEEKS, title: 'Kalenderwochen', stackItems: false, height: 50 },
    { id: GROUP_IDS.PHASES, title: 'Förderphasen', stackItems: false, height: 50 },
    { id: GROUP_IDS.MONTHS, title: 'Fördermonate', stackItems: false, height: 50 },
    { id: GROUP_IDS.MILESTONES_CONCEPT, title: 'Meilensteine Konzept', stackItems: false, height: 50 },
    { id: GROUP_IDS.MILESTONES_TECH, title: 'Meilensteine Tech', stackItems: false, height: 50 },
    { id: GROUP_IDS.MILESTONES_STABILIZATION, title: 'Meilensteine Verstetigung', stackItems: true, height: 100 },
    { id: GROUP_IDS.SPRINTS, title: 'Sprints', stackItems: false, height: 50 }
];

export const APPLICATION_DATA = [
    {
        category: "1) Allgemeine Informationen",
        items: [
            { q: "Projekttitel *", a: "CitizenProject.App (CPA)" },
            { q: "Name für den Account *", a: "egbalwaldmann" },
            { q: "Vorname", a: "Egbal" },
            { q: "Nachname", a: "Waldmann" },
            { q: "E-Mail-Adresse", a: "egbal@waldmann.dev" },
            { q: "Hast du einen Account bei GitHub, BitBucket oder einer ähnlichen Plattform? Wenn ja, gib bitte den entsprechenden Link an. (optional)", a: "https://github.com/egbalwaldmann" }
        ]
    },
    {
        category: "2) Projektbeschreibung",
        items: [
            { q: "Beschreibe dein Projekt kurz. (max. 100 Wörter)", a: "Projektarbeit ist nicht nur für Wirtschaftsunternehmen, sondern auch für nicht-kommerzielle Institutionen essentiell. Letzteren fehlen oft die finanziellen Ressourcen für eine professionelle Projektmanagement-Software; Open-Source-Software erweist sich als mangelhaft oder ungeeignet. Zudem sind die Projektverantwortlichen zwar inhaltliche Expert:innen, aber oft keine Projektmanagement-Profis. Dies kostet Ressourcen und erhöht das Projektrisiko. Die CitizenProject.App bietet eine kostenlose, vollumfänglich ausgestattete OpenSource-Projektmanagement-Software und führt User:innen ohne Vorkenntnisse durch alle Projektprozesse hindurch, unterstützt durch Templates und Tipps. Die Auswahl verschiedener Projektgrößen und typischer Projektarten ermöglichen ein bedürfnisorientiertes Projektmanagement. Die Vision: Gesellschaftlich und umweltpolitisch engagierte Institutionen erzielen mit Unterstützung einer freien, für sie optimierten Software den größtmöglichen Impact." }
        ]
    },
    {
        category: "3) Gesellschaftliche Herausforderung",
        items: [
            { q: "Welche gesellschaftliche Herausforderung willst du mit dem Projekt angehen? (max. 175 Wörter)", a: "Wir befinden uns in einer globalen, multiplen Krise, deren Folgen wir in sämtlichen Lebensbereichen spüren: Erderwärmung, Umweltkatastrophen, der Verlust von Lebensräumen und Artenvielfalt, Wasserknappheit, Armut und Hunger stehen in engem Zusammenhang. Soziale Ungleichheiten, fehlende Bildungs- und Zukunftschancen, politisch rechte Tendenzen, Fremdenfeindlichkeit, Rassismus und Gewalt gefährden zunehmend demokratische Strukturen. Umso wichtiger ist die Arbeit gesellschaftlich engagierter Institutionen in Umwelt, Kultur, Bildung, Sozialem, Forschung, Medien und Politik. Sie stehen für einen Wertekanon, der sich in den UN-Nachhaltigkeitszielen spiegelt; sie übernehmen Verantwortung für essentielle Umwelt- und Sozialthemen der Gegenwart und Zukunft - jenseits gewinnorientierten Denkens. Diese Institutionen möchten wir unterstützen. Ein wesentlicher und zugleich herausfordernder Teil ihres Alltagsgeschäfts ist Projektarbeit. Prekäre Ressourcen, personelle Diskontinuitäten und Wissensverlust durch Befristungen oder Ehrenamt, fehlende Expertise im Projektmanagement und zugehörigen erfolgskritischen Bereichen wie Fundraising, Öffentlichkeitsarbeit/Marketing oder spezifischer Software gefährden den Projekterfolg und langfristig den angestrebten Impact. Die CitizenProject.App bietet eine technische Lösung für das Projektmanagement, die auf die Rahmenbedingungen, Spezifika und Bedürfnisse dieser Institutionen eingeht, User:innen an die Hand nimmt und so zum Erfolg ihrer Projekte beiträgt." }
        ]
    },
    {
        category: "4) Technische Umsetzung",
        items: [
            { q: "Wie willst du dein Projekt technisch umsetzen? (max. 175 Wörter)", a: "Frontend: Das Frontend wird mit Next.js auf Basis von React und TypeScript entwickelt. Geplant ist ein serverloser Betrieb über Vercel in einer europäischen Region. Die Benutzeroberfläche wird barrierearm nach WCAG gestaltet und unterstützt Mehrsprachigkeit über ein integriertes i18n-System. Backend: Die Backend-Logik wird über Supabase Edge Functions in TypeScript umgesetzt. Diese Funktionen übernehmen Validierungen, projektbezogene Abläufe und Benachrichtigungen, sodass kein eigener Server betrieben werden muss. Authentifizierung und Sicherheit: Für die Authentifizierung wird Supabase Auth vorgesehen. Zugriffskontrollen werden durch Row-Level-Security realisiert, um eine präzise, rollenbasierte Steuerung aller Projektdaten zu ermöglichen. Die gesamte Datenverarbeitung findet in der EU statt. Datenbank: Die geplante Datenhaltung basiert auf Supabase PostgreSQL. Das relationale Schema bildet Projekte, Aufgaben, Rollen und versionierbare Templates ab. Die Struktur wird so konzipiert, dass sie später institutionsspezifisch erweiterbar bleibt. Dateiverwaltung: Nutzerdateien werden im Supabase Object Storage gespeichert. Metadaten wie Zugehörigkeit, Versionen oder Ersteller werden relational geführt und über Policies geschützt. CI/CD und Offenheit: Automatisierte Builds, Tests und Deployments werden über GitHub Actions umgesetzt. Der Quellcode wird offen dokumentiert bereitgestellt, um Transparenz und langfristige Erweiterbarkeit zu gewährleisten." }
        ]
    },
    {
        category: "5) Aktueller Stand",
        items: [
            { q: "Hast du schon an der Idee gearbeitet? Wenn ja, beschreibe kurz den aktuellen Stand und erkläre die geplanten Neuerungen. (max. 100 Wörter)", a: "Wir haben zuvor nicht am Projekt gearbeitet, aber in unserer eigenen Praxis das Problem im Kopf gewälzt, weil es keine passende, bezahlbare Projektmanagementsoftware für gesellschaftlich engagierte Institutionen gibt. Besonders kleine Player wie gemeinnützige Kulturvereine stehen trotz ohnehin knapper Budgets ohne geeignete Tools da. Gleichzeitig fehlt auch größeren Akteur:innen wie staatlichen Hochschulen eine passende Lösung. In unserer Arbeit behelfen wir uns mit vorhandenen Tools und eigenen, mühsam erstellten Strukturen, Templates etc. – etwas, das Erfahrung erfordert, die nicht jede:r mitbringt. Die Ausschreibung des Prototype Fund kam daher genau richtig und motivierte uns, eine Software zu entwickeln, die genau diesen Bedarf aufgreift." }
        ]
    },
    {
        category: "6) Link zum Projekt",
        items: [
            { q: "Link zum bestehenden Projekt (falls vorhanden) (optional)", a: "Link Projektseite: https://www.citizenproject.app Link Folien: https://www.citizenproject.app/bewerbung Link Github-Repository: https://github.com/egbalwaldmann/citizenproject.app" }
        ]
    },
    {
        category: "7) Innovation",
        items: [
            { q: "Welche ähnlichen Ansätze gibt es schon und was wird dein Projekt anders bzw. besser machen? (max. 100 Wörter)", a: "Existierende Projektmanagement-Software ist kommerziell oder - da problematisch hinsichtlich Datenschutz, Produktumfang und -eignung für die Zielgruppe - nur eingeschränkt nutzbar (siehe https://www.citizenproject.app/bewerbung#marktanalyse). Die CitizenProject.App vereint Vorteile, die sie zur idealen Software für die Zielgruppe machen: - Als kostenlose Open-Source-Lösung ohne Vendor-Lock-In bildet sie dennoch das volle Repertoire einer Projektmanagementsoftware ab: komplexe Projekte und beliebig viele User:innen. - Verschiedene Projektarten sind auswählbar. - Nicht-Profis im Projektmanagement werden durch sämtliche Prozesse hindurchgeführt sowie mit Templates und Tipps versorgt. Dies sorgt für Effizienz, Professionalität und Fehlerfreiheit. - Das integrierte Wissensmanagement dient Institutionen für zukünftige Projekte. - DSGVO-Konformität, europäische Datenresidenz und Barrierefreiheit gewährleisten Rechtssicherheit." }
        ]
    },
    {
        category: "8) Zielgruppe",
        items: [
            { q: "Wer ist die Zielgruppe und wie soll dein Projekt sie erreichen? (max. 100 Wörter)", a: "Die CitizenProject.App ist für nichtkommerzielle Institutionen mit (zivil-)gesellschaftlichen Zwecken konzipiert, z.B.: - gemeinnützige Vereine - Hochschulen, Forschungseinrichtungen und ihre Partner - Stiftungen - NGOs - soziale Einrichtungen - Bildungseinrichtungen - Kirchen - Bürgerinitiativen Wir erreichen die Zielgruppen durch: - eine zielgerichtete Öffentlichkeitsarbeit auf Basis einer Zielgruppenanalyse und eines anschließenden Plans für die externe Kommunikation (digitale Netzwerke, Multiplikator:innen, Entscheidungsträger:innen, persönliche Kontakte / Treffen) - gemeinsames Testen des Prototypen mit ausgewählten Institutionen aus den Zielgruppen und bedürfnisorientierte Anpassung / Erweiterung - Vertrauensaufbau in der Community: Präsentation von Zweck, Funktionsweise, Zielgruppenanpassung und Sicherheitskonzept in Verbindung mit niedrigschwelligem Onboarding und strategischen Partnerschaften / Leuchtturmbeispielen" }
        ]
    },
    {
        category: "9) Meilensteine",
        items: [
            { q: "Skizziere kurz die wichtigsten Meilensteine, die im Förderzeitraum umgesetzt werden sollen. (max. 100 Wörter)", a: "- M1 Analyse & Konzept 1: Zielgruppenanalyse, Projektarten, Grundprozesse, Qualitätskriterien, Informationsarchitektur, Backlog (KW 23-29) - M2 Setup & Tech: Analyse bestehender PM-Software, Repo, CI/CD, Hosting, DB, Auth, Rollenmodell, Sicherheits- und Datenschutzbasis (KW 23-24) - M3 Konzept 2: Templates (KW 30-31) - M4 Core-Prototyp: Projektanlage, erste Projektarten, Basisprozesse, Projektrollen, Ansichten, geführte Schritte, Templates, Wissensstruktur (KW 25-33) - M5 Feature-Ausbau: weitere Projektarten, Prozesspfade, Tipps, Kalenderlogik, Benachrichtigungen (KW 34-37) - M6 Pilotphase 1: reale Pilotprojekte, Interviews, Usability-Tests, Logging, Priorisierung für Verbesserungen (KW 38-43) - M7 Stabilisierung: technische Optimierung, UX-Verbesserungen, Prototyp-Release, Nutzer-/Entwicklerdokumentation, OSS-Release (KW 44-48) - M8 Revision: Planung Second Stage (KW 47-48) https://www.citizenproject.app/bewerbung#meilensteinplanung" }
        ]
    },
    {
        category: "10) Team",
        items: [
            { q: "Bewerbt ihr euch als Team um die Förderung?", a: "ja" },
            { q: "Für Teams: Namen der Teammitglieder (verbindliche Nennung) Hinweis: Die Teams können aus bis zu 4 Personen bestehen. (optional – bitte nur leer lassen, wenn du dich allein bewerben möchtest | max. 30 Wörter)", a: "- Egbal Waldmann (Softwareentwickler) https://www.linkedin.com/in/egbalwaldmann - Dr. Manuela Hackel (Projektmanagerin) https://www.linkedin.com/in/dr-manuela-hackel" }
        ]
    },
    {
        category: "11) Erfahrung",
        items: [
            { q: "An welchen Software-Projekten hast du / habt ihr bisher gearbeitet? Bei Open-Source-Projekten bitte einen Link zum Repository angeben. Hinweis: Max. 3 Projektbeispiele angeben (mit Namen und/oder Link zum Repository) (optional | max. 100 Wörter)", a: "Seit 2017 habe ich (Egbal Waldmann) mehrere Webanwendungen als Einzelentwickler umgesetzt. Beispiel 1: Plattform zur Visualisierung internationaler Hochschulkooperationen (Angular-Frontend, Node.js-Backend, MongoDB, Konzeption, Implementierung, Wartung). Demo: https://youtu.be/JZqV9nqknp0?si=FPZmqHGfi_SmP8Dm&t=275 Beispiel 2: browserbasierte Zeiterfassung für kleine Teams (Next.js, PostgreSQL, Auth, Rollen, Auswertungen). Zusätzlich habe ich kleinere Tools für Termin- und Projektverwaltung (u. a. mit Vue, REST-APIs) entwickelt. Bisher konnten diese Projekte aus Gründen der Auftraggeber nicht als Open Source veröffentlicht werden, ich arbeite jedoch seit Jahren mit FOSS-Stacks und -Lizenzen. Beispiel 3: verschiedene Websites, Webshops und kleinere Webprojekte, u.a für den Fachverband des brandenburgischen Schulfachs LER https://www.fachverband-ler.de/ (Vue.js, Custom-Blogsystem)" }
        ]
    },
    {
        category: "12) Arbeitsstunden",
        items: [
            { q: "Wie viele Stunden willst du (bzw. will das Team) in den 6 Monaten Förderzeitraum insgesamt an der Umsetzung arbeiten? Hinweis: Bitte nur eine Zahl eintragen - max. 950 h für eine Person oder max. 1.900 h für Teams. Die Maximalförderung für die reguläre Förderphase beträgt 47.500€ für eine Person oder 95.000€ für Teams. Wie die Fördersummen berechnet werden, kann auf https://www.prototypefund.de/faq nachgelesen werden.", a: "1416" }
        ]
    },
    {
        category: "13) Motivation",
        items: [
            { q: "Erfahrung, Hintergrund, Motivation, Perspektive: Was sollen wir über dich (bzw. euch) wissen und bei der Auswahl berücksichtigen? (optional | 100 Wörter)", a: "Egbal Waldmann bringt seinen technischen Hintergrund als Webentwickler und 8 Jahre Erfahrung mit agilen Projekten und digitalen Tools an Universitäten, Unternehmen und NGOs ein. Er möchte für Institutionen aus Bildung und Zivilgesellschaft eine faire, allgemein zugängliche Software schaffen, die zugleich komplexe akademische Projekte an Hochschulen und Forschungseinrichtungen unterstützt. Dr. Manuela Hackel ist Philosophin, Literaturwissenschaftlerin und PMP-zertifizierte Projektmanagerin. Aus über 20 Jahren Erfahrung mit Projekten an Hochschulen, literarischen Vereinen und Stiftungen kennt sie traditionelle und hybride Methoden und die Arbeitsweisen, Rahmenbedingungen und Bedürfnisse nicht-kommerzieller Institutionen. Ihr Anliegen ist, diese strukturell zu stärken und einen Beitrag zu den UN-Nachhaltigkeitszielen zu leisten." }
        ]
    },
    {
        category: "14) Second-Stage-Förderung",
        items: [
            { q: "Beantragst du die viermonatige Second-Stage-Förderung nach Ablauf der sechsmonatigen regulären Förderung?", a: "ja" }
        ]
    },
    {
        category: "15) Second-Stage: Schwerpunkt",
        items: [
            { q: "Wenn du eine Verlängerung beantragen möchtest: Erzähle uns kurz, was dein Projekt braucht, um aus dem Prototypen-Stadium herauszukommen und wie du dein Projekt in den vier Monaten nachhaltig aufbauen willst. (optional - verpflichtend wenn du/ihr euch für die Second-Stage-Förderung bewirbst bzw. bewerbt | 175 Wörter)", a: "In der Second Stage wollen wir CitizenProject.App aus dem Prototypen-Stadium in einen belastbaren Einsatz bringen. Dazu testen wir den Prototypen in weiteren Institutionen mit unterschiedlichen Projektarten und evaluieren systematisch, ob die geführten Prozesse und Templates wirklich helfen. Auf Basis dieser Erkenntnisse schärfen wir Inhalte, Texte und Strukturen, entwickeln Schulungs- und Onboarding-Material und dokumentieren Best Practices. Parallel bauen wir eine kleine Community aus frühen Nutzerinstitutionen auf, etablieren Kommunikationskanäle und ein leichtgewichtiges Governance-Modell (siehe 8. Zielgruppe). Abschließend erarbeiten wir Betriebs- und Finanzierungsszenarien sowie eine Roadmap, damit das Projekt nach der Förderung weitergeführt werden kann." }
        ]
    },
    {
        category: "16) Second-Stage: Meilensteine",
        items: [
            { q: "Skizziere kurz die wichtigsten Meilensteine, die in der viermonatigen Verlängerung deines Förderzeitraum umgesetzt werden sollen. (optional - verpflichtend wenn du/ihr euch für die Second-Stage-Förderung bewirbst bzw. bewerbt | 100 Wörter)", a: "- M9 Erweiterung des Prototypen: zusätzliche Institutionen, strukturierte Tests, Kontextinterviews, Nutzungsanalyse, priorisierte Maßnahmen (KW 49/2026-KW 4/2027) - M10 Wissensaufbau: Best-Practice-Guides, Projektartenkatalog, verbesserte Templates, Onboarding-Materialien, Dokumentstruktur (KW 5-8/2027) - M11 Communityaufbau: Kommunikationskanäle, Governance-Modell, Ankerinstitutionen, Workshops für frühe Nutzergruppen (KW 49/2026-KW 12/2027) - M12 Verstetigung: Betriebsmodell, Finanzierungsszenarien, Roadmap, Implementierungsleitfaden, Abschlussbericht zur nachhaltigen Nutzung (KW 5-12/2027) Für eine visuelle Darstellung: siehe Gantt-Chart: https://www.citizenproject.app/bewerbung#meilensteinplanung" }
        ]
    }
];
