'use client';

import Link from 'next/link';
import { useState } from 'react';

// Function to copy table data to clipboard in tab-separated format for Google Sheets
const copyTableToClipboard = async (visibleColumns: any) => {
  // Mapping of column keys to their data
  const columnMapping = {
    software: { header: 'Software', data: ['CitizenProject.App', 'OpenProject', 'Redmine', 'Taiga', 'Tuleap', 'Kanboard', 'Wekan', 'Odoo Project', 'ERPNext Projects'] },
    openSource: { header: 'Open Source', data: ['Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja'] },
    euData: { header: 'EU Datenresidenz', data: ['Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja'] },
    dsgvo: { header: 'DSGVO', data: ['Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja'] },
    zielgruppe: { header: 'Zielgruppe', data: ['Unis/NGOs/Öffentlich', 'Unternehmen', 'Technische Teams', 'Agile Teams', 'Engineering', 'Kanban-Nutzer', 'Kanban-Nutzer', 'KMU/ERP', 'ERP-Umgebungen'] },
    pmLevel: { header: 'PM-Erfahrung', data: ['Anfänger & Experten', 'Fortgeschritten', 'Experte', 'Fortgeschritten', 'Experte', 'Anfänger', 'Anfänger', 'Fortgeschritten', 'Fortgeschritten'] },
    templates: { header: 'Prozess-Templates', data: ['Ja', 'Teilweise', 'Nein', 'Agile/Scrum', 'Ja', 'Nein', 'Nein', 'Teilweise', 'Teilweise'] },
    socialAcademic: { header: 'Social/Academic Templates', data: ['Ja', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein'] },
    pmHilfe: { header: 'PM-Anleitung', data: ['Ja', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein'] },
    wissenstransfer: { header: 'Wissenstransfer', data: ['Ja', 'Begrenzt', 'Nein', 'Begrenzt', 'Begrenzt', 'Nein', 'Nein', 'Begrenzt', 'Begrenzt'] },
    rechtlich: { header: 'Rechtliche Anpassung', data: ['Ja', 'Teilweise', 'Nein', 'Nein', 'Teilweise', 'Nein', 'Nein', 'Begrenzt', 'Begrenzt'] },
    barrierefreiheit: { header: 'Barrierefreiheit', data: ['Hoch', 'Mittel', 'Niedrig', 'Mittel', 'Unbekannt', 'Unbekannt', 'Unbekannt', 'Niedrig', 'Unbekannt'] },
    vendorLock: { header: 'Vendor Lock-In', data: ['Keine', 'Mittel', 'Nein', 'Nein', 'Mittel', 'Nein', 'Nein', 'Hoch', 'Hoch'] },
    anpassbar: { header: 'Anpassbarkeit', data: ['Sehr Hoch', 'Hoch', 'Hoch (Plugins)', 'Mittel', 'Sehr Hoch', 'Niedrig', 'Niedrig', 'Hoch', 'Hoch'] },
    anfaenger: { header: 'Anfängerfreundlich', data: ['Sehr Hoch', 'Niedrig', 'Niedrig', 'Mittel', 'Niedrig', 'Hoch', 'Hoch', 'Mittel', 'Mittel'] },
    dateien: { header: 'Dateien', data: ['Nextcloud/Sciebo', 'Integriert', 'Anhänge', 'Anhänge', 'Integriert', 'Anhänge', 'Anhänge', 'Integriert', 'Integriert'] },
    ki: { header: 'KI-Integration', data: ['Geplant', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein', 'Nein'] },
    alleinstellung: { header: 'Alleinstellung', data: ['NonProfit/PM-Laien', 'Enterprise', 'Plugins', 'Agile Features', 'ALM/DevOps', 'Einfachheit', 'Einfaches Kanban', 'ERP-Integration', 'Vollständiges ERP'] }
  };

  // Get visible columns in order
  const visibleColumnKeys = Object.keys(visibleColumns).filter(key => visibleColumns[key as keyof typeof visibleColumns]);
  
  // Build header row
  const headerRow = visibleColumnKeys.map(key => columnMapping[key as keyof typeof columnMapping].header);
  
  // Build data rows
  const dataRows = [];
  const numRows = columnMapping.software.data.length;
  
  for (let i = 0; i < numRows; i++) {
    const row = visibleColumnKeys.map(key => columnMapping[key as keyof typeof columnMapping].data[i]);
    dataRows.push(row);
  }
  
  const tableData = [headerRow, ...dataRows];
  
  // Convert to tab-separated values (TSV) for Google Sheets
  const tsvContent = tableData.map(row => row.join('\t')).join('\n');
  
  console.log('Kopiere Spalten:', visibleColumnKeys);
  console.log('TSV Content:', tsvContent);
  
  try {
    await navigator.clipboard.writeText(tsvContent);
    
    // Show success notification
    const button = document.querySelector('[title="Nur sichtbare Spalten für Google Sheets kopieren"]') as HTMLButtonElement;
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

export default function Intern() {
  const [visibleColumns, setVisibleColumns] = useState({
    software: true,
    openSource: true,
    euData: true,
    dsgvo: true,
    zielgruppe: true,
    pmLevel: true,
    templates: true,
    socialAcademic: true,
    pmHilfe: true,
    wissenstransfer: true,
    rechtlich: true,
    barrierefreiheit: true,
    vendorLock: true,
    anpassbar: true,
    anfaenger: true,
    dateien: true,
    ki: true,
    alleinstellung: true
  });

  const columnLabels = {
    software: 'Software',
    openSource: 'Open Source',
    euData: 'EU Data',
    dsgvo: 'DSGVO',
    zielgruppe: 'Zielgruppe',
    pmLevel: 'PM-Level',
    templates: 'Templates',
    socialAcademic: 'Social/Academic',
    pmHilfe: 'PM-Hilfe',
    wissenstransfer: 'Wissenstransfer',
    rechtlich: 'Rechtlich',
    barrierefreiheit: 'Barrierefreiheit',
    vendorLock: 'Vendor Lock',
    anpassbar: 'Anpassbar',
    anfaenger: 'Anfänger',
    dateien: 'Dateien',
    ki: 'KI',
    alleinstellung: 'Alleinstellung'
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev]
    }));
  };

  // Render table cell conditionally
  const renderCell = (columnKey: keyof typeof visibleColumns, content: React.ReactNode, className = "px-3 py-2 whitespace-nowrap text-xs text-gray-900") => {
    return visibleColumns[columnKey] ? <td className={className}>{content}</td> : null;
  };

  // Table data for easy rendering
  const tableData = [
    {
      software: { content: <>CitizenProject.App<span className="ml-1 text-xs bg-indigo-200 text-indigo-800 px-1 py-0.5 rounded-full">★</span></>, className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-indigo-50 text-indigo-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'Unis/NGOs/Öffentlich', pmLevel: 'Anfänger & Experten',
      templates: '✅', socialAcademic: { content: '✅', className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-bold text-green-600' },
      pmHilfe: '✅', wissenstransfer: '✅', rechtlich: '✅', barrierefreiheit: 'Hoch', vendorLock: 'Keine',
      anpassbar: 'Sehr Hoch', anfaenger: 'Sehr Hoch', dateien: 'Nextcloud/Sciebo', ki: 'Geplant', alleinstellung: 'NonProfit/PM-Laien',
      rowClass: 'bg-indigo-50 border-l-4 border-indigo-500'
    },
    {
      software: { content: 'OpenProject', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'Unternehmen', pmLevel: 'Fortgeschritten',
      templates: 'Teilweise', socialAcademic: '❌', pmHilfe: '❌', wissenstransfer: 'Begrenzt', rechtlich: 'Teilweise',
      barrierefreiheit: 'Mittel', vendorLock: 'Mittel', anpassbar: 'Hoch', anfaenger: 'Niedrig', dateien: 'Integriert',
      ki: '❌', alleinstellung: 'Enterprise', rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'Redmine', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'Technische Teams', pmLevel: 'Experte',
      templates: '❌', socialAcademic: '❌', pmHilfe: '❌', wissenstransfer: '❌', rechtlich: '❌',
      barrierefreiheit: 'Niedrig', vendorLock: '❌', anpassbar: 'Hoch (Plugins)', anfaenger: 'Niedrig', dateien: 'Anhänge',
      ki: '❌', alleinstellung: 'Plugins', rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'Taiga', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'Agile Teams', pmLevel: 'Fortgeschritten',
      templates: 'Agile/Scrum', socialAcademic: '❌', pmHilfe: '❌', wissenstransfer: 'Begrenzt', rechtlich: '❌',
      barrierefreiheit: 'Mittel', vendorLock: '❌', anpassbar: 'Mittel', anfaenger: 'Mittel', dateien: 'Anhänge',
      ki: '❌', alleinstellung: 'Agile Features', rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'Tuleap', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'Engineering', pmLevel: 'Experte',
      templates: '✅', socialAcademic: '❌', pmHilfe: '❌', wissenstransfer: 'Begrenzt', rechtlich: 'Teilweise',
      barrierefreiheit: 'Unbekannt', vendorLock: 'Mittel', anpassbar: 'Sehr Hoch', anfaenger: 'Niedrig', dateien: 'Integriert',
      ki: '❌', alleinstellung: 'ALM/DevOps', rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'Kanboard', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'Kanban-Nutzer', pmLevel: 'Anfänger',
      templates: '❌', socialAcademic: '❌', pmHilfe: '❌', wissenstransfer: '❌', rechtlich: '❌',
      barrierefreiheit: 'Unbekannt', vendorLock: '❌', anpassbar: 'Niedrig', anfaenger: 'Hoch', dateien: 'Anhänge',
      ki: '❌', alleinstellung: 'Einfachheit', rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'Wekan', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'Kanban-Nutzer', pmLevel: 'Anfänger',
      templates: '❌', socialAcademic: '❌', pmHilfe: '❌', wissenstransfer: '❌', rechtlich: '❌',
      barrierefreiheit: 'Unbekannt', vendorLock: '❌', anpassbar: 'Niedrig', anfaenger: 'Hoch', dateien: 'Anhänge',
      ki: '❌', alleinstellung: 'Einfaches Kanban', rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'Odoo Project', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'KMU/ERP', pmLevel: 'Fortgeschritten',
      templates: 'Teilweise', socialAcademic: '❌', pmHilfe: '❌', wissenstransfer: 'Begrenzt', rechtlich: 'Begrenzt',
      barrierefreiheit: 'Niedrig', vendorLock: 'Hoch', anpassbar: 'Hoch', anfaenger: 'Mittel', dateien: 'Integriert',
      ki: '❌', alleinstellung: 'ERP-Integration', rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'ERPNext Projects', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'ERP-Umgebungen', pmLevel: 'Fortgeschritten',
      templates: 'Teilweise', socialAcademic: '❌', pmHilfe: '❌', wissenstransfer: 'Begrenzt', rechtlich: 'Begrenzt',
      barrierefreiheit: 'Unbekannt', vendorLock: 'Hoch', anpassbar: 'Hoch', anfaenger: 'Mittel', dateien: 'Integriert',
      ki: '❌', alleinstellung: 'Vollständiges ERP', rowClass: 'hover:bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
          <p className="text-gray-600 mt-2">Vergleiche, Analysen und interne Dokumentation für das CitizenProject.App Team</p>
        </div>

        {/* Software Comparison Section */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Projektmanagement-Software Vergleich</h2>
                <p className="text-gray-600 mt-2">
                  Detaillierter Vergleich führender Projektmanagement-Lösungen mit Fokus auf Open Source, EU-Datenresidenz und DSGVO-Konformität
                </p>
              </div>
              <button
                onClick={() => copyTableToClipboard(visibleColumns)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Nur sichtbare Spalten für Google Sheets kopieren"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy für Sheets
              </button>
            </div>

            {/* Column Selection */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Spalten auswählen:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {Object.entries(columnLabels).map(([key, label]) => (
                  <label key={key} className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={visibleColumns[key as keyof typeof visibleColumns]}
                      onChange={() => toggleColumn(key)}
                      disabled={key === 'software'}
                      className={`mr-2 text-indigo-600 focus:ring-indigo-500 ${key === 'software' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <span className={`${visibleColumns[key as keyof typeof visibleColumns] ? 'text-gray-900' : 'text-gray-500'} ${key === 'software' ? 'font-medium' : ''}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
              <button 
                onClick={() => setVisibleColumns(Object.fromEntries(Object.keys(columnLabels).map(k => [k, true])) as any)}
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-800"
              >
                Alle auswählen
              </button>
              <span className="mx-2 text-gray-300">|</span>
              <button 
                onClick={() => setVisibleColumns({...Object.fromEntries(Object.keys(columnLabels).map(k => [k, false])), software: true} as any)}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Alle abwählen
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.software && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                        Software
                      </th>
                    )}
                    {visibleColumns.openSource && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Open Source
                      </th>
                    )}
                    {visibleColumns.euData && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        EU Data
                      </th>
                    )}
                    {visibleColumns.dsgvo && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DSGVO
                      </th>
                    )}
                    {visibleColumns.zielgruppe && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zielgruppe
                      </th>
                    )}
                    {visibleColumns.pmLevel && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PM-Level
                      </th>
                    )}
                    {visibleColumns.templates && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Templates
                      </th>
                    )}
                    {visibleColumns.socialAcademic && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Social/Academic
                      </th>
                    )}
                    {visibleColumns.pmHilfe && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PM-Hilfe
                      </th>
                    )}
                    {visibleColumns.wissenstransfer && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wissenstransfer
                      </th>
                    )}
                    {visibleColumns.rechtlich && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rechtlich
                      </th>
                    )}
                    {visibleColumns.barrierefreiheit && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Barrierefreiheit
                      </th>
                    )}
                    {visibleColumns.vendorLock && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor Lock
                      </th>
                    )}
                    {visibleColumns.anpassbar && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Anpassbar
                      </th>
                    )}
                    {visibleColumns.anfaenger && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Anfänger
                      </th>
                    )}
                    {visibleColumns.dateien && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dateien
                      </th>
                    )}
                    {visibleColumns.ki && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        KI
                      </th>
                    )}
                    {visibleColumns.alleinstellung && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alleinstellung
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, index) => (
                    <tr key={index} className={row.rowClass}>
                      {renderCell('software', row.software.content, row.software.className)}
                      {renderCell('openSource', row.openSource)}
                      {renderCell('euData', row.euData)}
                      {renderCell('dsgvo', row.dsgvo)}
                      {renderCell('zielgruppe', row.zielgruppe)}
                      {renderCell('pmLevel', row.pmLevel)}
                      {renderCell('templates', row.templates)}
                      {renderCell('socialAcademic', 
                        typeof row.socialAcademic === 'object' ? row.socialAcademic.content : row.socialAcademic, 
                        typeof row.socialAcademic === 'object' ? row.socialAcademic.className : undefined)}
                      {renderCell('pmHilfe', row.pmHilfe)}
                      {renderCell('wissenstransfer', row.wissenstransfer)}
                      {renderCell('rechtlich', row.rechtlich)}
                      {renderCell('barrierefreiheit', row.barrierefreiheit)}
                      {renderCell('vendorLock', row.vendorLock)}
                      {renderCell('anpassbar', row.anpassbar)}
                      {renderCell('anfaenger', row.anfaenger)}
                      {renderCell('dateien', row.dateien)}
                      {renderCell('ki', row.ki)}
                      {renderCell('alleinstellung', row.alleinstellung)}
                    </tr>
                  ))}
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
                <div className="mt-2 text-sm text-blue-700">
                  <p>• <strong>Vollständig Open Source</strong> - Transparenz und Community-getrieben</p>
                  <p>• <strong>EU-Datenresidenz</strong> - Ihre Daten bleiben in Europa</p>
                  <p>• <strong>Kostenlos</strong> - Keine versteckten Kosten oder User-Limits</p>
                  <p>• <strong>Bildungsfokus</strong> - Speziell für Universitäten und NGOs entwickelt</p>
                  <p>• <strong>Maximal anpassbar</strong> - Für alle Projekttypen und Prozesse</p>
                  <p>• <strong>DSGVO-konform</strong> - Datenschutz von Grund auf mitgedacht</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}