'use client';

import Link from 'next/link';
import { useState } from 'react';
import React from 'react';
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader, CustomMarker } from 'react-calendar-timeline';
import 'react-calendar-timeline/dist/style.css';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

// Helper to extract text from React elements
const extractText = (content: React.ReactNode): string => {
  if (typeof content === 'string') return content;
  if (typeof content === 'number') return String(content);
  if (content === null || content === undefined) return '';
  if (React.isValidElement(content)) {
    const props = content.props as { children?: React.ReactNode };
    const children = props.children;
    if (Array.isArray(children)) {
      return children.map(extractText).join(' ');
    }
    return extractText(children);
  }
  if (Array.isArray(content)) {
    return content.map(extractText).join(' ');
  }
  return '';
};

// ============================================
// SINGLE SOURCE OF TRUTH: Column definitions
// ============================================
// Add/remove columns here - everything else adapts automatically
const COLUMN_CONFIG = {
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

// Column display order (derived from COLUMN_CONFIG)
const COLUMN_ORDER = Object.keys(COLUMN_CONFIG) as (keyof typeof COLUMN_CONFIG)[];

// Helper component for section headings with copy link
const SectionHeading = ({ id, title, level = 'h2', className = '' }: { id: string, title: React.ReactNode, level?: 'h1' | 'h2', className?: string }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const Tag = level;

  return (
    <div className="group flex items-center gap-3">
      <button
        onClick={copyLink}
        className={`w-6 h-6 flex items-center justify-center transition-colors ${copied ? 'text-green-600' : 'text-gray-400 hover:text-indigo-600'}`}
        title="Link kopieren"
        aria-label="Link zu diesem Abschnitt kopieren"
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )}
      </button>
      <Tag id={id} className={className}>
        {title}
      </Tag>
    </div>
  );
};

