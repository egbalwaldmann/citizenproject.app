'use client';

import Link from 'next/link';
import { useState } from 'react';
import React from 'react';
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader } from 'react-calendar-timeline';
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

export default function Intern() {
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [columnOrderMode, setColumnOrderMode] = useState<'default' | 'alphabetical'>('default');
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<any>(null);

  // Timeline zoom state
  const [visibleTimeStart, setVisibleTimeStart] = useState(moment('2025-02-01').valueOf());
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(moment('2025-12-31').valueOf());

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
    { id: 3, title: 'Epics: Konzept/Orga', stackItems: true },
    { id: 1, title: 'Sprints', stackItems: true, height: 50 },
    { id: 2, title: 'Epics: Dev', stackItems: true },
    { id: 4, title: 'Meilensteine', stackItems: false }
  ];

  const items = [
    // --- SPRINTS (2-week cycles, starting March 2025) ---
    { id: 101, group: 1, title: 'Sprint 1', start_time: moment('2025-03-01'), end_time: moment('2025-03-14'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 102, group: 1, title: 'Sprint 2', start_time: moment('2025-03-15'), end_time: moment('2025-03-28'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 103, group: 1, title: 'Sprint 3', start_time: moment('2025-03-29'), end_time: moment('2025-04-11'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 104, group: 1, title: 'Sprint 4', start_time: moment('2025-04-12'), end_time: moment('2025-04-25'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 105, group: 1, title: 'Sprint 5', start_time: moment('2025-04-26'), end_time: moment('2025-05-09'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 106, group: 1, title: 'Sprint 6', start_time: moment('2025-05-10'), end_time: moment('2025-05-23'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 107, group: 1, title: 'Sprint 7', start_time: moment('2025-05-24'), end_time: moment('2025-06-06'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 108, group: 1, title: 'Sprint 8', start_time: moment('2025-06-07'), end_time: moment('2025-06-20'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 109, group: 1, title: 'Sprint 9', start_time: moment('2025-06-21'), end_time: moment('2025-07-04'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 110, group: 1, title: 'Sprint 10', start_time: moment('2025-07-05'), end_time: moment('2025-07-18'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 111, group: 1, title: 'Sprint 11', start_time: moment('2025-07-19'), end_time: moment('2025-08-01'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 112, group: 1, title: 'Sprint 12', start_time: moment('2025-08-02'), end_time: moment('2025-08-15'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },
    { id: 113, group: 1, title: 'Sprint 13', start_time: moment('2025-08-16'), end_time: moment('2025-08-29'), canMove: false, canResize: false, itemProps: { style: { background: '#e0e7ff', color: '#3730a3', borderStyle: 'none' } } },

    // --- EPICS: DEV ---
    { id: 201, group: 2, title: 'Setup & Tech-Stack', start_time: moment('2025-03-01'), end_time: moment('2025-03-15'), itemProps: { style: { background: '#4f46e5', borderStyle: 'none' } } },
    { id: 202, group: 2, title: 'Prototyp Core (Auth/DB)', start_time: moment('2025-03-15'), end_time: moment('2025-05-01'), itemProps: { style: { background: '#4f46e5', borderStyle: 'none' } } },
    { id: 203, group: 2, title: 'Feature: Templates', start_time: moment('2025-05-01'), end_time: moment('2025-06-15'), itemProps: { style: { background: '#4f46e5', borderStyle: 'none' } } },
    { id: 204, group: 2, title: 'Institutions-Spezifika (Stage 2)', start_time: moment('2025-09-01'), end_time: moment('2025-10-30'), itemProps: { style: { background: '#818cf8', borderStyle: 'none' } } },
    { id: 205, group: 2, title: 'Wissensmanagement (Stage 2)', start_time: moment('2025-11-01'), end_time: moment('2025-12-31'), itemProps: { style: { background: '#818cf8', borderStyle: 'none' } } },

    // --- EPICS: KONZEPT/ORGA ---
    { id: 301, group: 3, title: 'Analyse & Konzept', start_time: moment('2025-03-01'), end_time: moment('2025-04-15'), itemProps: { style: { background: '#10b981', borderStyle: 'none' } } },
    { id: 302, group: 3, title: 'Pilot-Phase 1', start_time: moment('2025-07-01'), end_time: moment('2025-08-30'), itemProps: { style: { background: '#10b981', borderStyle: 'none' } } },
    { id: 303, group: 3, title: 'Pilot-Phase 2 (Stage 2)', start_time: moment('2025-09-01'), end_time: moment('2025-11-30'), itemProps: { style: { background: '#34d399', borderStyle: 'none' } } },

    // --- MEILENSTEINE ---
    { id: 401, group: 4, title: 'M1: Analyse', start_time: moment('2025-03-30'), end_time: moment('2025-03-31'), itemProps: { style: { background: '#ef4444', borderStyle: 'none', width: '20px', borderRadius: '50%' } } },
    { id: 402, group: 4, title: 'M3: Prototyp', start_time: moment('2025-04-30'), end_time: moment('2025-05-01'), itemProps: { style: { background: '#ef4444', borderStyle: 'none', width: '20px', borderRadius: '50%' } } },
    { id: 403, group: 4, title: 'M6: Abschluss Stage 1', start_time: moment('2025-08-30'), end_time: moment('2025-08-31'), itemProps: { style: { background: '#b91c1c', borderStyle: 'none', width: '20px', borderRadius: '50%' } } },
    { id: 404, group: 4, title: 'Abschluss Stage 2', start_time: moment('2025-12-30'), end_time: moment('2025-12-31'), itemProps: { style: { background: '#b91c1c', borderStyle: 'none', width: '20px', borderRadius: '50%' } } },
  ];

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
              <span className="ml-4 text-sm bg-red-100 text-red-800 px-2 py-1 rounded">INTERN</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Interne Ressourcen</h1>
          <p className="text-gray-800 mt-2">Vergleiche, Analysen und interne Dokumentation für das CitizenProject.App Team</p>
        </div>

        {/* Software Comparison Section */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Projektmanagement-Software Vergleich</h2>
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
              <h2 className="text-2xl font-bold text-gray-900">Projekt-Roadmap</h2>
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
              itemHeightRatio={0.75}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Fragen und Antworten – Förderantrag
          </h2>

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
              <p className="text-sm text-gray-800">Platzhalter für M1–M7 (konkrete Meilensteine gemeinsam definieren):</p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>M1 – Projektplanung, Architektur und Detailkonzept</li>
                <li>M2 – Kernfunktionen der CitizenProject.App implementieren</li>
                <li>M3 – Pilotierung mit ersten Institutionen</li>
                <li>M4 – Evaluation und Anpassung</li>
                <li>M5 – Ausbau von Templates und geführten Abläufen</li>
                <li>M6 – Dokumentation und Handbuch</li>
                <li>M7 – Vorbereitung der Second-Stage-Förderung</li>
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
      </div>

    </div>
  );
}
