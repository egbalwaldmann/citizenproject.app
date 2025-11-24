'use client';

import Link from 'next/link';
import { useState } from 'react';
import React from 'react';

// Function to copy table data to clipboard in tab-separated format for Google Sheets
const copyTableToClipboard = async (visibleColumns: any) => {
  // Mapping of column keys to their data
  const columnMapping = {
    software: { header: 'Software', data: ['CitizenProject.App', 'OpenProject', 'Redmine', 'Taiga', 'Tuleap', 'Kanboard', 'Wekan', 'Odoo Project', 'ERPNext Projects'] },
    openSource: { header: 'Open Source', data: ['Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja'] },
    euData: { header: 'EU Datenresidenz', data: ['Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja'] },
    dsgvo: { header: 'DSGVO', data: ['Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja'] },
    zielgruppe: { header: 'Zielgruppe', data: ['Unis/NGOs/Vereine', 'Unternehmen', 'Technische Teams', 'Agile Teams', 'Engineering', 'Kanban-Nutzer', 'Kanban-Nutzer', 'KMU/ERP', 'ERP-Umgebungen'] },
    pmLevel: { header: 'PM-Erfahrung', data: ['Anfänger & Experte', 'Fortgeschritten', 'Experte', 'Fortgeschritten', 'Experte', 'Anfänger', 'Anfänger', 'Fortgeschritten', 'Fortgeschritten'] },
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
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
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

  // Convert string values to chips based on content
  const createChip = (value: string) => {
    if (value === '✅') return <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>;
    if (value === '❌') return <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>;
    if (value === 'Hoch' || value === 'Sehr Hoch') return <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (value === 'Mittel' || value === 'Teilweise' || value === 'Begrenzt') return <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (value === 'Niedrig') return <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (value === 'Keine') return <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (value === 'Geplant') return <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (['Unternehmen', 'Enterprise', 'Integriert'].includes(value)) return <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (['Anhänge', 'Technische Teams', 'Engineering', 'Kanban-Nutzer', 'KMU/ERP', 'ERP-Umgebungen'].includes(value)) return <span className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (['Agile Teams', 'Fortgeschritten', 'Agile Features'].includes(value)) return <span className="inline-block bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (value === 'Experte') return <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (['Plugins', 'ERP-Integration', 'Vollständiges ERP', 'Einfachheit', 'Einfaches Kanban'].includes(value)) return <span className="inline-block bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (value === 'Anfänger') return <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    if (value === 'Unbekannt') return <span className="inline-block bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded">{value}</span>;
    return <span className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">{value}</span>;
  };

  // Render table cell conditionally
  const renderCell = (columnKey: keyof typeof visibleColumns, content: React.ReactNode, className = "px-3 py-2 whitespace-nowrap text-xs text-gray-900") => {
    // Auto-convert strings to chips if they're not already JSX
    const processedContent = typeof content === 'string' ? createChip(content) : content;
    return visibleColumns[columnKey] ? <td className={className}>{processedContent}</td> : null;
  };

  // Render sortable header
  const renderSortableHeader = (columnKey: string, label: string) => {
    if (!visibleColumns[columnKey as keyof typeof visibleColumns]) return null;
    
    const isSorted = sortConfig?.key === columnKey;
    const direction = sortConfig?.direction;
    
    return (
      <th 
        className={`px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none ${columnKey === 'software' ? 'sticky left-0 bg-gray-50 z-10 hover:bg-gray-100' : ''}`}
        onClick={() => handleSort(columnKey)}
      >
        <div className="flex items-center gap-1">
          <span>{label}</span>
          <div className="flex flex-col">
            <svg className={`w-3 h-3 ${isSorted && direction === 'asc' ? 'text-indigo-600' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <svg className={`w-3 h-3 -mt-1 ${isSorted && direction === 'desc' ? 'text-indigo-600' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
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
      software: { content: <>CitizenProject.App<span className="ml-1 text-xs bg-indigo-200 text-indigo-800 px-1 py-0.5 rounded-full">★</span></>, className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-indigo-50 text-indigo-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', 
      zielgruppe: <>
        <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Unis</span>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">NGOs</span>
        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Vereine</span>
      </>, 
      pmLevel: <>
        <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Anfänger</span>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Experte</span>
      </>,
      templates: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      socialAcademic: { content: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded font-bold">✅</span>, className: 'px-3 py-2 whitespace-nowrap text-xs text-gray-900' },
      pmHilfe: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      wissenstransfer: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      rechtlich: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      barrierefreiheit: <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">Hoch</span>, 
      vendorLock: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">Keine</span>,
      anpassbar: <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">Sehr Hoch</span>, 
      anfaenger: <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">Sehr Hoch</span>, 
      dateien: <>
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Nextcloud</span>
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Sciebo</span>
      </>, 
      ki: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Geplant</span>, 
      alleinstellung: <>
        <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">NonProfit</span>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">PM-Laien</span>
      </>,
      rowClass: 'bg-indigo-50 border-l-4 border-indigo-500'
    },
    {
      software: { content: 'OpenProject', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      euData: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      dsgvo: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      zielgruppe: <>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Unternehmen</span>
        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Öffentlich</span>
      </>, 
      pmLevel: 'Fortgeschritten',
      templates: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Teilweise</span>, 
      socialAcademic: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      pmHilfe: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      wissenstransfer: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Begrenzt</span>, 
      rechtlich: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Teilweise</span>,
      barrierefreiheit: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Mittel</span>, 
      vendorLock: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Mittel</span>, 
      anpassbar: <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">Hoch</span>, 
      anfaenger: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">Niedrig</span>, 
      dateien: <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">Integriert</span>,
      ki: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      alleinstellung: <span className="inline-block bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded">Enterprise</span>, 
      rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'Redmine', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      euData: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      dsgvo: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      zielgruppe: <span className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">Technische Teams</span>, 
      pmLevel: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">Experte</span>,
      templates: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      socialAcademic: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      pmHilfe: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      wissenstransfer: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      rechtlich: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>,
      barrierefreiheit: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">Niedrig</span>, 
      vendorLock: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      anpassbar: <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">Hoch (Plugins)</span>, 
      anfaenger: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">Niedrig</span>, 
      dateien: <span className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">Anhänge</span>,
      ki: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      alleinstellung: <span className="inline-block bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded">Plugins</span>, 
      rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'Taiga', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      euData: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      dsgvo: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">✅</span>, 
      zielgruppe: <span className="inline-block bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 rounded">Agile Teams</span>, 
      pmLevel: <span className="inline-block bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 rounded">Fortgeschritten</span>,
      templates: <>
        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Agile</span>
        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">Scrum</span>
      </>, 
      socialAcademic: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      pmHilfe: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      wissenstransfer: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Begrenzt</span>, 
      rechtlich: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>,
      barrierefreiheit: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Mittel</span>, 
      vendorLock: <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      anpassbar: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Mittel</span>, 
      anfaenger: <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">Mittel</span>, 
      dateien: <span className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">Anhänge</span>,
      ki: <span className="inline-block bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">❌</span>, 
      alleinstellung: <span className="inline-block bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 rounded">Agile Features</span>, 
      rowClass: 'hover:bg-gray-50'
    },
    {
      software: { content: 'Tuleap', className: 'px-3 py-2 whitespace-nowrap text-xs font-medium sticky left-0 z-10 bg-white text-gray-900' },
      openSource: '✅', euData: '✅', dsgvo: '✅', zielgruppe: 'Engineering', pmLevel: 'Experte',
      templates: '✅', socialAcademic: '❌', pmHilfe: '❌', wissenstransfer: 'Begrenzt', rechtlich: 'Teilweise',
      barrierefreiheit: 'Unbekannt', vendorLock: 'Mittel', anpassbar: 'Sehr Hoch', anfaenger: 'Niedrig', dateien: 'Integriert',
      ki: '❌', 
      alleinstellung: <>
        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">ALM</span>
        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">DevOps</span>
      </>, 
      rowClass: 'hover:bg-gray-50'
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
                    {renderSortableHeader('software', 'Software')}
                    {renderSortableHeader('openSource', 'Open Source')}
                    {renderSortableHeader('euData', 'EU Data')}
                    {renderSortableHeader('dsgvo', 'DSGVO')}
                    {renderSortableHeader('zielgruppe', 'Zielgruppe')}
                    {renderSortableHeader('pmLevel', 'PM-Level')}
                    {renderSortableHeader('templates', 'Templates')}
                    {renderSortableHeader('socialAcademic', 'Social/Academic')}
                    {renderSortableHeader('pmHilfe', 'PM-Hilfe')}
                    {renderSortableHeader('wissenstransfer', 'Wissenstransfer')}
                    {renderSortableHeader('rechtlich', 'Rechtlich')}
                    {renderSortableHeader('barrierefreiheit', 'Barrierefreiheit')}
                    {renderSortableHeader('vendorLock', 'Vendor Lock')}
                    {renderSortableHeader('anpassbar', 'Anpassbar')}
                    {renderSortableHeader('anfaenger', 'Anfänger')}
                    {renderSortableHeader('dateien', 'Dateien')}
                    {renderSortableHeader('ki', 'KI')}
                    {renderSortableHeader('alleinstellung', 'Alleinstellung')}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedTableData.map((row, index) => {
                    const isSelected = selectedRow === index;
                    const baseRowClass = row.rowClass.includes('bg-indigo-50') ? row.rowClass : 'hover:bg-gray-50';
                    const rowClass = isSelected ? 
                      (row.rowClass.includes('bg-indigo-50') ? 
                        'bg-indigo-100 border-l-4 border-indigo-600' : 
                        'bg-blue-50 border-l-4 border-blue-500') : 
                      baseRowClass;
                    
                    return (
                    <tr 
                      key={index} 
                      className={`${rowClass} cursor-pointer transition-colors duration-150`}
                      onClick={() => handleRowClick(index)}
                    >
                      {renderCell('software', row.software.content, row.software.className)}
                      {renderCell('openSource', row.openSource)}
                      {renderCell('euData', row.euData)}
                      {renderCell('dsgvo', row.dsgvo)}
                      {renderCell('zielgruppe', row.zielgruppe)}
                      {renderCell('pmLevel', row.pmLevel)}
                      {renderCell('templates', row.templates)}
                      {renderCell('socialAcademic', 
                        typeof row.socialAcademic === 'object' && row.socialAcademic !== null && 'content' in row.socialAcademic ? row.socialAcademic.content : row.socialAcademic, 
                        typeof row.socialAcademic === 'object' && row.socialAcademic !== null && 'className' in row.socialAcademic ? row.socialAcademic.className : undefined)}
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
                  )})}
                
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