export default function Intern() {
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [columnOrderMode, setColumnOrderMode] = useState<'default' | 'alphabetical'>('default');
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<any>(null);

  // ============================================
  // KALKULATION LOGIC & STATE
  // ============================================
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
      return days === -1 ? 'vor 1 Tag' : `vor ${Math.abs(days)} Tagen`;
    } else if (days === 0) {
      return 'heute';
    } else {
      return days === 1 ? 'in 1 Tag' : `in ${days} Tagen`;
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

  // Timeline zoom state
  const [visibleTimeStart, setVisibleTimeStart] = useState(moment('2026-05-01').valueOf());
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(moment('2027-04-30').valueOf());

  // Initialize visible columns from COLUMN_CONFIG
  const [visibleColumns, setVisibleColumns] = useState<Record<keyof typeof COLUMN_CONFIG, boolean>>(
    () => Object.fromEntries(COLUMN_ORDER.map(key => [key, true])) as Record<keyof typeof COLUMN_CONFIG, boolean>
  );

  // Column labels derived from COLUMN_CONFIG
  const columnLabels = COLUMN_CONFIG;

  // Display order based on mode
  const DISPLAY_ORDER = React.useMemo(() => {
    if (columnOrderMode === 'alphabetical') {
      return [...COLUMN_ORDER].sort((a, b) => {
        if (a === 'software') return -1;
        if (b === 'software') return 1;
        return columnLabels[a].localeCompare(columnLabels[b], 'de', { sensitivity: 'base' });
      });
    }
    return COLUMN_ORDER;
  }, [columnOrderMode]);

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev]
    }));
  };

  // Convert string values to chips - same string always gets same color
  const createChip = (value: string, isSelected = false, columnKey?: keyof typeof visibleColumns) => {
    // Bei ausgewählten Zeilen: transparenter/weißer Chip-Hintergrund
    if (isSelected) {
      return <span className="inline-block bg-white bg-opacity-20 text-white text-xs px-1.5 py-0.5 rounded border border-white border-opacity-30">{value}</span>;
    }
    // Einfache Hash-Funktion für konsistente Farbzuweisung
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32bit integer
      }
      return Math.abs(hash);
    };

    // Vordefinierte Farben für spezielle Werte
    const specialColors: { [key: string]: string } = {
      '✅': 'bg-green-100 text-green-800',
      '❌': 'bg-red-100 text-red-800',
      'Ja': 'bg-green-100 text-green-800',
      'Nein': 'bg-red-100 text-red-800',
      'Geplant': 'bg-yellow-100 text-yellow-800',
      // Vendor-Lock-Skala
      'Kein / wenig': 'bg-green-100 text-green-800',
      'Mittel': 'bg-yellow-100 text-yellow-800',
      // Anpassbarkeit-/Qualitäts-Skalen
      'Sehr Hoch': 'bg-green-100 text-green-800',
      'Hoch': 'bg-green-100 text-green-800',
      'Niedrig': 'bg-red-100 text-red-800',
      // Dateiablage
      'Integriert': 'bg-green-100 text-green-800',
      'Anhänge': 'bg-yellow-100 text-yellow-800',
    };

    // Spaltenspezifische Bewertung (z.B. PM-Erfahrung, Barrierefreiheit)
    if (columnKey === 'pmLevel') {
      const pmColors: { [key: string]: string } = {
        'Anfänger': 'bg-green-100 text-green-800',
        'Fortgeschritten': 'bg-yellow-100 text-yellow-800',
        'Experte': 'bg-red-100 text-red-800',
      };
      const colorClass = pmColors[value] || 'bg-gray-100 text-gray-800';
      return <span className={`inline-block ${colorClass} text-xs px-1.5 py-0.5 rounded`}>{value}</span>;
    }

    // Barrierefreiheit-Skala
    if (columnKey === 'barrierefreiheit') {
      const barriereColors: { [key: string]: string } = {
        'Hoch': 'bg-green-100 text-green-800',
        'Mittel': 'bg-yellow-100 text-yellow-800',
        'Niedrig': 'bg-red-100 text-red-800',
        'Unbekannt': 'bg-gray-100 text-gray-800',
      };
      const colorClass = barriereColors[value] || 'bg-gray-100 text-gray-800';
      return <span className={`inline-block ${colorClass} text-xs px-1.5 py-0.5 rounded`}>{value}</span>;
    }

    // Wenn spezieller Wert, nutze vordefinierte Farbe
    if (specialColors[value]) {
      return <span className={`inline-block ${specialColors[value]} text-xs px-1.5 py-0.5 rounded`}>{value}</span>;
    }

    // Sonst: Konsistente Farbzuweisung basierend auf String-Hash
    const colorPalette = [
      'bg-blue-100 text-blue-800',      // Blau
      'bg-purple-100 text-purple-800',  // Lila
      'bg-indigo-100 text-indigo-800',  // Indigo
      'bg-yellow-100 text-yellow-800',  // Gelb
      'bg-orange-100 text-orange-800',  // Orange
      'bg-pink-100 text-pink-800',      // Pink
      'bg-cyan-100 text-cyan-800',      // Cyan
      'bg-emerald-100 text-emerald-800' // Emerald
    ];

    const colorIndex = hashCode(value) % colorPalette.length;
    const colorClass = colorPalette[colorIndex];

    return <span className={`inline-block ${colorClass} text-xs px-1.5 py-0.5 rounded`}>{value}</span>;
  };

  // Render table cell conditionally
  const renderCell = (columnKey: keyof typeof visibleColumns, content: React.ReactNode, className = "px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200", isSelected = false) => {
    // In der Software-Spalte keine Chips erzeugen, nur Text
    const processedContent =
      columnKey === 'software'
        ? content
        : (typeof content === 'string' ? createChip(content, isSelected, columnKey) : content);

    let finalClassName = className;
    if (columnKey === 'software') {
      if (isSelected) {
        finalClassName = `${className} sticky left-0 bg-blue-600 text-white z-10`;
      } else {
        finalClassName = `${className} sticky left-0 bg-white z-10`;
      }
    } else if (isSelected) {
      finalClassName = `${className} text-white`;
    }

    return visibleColumns[columnKey] ? <td key={columnKey} className={finalClassName}>{processedContent}</td> : null;
  };

  // Render sortable header
  const renderSortableHeader = (columnKey: string, label: string) => {
    if (!visibleColumns[columnKey as keyof typeof visibleColumns]) return null;

    const isSorted = sortConfig?.key === columnKey;
    const direction = sortConfig?.direction;

    return (
      <th
        key={columnKey}
        className={`px-3 py-3 text-left text-sm font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-indigo-500 select-none transition-colors border-r border-gray-300 ${columnKey === 'software' ? 'sticky left-0 bg-indigo-600 z-10' : ''}`}
        onClick={() => handleSort(columnKey)}
      >
        <div className="flex items-center gap-1">
          <span>{label}</span>
          <div className="flex flex-col">
            <svg className={`w-3 h-3 ${isSorted && direction === 'asc' ? 'text-yellow-300' : 'text-white text-opacity-50'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <svg className={`w-3 h-3 -mt-1 ${isSorted && direction === 'desc' ? 'text-yellow-300' : 'text-white text-opacity-50'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </th>
    );
  };

  // Table data for easy rendering
  const tableData = [
    {
      software: { content: 'CitizenProject.App', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200' },
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
      software: { content: 'OpenProject', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200' },
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
      software: { content: 'Redmine', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200' },
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
      software: { content: 'Taiga', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200' },
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
      software: { content: 'Tuleap', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200' },
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
      software: { content: 'Kanboard', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200' },
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
      software: { content: 'Wekan', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200' },
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
      software: { content: 'Odoo Project', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200' },
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
      software: { content: 'ERPNext Projects', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200' },
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

  // Sort function
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort the table data
  const sortedTableData = React.useMemo(() => {
    if (!sortConfig) return tableData;

    return [...tableData].sort((a, b) => {
      let aValue = a[sortConfig.key as keyof typeof a];
      let bValue = b[sortConfig.key as keyof typeof b];

      // Handle nested objects (like socialAcademic)
      if (typeof aValue === 'object' && aValue !== null && 'content' in aValue) {
        aValue = aValue.content;
      }
      if (typeof bValue === 'object' && bValue !== null && 'content' in bValue) {
        bValue = bValue.content;
      }

      // Convert to strings for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tableData, sortConfig]);

  // Handle row selection
  const handleRowClick = (index: number) => {
    setSelectedRow(selectedRow === index ? null : index);
  };

  // Copy table to clipboard using the current column visibility and sort order
  const copyTableToClipboard = async () => {
    // Spalten, die aktuell aktiviert sind (Checkboxen), in Anzeige-Reihenfolge
    const exportColumnKeys = DISPLAY_ORDER.filter(key => visibleColumns[key]);

    if (exportColumnKeys.length === 0) {
      alert('Bitte mindestens eine Spalte auswählen.');
      return;
    }

    console.log('=== EXPORT DEBUG ===');
    console.log('Export column keys:', exportColumnKeys);
    console.log('First row data:', sortedTableData[0]);

    // Kopfzeile
    const headerRow = exportColumnKeys.map(key => columnLabels[key]);
    console.log('Header row:', headerRow);

    // Datenzeilen – verwenden die gleiche sortierte Reihenfolge wie die Tabelle
    const dataRows = sortedTableData.map((row, rowIndex) =>
      exportColumnKeys.map((key, colIndex) => {
        const value = row[key as keyof typeof row];

        if (rowIndex === 0) {
          console.log(`Column ${colIndex} (${key}):`, value);
        }

        // Software-Spalte hat Objekt mit content/className
        if (value && typeof value === 'object' && 'content' in value) {
          return String((value as { content: React.ReactNode }).content ?? '');
        }

        if (value === null || value === undefined) return '';
        return String(value);
      })
    );

    console.log('First data row:', dataRows[0]);

    const tsvContent = [headerRow, ...dataRows]
      .map(row => row.join('\t'))
      .join('\n');

    console.log('TSV preview (first 500 chars):', tsvContent.substring(0, 500));
    console.log('Total TSV length:', tsvContent.length);
    console.log('Number of rows:', [headerRow, ...dataRows].length);
    console.log('Number of columns:', headerRow.length);

    // Create HTML table for better compatibility with Google Sheets
    const htmlTable = `<table><thead><tr>${headerRow.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${dataRows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

    try {
      // Write both HTML and plain text to clipboard for maximum compatibility
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlTable], { type: 'text/html' }),
          'text/plain': new Blob([tsvContent], { type: 'text/plain' })
        })
      ]);

      // Verify clipboard content
      const clipboardContent = await navigator.clipboard.readText();
      console.log('Clipboard verification (first 300 chars):', clipboardContent.substring(0, 300));
      console.log('Clipboard matches TSV:', clipboardContent === tsvContent);

      const button = document.querySelector('[title="Nur sichtbare Spalten für Google Sheets kopieren"]') as HTMLButtonElement | null;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Kopiert!`;
        button.className = button.className.replace('bg-indigo-600 hover:bg-indigo-700', 'bg-green-600');

        setTimeout(() => {
          button.innerHTML = originalText;
          button.className = button.className.replace('bg-green-600', 'bg-indigo-600 hover:bg-indigo-700');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy table: ', err);
      alert('Fehler beim Kopieren. Bitte manuell markieren und kopieren.');
    }
  };

  // ============================================
  // SCRUM ROADMAP (React-Calendar-Timeline)
  // ============================================

  const groups = [
    { id: 0, title: 'Förderphasen', stackItems: false, height: 40 },
    { id: 5, title: 'Fördermonate', stackItems: false, height: 40 },
    { id: 6, title: 'Kalenderwochen', stackItems: false, height: 40 },
    { id: 1, title: 'Sprints', stackItems: false, height: 50 },
    { id: 4, title: 'Meilensteine', stackItems: false }
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
        group: 5,
        title: `${i + 1}`,
        start_time: start,
        end_time: end,
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
        group: 6,
        title: `${current.isoWeek()}`,
        start_time: current.clone(),
        end_time: end,
        itemProps: { style: { background: '#f3f4f6', color: '#6b7280', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', fontSize: '10px', textAlign: 'center' as const, borderRadius: 0 } }
      });
      current.add(1, 'weeks');
    }
    return weeks;
  };

  const staticItems = [
    // --- FÖRDERPHASEN ---
    { id: 1, group: 0, title: 'Förderphase 1', start_time: moment('2026-06-01'), end_time: moment('2026-11-30').endOf('day'), itemProps: { style: { background: '#64748b', borderStyle: 'none', borderRadius: 0 } } },
    { id: 2, group: 0, title: 'Förderphase 2', start_time: moment('2026-12-01'), end_time: moment('2027-03-31').endOf('day'), itemProps: { style: { background: '#f59e0b', borderStyle: 'none', borderRadius: 0 } } },

    // --- SPRINTS (2-week cycles) ---
    // Phase 1 (June - Nov 2026)
    { id: 101, group: 1, title: '1', start_time: moment('2026-06-01'), end_time: moment('2026-06-14').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 102, group: 1, title: '2', start_time: moment('2026-06-15'), end_time: moment('2026-06-28').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 103, group: 1, title: '3', start_time: moment('2026-06-29'), end_time: moment('2026-07-12').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 104, group: 1, title: '4', start_time: moment('2026-07-13'), end_time: moment('2026-07-26').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 105, group: 1, title: '5', start_time: moment('2026-07-27'), end_time: moment('2026-08-09').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 106, group: 1, title: '6', start_time: moment('2026-08-10'), end_time: moment('2026-08-23').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 107, group: 1, title: '7', start_time: moment('2026-08-24'), end_time: moment('2026-09-06').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 108, group: 1, title: '8', start_time: moment('2026-09-07'), end_time: moment('2026-09-20').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 109, group: 1, title: '9', start_time: moment('2026-09-21'), end_time: moment('2026-10-04').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 110, group: 1, title: '10', start_time: moment('2026-10-05'), end_time: moment('2026-10-18').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 111, group: 1, title: '11', start_time: moment('2026-10-19'), end_time: moment('2026-11-01').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 112, group: 1, title: '12', start_time: moment('2026-11-02'), end_time: moment('2026-11-15').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 113, group: 1, title: '13', start_time: moment('2026-11-16'), end_time: moment('2026-11-29').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },

    // Phase 2 (Dec 2026 - Mar 2027)
    { id: 114, group: 1, title: '14', start_time: moment('2026-12-01'), end_time: moment('2026-12-14').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 115, group: 1, title: '15', start_time: moment('2026-12-15'), end_time: moment('2026-12-28').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 116, group: 1, title: '16', start_time: moment('2026-12-29'), end_time: moment('2027-01-11').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 117, group: 1, title: '17', start_time: moment('2027-01-12'), end_time: moment('2027-01-25').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 118, group: 1, title: '18', start_time: moment('2027-01-26'), end_time: moment('2027-02-08').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 119, group: 1, title: '19', start_time: moment('2027-02-09'), end_time: moment('2027-02-22').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 120, group: 1, title: '20', start_time: moment('2027-02-23'), end_time: moment('2027-03-08').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 121, group: 1, title: '21', start_time: moment('2027-03-09'), end_time: moment('2027-03-22').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
    { id: 122, group: 1, title: '22', start_time: moment('2027-03-23'), end_time: moment('2027-04-05').endOf('day'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderWidth: '0 1px 0 0', borderStyle: 'solid', borderColor: 'white', borderRadius: 0 } } },
  ];

  const items = [...staticItems, ...generateMonthItems(), ...generateWeekItems()];

  const handleItemSelect = (itemId: number, e: any, time: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedTimelineItem(item);
    }
  };

  const handleTimeChange = (visibleTimeStart: number, visibleTimeEnd: number, updateScrollCanvas: (start: number, end: number) => void) => {
    setVisibleTimeStart(visibleTimeStart);
    setVisibleTimeEnd(visibleTimeEnd);
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
  };

  const handleZoomIn = () => {
    const duration = visibleTimeEnd - visibleTimeStart;
    const newDuration = duration * 0.75; // Zoom in
    const center = visibleTimeStart + duration / 2;
    setVisibleTimeStart(center - newDuration / 2);
    setVisibleTimeEnd(center + newDuration / 2);
  };

  const handleZoomOut = () => {
    const duration = visibleTimeEnd - visibleTimeStart;
    const newDuration = duration * 1.25; // Zoom out
    const center = visibleTimeStart + duration / 2;
    setVisibleTimeStart(center - newDuration / 2);
    setVisibleTimeEnd(center + newDuration / 2);
  };


  return (
    <div className="min-h-screen bg-gray-50" >
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">CitizenProject.App</Link>
              <span className="ml-4 text-sm bg-red-100 text-red-800 px-2 py-1 rounded">BEWERBUNG</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <a
                href="https://github.com/egbalwaldmann/citizenproject.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-md transition-colors"
                aria-label="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <SectionHeading id="interne-ressourcen" level="h1" title="Interne Ressourcen" className="text-3xl font-bold text-gray-900" />
          <p className="text-gray-800 mt-2">Vergleiche, Analysen und interne Dokumentation für das CitizenProject.App Team</p>
        </div>

        {/* Software Comparison Section */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <SectionHeading id="marktanalyse" title="Marktanalyse" className="text-2xl font-bold text-gray-900" />
                <p className="text-gray-800 mt-2">
                  Detaillierter Vergleich führender Projektmanagement-Lösungen mit Fokus auf Open Source, EU-Datenresidenz und DSGVO-Konformität
                </p>
              </div>
              <button
                onClick={() => copyTableToClipboard()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Nur sichtbare Spalten für Google Sheets kopieren"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Als Tabelle kopieren
              </button>
            </div>

            {/* Column Selection */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">
                    ✓
                  </span>
                  Spalten auswählen
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    onClick={() => setVisibleColumns(Object.fromEntries(Object.keys(columnLabels).map(k => [k, true])) as any)}
                    className="px-2 py-1 rounded-full bg-white text-indigo-700 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    Alle auswählen
                  </button>
                  <button
                    onClick={() => setVisibleColumns({ ...Object.fromEntries(Object.keys(columnLabels).map(k => [k, false])), software: true } as any)}
                    className="px-2 py-1 rounded-full bg-white text-indigo-700 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    Alle abwählen
                  </button>
                  <span className="hidden md:inline-block h-4 w-px bg-gray-300 mx-1" />
                  <div className="inline-flex items-center gap-1">
                    <span className="text-gray-600">Reihenfolge:</span>
                    <div className="inline-flex rounded-full bg-white p-0.5 border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setColumnOrderMode('default')}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${columnOrderMode === 'default'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => setColumnOrderMode('alphabetical')}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${columnOrderMode === 'alphabetical'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        A–Z
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {DISPLAY_ORDER.map((key) => {
                  const label = columnLabels[key];
                  return (
                    <label key={key} className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={visibleColumns[key as keyof typeof visibleColumns]}
                        onChange={() => toggleColumn(key as string)}
                        disabled={key === 'software'}
                        className={`mr-2 text-indigo-600 focus:ring-indigo-500 ${key === 'software' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <span className={`${visibleColumns[key as keyof typeof visibleColumns] ? 'text-gray-900' : 'text-gray-500'} ${key === 'software' ? 'font-medium' : ''}`}>
                        {label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>


          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border-collapse">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    {DISPLAY_ORDER.map(key => renderSortableHeader(key, columnLabels[key]))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedTableData.map((row, index) => {
                    const isSelected = selectedRow === index;
                    const baseRowClass = 'hover:bg-gray-50';
                    const rowClass = isSelected ?
                      'bg-blue-600 text-white border-l-8 border-blue-600 shadow-lg' :
                      baseRowClass;

                    return (
                      <tr
                        key={index}
                        className={`${rowClass} cursor-pointer transition-colors duration-150`}
                        onClick={() => handleRowClick(index)}
                      >
                        {DISPLAY_ORDER.map(key => {
                          const value = row[key as keyof typeof row];
                          if (key === 'software' && typeof value === 'object' && value !== null && 'content' in value) {
                            return renderCell(key, value.content, value.className, isSelected);
                          }
                          return renderCell(key, value as React.ReactNode, undefined, isSelected);
                        })}
                      </tr>
                    )
                  })}

                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Warum CitizenProject.App?
                </h3>
                <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
                  <li><strong>Vollständig Open Source</strong> - Transparenz und Community-getrieben</li>
                  <li><strong>Kostenlos</strong> - Keine versteckten Kosten oder User-Limits</li>
                  <li><strong>Gesellschaftlicher Fokus</strong> - Speziell für nicht-kommerzielle Institutionen und Hochschulen geeignet</li>
                  <li><strong>Anfängerfreundlichkeit</strong> - geführte Prozesse, Templates und Tipps</li>
                  <li><strong>Maximal anpassbar</strong> - Für alle Projekttypen und Prozesse</li>
                  <li><strong>Wissensmanagement</strong> - Erfahrungen für zukünftige Projekte nutzbar</li>
                  <li><strong>EU-Datenresidenz</strong> - Ihre Daten bleiben in Europa</li>
                  <li><strong>DSGVO-konform</strong> - Datenschutz von Grund auf mitgedacht</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <SectionHeading id="meilensteinplanung" title="Meilensteinplanung" className="text-2xl font-bold text-gray-900" />
              <p className="text-gray-600 mt-1">Übersicht der parallelen Entwicklungsstränge und Meilensteine</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleZoomIn}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Zoom In
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
                Zoom Out
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Timeline
              groups={groups}
              items={items}
              visibleTimeStart={visibleTimeStart}
              visibleTimeEnd={visibleTimeEnd}
              onTimeChange={handleTimeChange}
              sidebarWidth={150}
              lineHeight={50}
              itemHeightRatio={0.8}
              canMove={false}
              canResize={false}
              onItemSelect={handleItemSelect}
              groupRenderer={({ group }) => (
                <div className="px-2 text-gray-900 font-medium" style={{ color: '#111827' }}>
                  {group.title}
                </div>
              )}
            >
              <TimelineHeaders className="bg-gray-100 text-gray-700">
                <SidebarHeader>
                  {({ getRootProps }) => {
                    return <div {...getRootProps()} className="p-2 font-bold text-gray-700">Tracks</div>;
                  }}
                </SidebarHeader>
                <DateHeader unit="primaryHeader" />
                <DateHeader />
              </TimelineHeaders>
              <CustomMarker date={moment('2025-09-01').valueOf()}>
                {({ styles }) => (
                  <div style={{ ...styles, backgroundColor: '#ef4444', width: '2px', zIndex: 100 }} />
                )}
              </CustomMarker>
            </Timeline>
            <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-end">
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded"></span> Sprints</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-600 rounded"></span> Dev Epics</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Konzept Epics</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Meilensteine</div>
            </div>

            {/* Inline Item Details */}
            {selectedTimelineItem && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-indigo-50 rounded-md p-4 relative">
                  <button
                    onClick={() => setSelectedTimelineItem(null)}
                    className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600"
                    title="Schließen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h4 className="font-bold text-indigo-900 text-lg mb-1">{selectedTimelineItem.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-indigo-800">
                    <div>
                      <span className="font-semibold opacity-75 block text-xs uppercase tracking-wider">Zeitraum</span>
                      {moment(selectedTimelineItem.start_time).format('DD.MM.YYYY')} - {moment(selectedTimelineItem.end_time).format('DD.MM.YYYY')}
                    </div>
                    <div>
                      <span className="font-semibold opacity-75 block text-xs uppercase tracking-wider">Kategorie</span>
                      {groups.find(g => g.id === selectedTimelineItem.group)?.title || 'Unbekannt'}
                    </div>
                    {selectedTimelineItem.description && (
                      <div className="w-full mt-2">
                        <span className="font-semibold opacity-75 block text-xs uppercase tracking-wider">Beschreibung</span>
                        {selectedTimelineItem.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider for application questions */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <SectionHeading id="faq" title="FAQ" className="text-2xl font-bold text-gray-900 mb-4" />

          {/* 1. Projekttitel */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              1. Projekttitel
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-2">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">Name:</span> Die CitizenProject.App (CPA)
              </p>
              <p className="text-sm text-gray-800">
                <span className="font-semibold">Website:</span>{' '}
                <a href="https://www.citizenproject.app" className="text-indigo-600 underline" target="_blank" rel="noreferrer">
                  https://www.citizenproject.app
                </a>
              </p>
              <p className="text-sm text-gray-800">
                <span className="font-semibold">Quellcode:</span>{' '}
                <a
                  href="https://github.com/egbalwaldmann/citizenproject.app"
                  className="text-indigo-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://github.com/egbalwaldmann/citizenproject.app
                </a>
              </p>
            </div>
          </details>

          {/* 2. Kurzbeschreibung */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              2. Beschreibe dein Projekt kurz
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-2">
              <p className="text-sm text-gray-800">
                Abstract für das Projekt: Ziele, Zielgruppen, Produkt und Mehrwert der CitizenProject.App kurz zusammenfassen.
              </p>
            </div>
          </details>

          {/* 3. Gesellschaftliche Herausforderung */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              3. Gesellschaftliche Herausforderung
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-3">
              <p className="text-sm text-gray-800">
                Projekte sind ein wichtiger Teil unseres Lebens – im Beruf, im Ehrenamt und auch privat. Wir stehen immer wieder vor der
                Herausforderung, Vorhaben zu planen und umzusetzen, die neu für uns sind und oft einzigartig bleiben.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>Ein Literaturverein organisiert eine Lesereihe in einer kulturfernen Region.</li>
                <li>Eine NonProfit-Organisation plant eine Kampagne zum Thema Lebensmittelverschwendung.</li>
                <li>Ein neues Hochschulteam arbeitet mit externen Partnern in einem mehrjährigen Drittmittelprojekt zusammen.</li>
              </ul>
              <p className="text-sm text-gray-800">
                Ob einfach oder komplex, klar definiert oder noch vage, vorhersehbar oder von Wandlungen durchzogen – Projekte fordern uns
                heraus, den Überblick zu behalten, Ressourcen zu gewinnen und sinnvoll einzusetzen, Teams zusammenzuhalten, Stakeholder
                einzubeziehen und gleichzeitig auf die eigenen Kräfte zu achten.
              </p>
              <p className="text-sm text-gray-800">
                Obwohl Projekte zum Alltagsgeschäft vieler Institutionen gehören und ein wichtiges Erfolgs-, wenn nicht Überlebenskriterium
                darstellen, stehen insbesondere nicht-kommerzielle Institutionen vor besonderen Schwierigkeiten:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-800 space-y-1">
                <li>
                  Mitarbeitende verfügen häufig nicht über hinreichendes Projektmanagement-Wissen. Dieses Wissen ist oft an einzelne Personen
                  gebunden und geht mit deren Ausscheiden verloren – besonders im Ehrenamt oder bei befristeten Stellen.
                </li>
                <li>
                  Verfügbare Projektmanagement-Software wird selten genutzt. Stattdessen werden Tabellen- oder Textprogramme verwendet, die
                  für mittlere bis größere oder dynamische Projekte ungeeignet sind.
                </li>
              </ol>
              <p className="text-sm text-gray-800">
                Gründe dafür sind unter anderem: Kostenstrukturen kommerzieller Tools, fehlende Eignung für größere Teams, mangelnde
                DSGVO-Konformität, fehlende Anpassbarkeit und die fehlende Unterstützung von Projektmanagement-Anfängerinnen und -Anfängern.
              </p>
              <p className="text-sm text-gray-800">
                Hinzu kommt, dass das in Projekten generierte Wissen selten systematisch gesichert wird. Mangelnde Ressourcen führen dazu, dass
                Wissensmanagement oft unter den Tisch fällt – mit der Folge, dass Teams „jedes Mal von vorn“ beginnen müssen.
              </p>
              <p className="text-sm text-gray-800">
                CitizenProject.App reagiert darauf, indem es speziell für diese Zielgruppen eine offene, kostenfreie und anpassbare
                Projektmanagement-Plattform bereitstellt, die ihre gesellschaftlich relevanten Projekte – im Sinne der SDGs – unterstützt.
              </p>
            </div>
          </details>

          {/* 4. Technische Umsetzung */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              4. Technische Umsetzung
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-2">
              <p className="text-sm text-gray-800">
                Technische Architektur, Tech-Stack (z. B. Next.js, TypeScript, Open Source), Hosting-Strategie, Datenhaltung und
                Datenschutzkonzept beschreiben.
              </p>
            </div>
          </details>

          {/* 5. Stand der Idee */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              5. Stand der Idee
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-2">
              <p className="text-sm text-gray-800">
                Aktuellen Prototyp-Stand von CitizenProject.App skizzieren (Dashboard, Vergleichsmatrix, erste Workflows) und geplante
                Erweiterungen im Förderzeitraum benennen.
              </p>
            </div>
          </details>

          {/* 6. Marktanalyse & Vorteil */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              6. Marktanalyse & unser Vorteil
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-3">
              <p className="text-sm text-gray-800">
                Marktanalyse: bestehende Projektmanagement-Software wird anhand definierter Qualitätskriterien geprüft.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>Qualitätskriterien aufstellen, die für unsere Zielgruppen und Zwecke wichtig sind.</li>
                <li>Diese Kriterien kurz erläutern (Bedeutung und Relevanz).</li>
                <li>
                  Basis: PM-Erfahrungen mit zivilgesellschaftlichen Projekten und Projekten an Hochschulen/Bildungseinrichtungen, rechtliche
                  Vorgaben (z. B. DSGVO), ministerielle Qualitätsanforderungen (z. B. Barrierefreiheit).
                </li>
                <li>
                  Verknüpfbarkeit mit einer DSGVO-konformen Dateiablage berücksichtigen (auch wenn eine komplett kostenlose Dateiablage
                  evtl. nicht möglich ist).
                </li>
              </ul>
              <p className="text-sm text-gray-800 font-semibold mt-2">Unser Vorteil:</p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>Komplett Open Source</li>
                <li>Geeignet für den öffentlichen Dienst (Datenresidenz in Europa, DSGVO-konform)</li>
                <li>Kein Vendor-Lock-in</li>
                <li>Kostenfrei nutzbar</li>
                <li>Intuitiv für Projektmanagement-Laien</li>
                <li>Abbildung verschiedener Projektarten</li>
                <li>Vorlagemasken für übliche Projektprozesse</li>
                <li>Templates für einzelne Prozesse</li>
                <li>Nützliche Hinweise und Tipps zum Ausfüllen</li>
              </ul>
              <p className="text-sm text-gray-800 font-semibold mt-2">Viermonatige Weiterentwicklungsphase:</p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>Probeläufe des Piloten mit Institutionen</li>
                <li>Evaluation und Anpassung der Software</li>
                <li>
                  Prüfung institutionsspezifischer Anpassungen (z. B. besondere Anforderungen von Universitäten vs. kleinen Kulturvereinen)
                </li>
              </ul>
            </div>
          </details>

          {/* 7. Zielgruppen & Erreichung */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              7. Zielgruppen & Erreichung
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-3">
              <h3 className="text-base font-semibold text-gray-900">Wer ist die Zielgruppe?</h3>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>Staatliche/öffentlich-rechtliche Institutionen (z. B. Hochschulen, Ministerien)</li>
                <li>Forschungseinrichtungen</li>
                <li>NGOs und gemeinnützige Vereine</li>
                <li>Zivilgesellschaftliche Akteure (z. B. Bürgerinitiativen)</li>
                <li>Stiftungen</li>
                <li>Bildungseinrichtungen (z. B. Schulen)</li>
                <li>Kirchen und soziale Einrichtungen</li>
                <li>Internationale Projektpartner ohne IT-Know-how</li>
              </ul>
              <p className="text-sm text-gray-800">
                Ziel: einfache Nutzung trotz komplexer Anforderungen – insbesondere im Kontext der Sustainable Development Goals (SDGs).
              </p>

              <h3 className="text-base font-semibold text-gray-900 mt-2">
                Wie soll das Projekt die Zielgruppen erreichen?
              </h3>
              <p className="text-sm text-gray-800">
                Geplante Kommunikations- und Disseminationswege skizzieren (z. B. Pilotprojekte mit Hochschulen/NGOs, Fachnetzwerke,
                Community-Building rund um das Open-Source-Projekt, Online-Dokumentation und Handbuch).
              </p>
            </div>
          </details>

          {/* 8. Meilensteine */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              8. Meilensteine im Förderzeitraum
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-3">
              <p className="text-sm text-gray-800 font-semibold mb-2">First-Stage Förderung (Juni – November 2026):</p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 mb-4">
                <li><strong>M1 (Juni 2026) Analyse & Konzept:</strong> Zielgruppen, Rahmenbedingungen, Bedürfnisse, Projektarten, typische Prozesse, Qualitätskriterien, Informationsarchitektur, Backlog</li>
                <li><strong>M2 (Juli 2026) Setup & Tech:</strong> Repo, CI/CD, Hosting, DB, Auth, Rollenmodell, Sicherheits- und Datenschutzbasis</li>
                <li><strong>M3 (August 2026) Core-Prototyp:</strong> Projektanlage, erste Projektarten, Basisprozesse, Projektrollen, Ansichten, geführte Schritte, Templates, Wissensstruktur</li>
                <li><strong>M4 (September 2026) Feature-Ausbau:</strong> weitere Projektarten, Prozesspfade, Tipps, Hinweise, Kalenderlogik, Benachrichtigungen</li>
                <li><strong>M5 (Oktober 2026) Pilotphase 1:</strong> reale Pilotprojekte, Interviews, Usability-Tests, Logging, Priorisierung für Verbesserungen</li>
                <li><strong>M6 (November 2026) Stabilisierung:</strong> technische Optimierung, UX-Verbesserungen, Prototyp-Release, Nutzer- und Entwicklerdokumentation, OSS-Release</li>
              </ul>

              <p className="text-sm text-gray-800 font-semibold mb-2">Second-Stage Förderung (Dezember 2026 – März 2027):</p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li><strong>M7 (Dezember 2026) Vertiefte Pilotphase:</strong> zusätzliche Institutionen, strukturierte Tests, Kontextinterviews, Nutzungsanalyse, priorisierte Maßnahmen</li>
                <li><strong>M8 (Januar 2027) Wissensaufbau:</strong> Best-Practice-Guides, Projektartenkatalog, verbesserte Templates, Onboarding-Materialien, Dokumentstruktur</li>
                <li><strong>M9 (Februar 2027) Community:</strong> Kommunikationskanäle, Governance-Modell, Ankerinstitutionen, Workshops für frühe Nutzergruppen</li>
                <li><strong>M10 (März 2027) Verstetigung:</strong> Betriebsmodell, Finanzierungsszenarien, Roadmap, Implementierungsleitfaden, Abschlussbericht zur nachhaltigen Nutzung</li>
              </ul>
            </div>
          </details>

          {/* 9. Team, Erfahrung & Motivation */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              9. Team, Erfahrung & Motivation
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-4">
              <h3 className="text-base font-semibold text-gray-900">
                Bewerbt ihr euch als Team um die Förderung? Wer gehört dazu?
              </h3>
              <p className="text-sm text-gray-800">
                Team: Dr. Manuela Hackel (Projektmanagement & Inhalte) und Egbal Waldmann (Technik & Produktentwicklung).
              </p>

              <h3 className="text-base font-semibold text-gray-900">
                An welchen Software-Projekten hast du/habt ihr bisher gearbeitet?
              </h3>
              <p className="text-sm text-gray-800">
                Relevante Projekte im Bildungs-, NGO- oder öffentlichen Kontext auflisten, inkl. Links zu Open-Source-Repositories.
              </p>

              <h3 className="text-base font-semibold text-gray-900">
                Bei Open-Source-Projekten: Links zu den Repositories
              </h3>
              <p className="text-sm text-gray-800">
                GitHub-Links zu bisherigen Projekten ergänzen (CitizenProject.App, weitere relevante Repos).
              </p>

              <h3 className="text-base font-semibold text-gray-900">
                Wie viele Stunden wollt ihr im Förderzeitraum insgesamt arbeiten?
              </h3>
              <p className="text-sm text-gray-800">Aktuelle Planung: 40 + 10 = 50 Stunden pro Woche.</p>

              <h3 className="text-base font-semibold text-gray-900">
                Erfahrung, Hintergrund, Motivation, Perspektive – was sollen wir über euch wissen?
              </h3>
              <div className="space-y-2 text-sm text-gray-800">
                <p className="font-semibold">Egbal Waldmann:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Erfahrung mit agilen Projekten und digitalen Tools in Universitäten und NGOs</li>
                  <li>Technischer Hintergrund in der Webentwicklung</li>
                  <li>Motivation: faire, zugängliche Software für Bildung und Zivilgesellschaft</li>
                  <li>Ziel: Open-Source-Alternative für komplexe akademische Projekte</li>
                </ul>

                <p className="font-semibold mt-4">Dr. Manuela Hackel:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Erfahrung mit verschiedenen Projektarten und -komplexitäten</li>
                  <li>Erfahrungen mit traditionellen (Wasserfall) und hybriden Projekten</li>
                  <li>Kenntnis der Zielgruppen von innen (Arbeit für Hochschulen, Vereine, öffentliche Institutionen)</li>
                  <li>PMP-Zertifikat</li>
                </ul>
              </div>
            </div>
          </details>

          {/* 10. Second-Stage-Förderung */}
          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              10. Second-Stage-Förderung
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-3">
              <p className="text-sm text-gray-800">Geplante Antwort: ja.</p>
              <p className="text-sm text-gray-800">
                Anschließend kurz beschreiben, was das Projekt braucht, um aus dem Prototypen-Stadium herauszukommen und wie in vier Monaten
                ein nachhaltiger Aufbau aussehen soll (inklusive Meilensteine für die Verlängerung).
              </p>
            </div>
          </details>
        </div>
        {/* Assuming a Timeline component would be rendered here or nearby */}
        {/* <Timeline items={timelineData} onItemSelect={handleItemSelect} /> */}
        {/* Kalkulation Section */}
        {/* Kalkulation Section */}
        <div className="mb-12">
          <div className="mb-6">
            <SectionHeading id="kalkulation" title="Kalkulation" className="text-2xl font-bold text-gray-900" />
            <p className="text-gray-800 mt-2">
              Interne Budget- und Ressourcenplanung für die Förderphasen (Vertraulich)
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
                <div className="text-xs text-gray-500 font-normal mt-1 flex items-center gap-1">
                  Abz. Urlaub (20 Tage/Jahr) & Feiertage
                  <div className="group relative inline-block">
                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl pointer-events-none">
                      <div className="font-bold mb-2 text-green-300">Phase 1 (01.06.26 – 01.12.26)</div>
                      <ul className="mb-3 space-y-1">
                        <li className="flex justify-between"><span>03.10.26</span> <span>Tag d. Dt. Einheit</span></li>
                        <li className="flex justify-between"><span>31.10.26</span> <span>Reformationstag</span></li>
                      </ul>
                      <div className="font-bold mb-2 text-purple-300">Phase 2 (01.12.26 – 31.03.27)</div>
                      <ul className="space-y-1">
                        <li className="flex justify-between"><span>25./26.12.26</span> <span>Weihnachten</span></li>
                        <li className="flex justify-between"><span>01.01.27</span> <span>Neujahr</span></li>
                        <li className="flex justify-between"><span>26.03.27</span> <span>Karfreitag</span></li>
                        <li className="flex justify-between"><span>29.03.27</span> <span>Ostermontag</span></li>
                      </ul>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
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

        </div>
      </div>
    </div>
  );
}

