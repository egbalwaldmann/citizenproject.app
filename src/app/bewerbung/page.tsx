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

import {
  BUDGET_CONFIG,
  COLUMN_CONFIG,
  COLUMN_ORDER,
  TABLE_DATA,
  // TIMELINE_GROUPS removed - defined locally to force update
  ALL_TIMELINE_ITEMS,
  GROUP_IDS,
  APPLICATION_DATA
} from './data';

// Define groups locally to ensure updates are applied immediately
const TIMELINE_GROUPS = [
  { id: GROUP_IDS.YEARS, title: 'Jahre', stackItems: false, height: 35 },
  { id: GROUP_IDS.QUARTERS, title: 'Quartale', stackItems: false, height: 35 },
  { id: GROUP_IDS.CALENDAR_MONTHS, title: 'Monate', stackItems: false, height: 35 },
  { id: GROUP_IDS.WEEKS, title: 'Kalenderwochen', stackItems: false, height: 35 },
  { id: GROUP_IDS.PHASES, title: 'Förderphasen', stackItems: false, height: 35 },
  { id: GROUP_IDS.MONTHS, title: 'Fördermonate', stackItems: false, height: 35 },
  { id: GROUP_IDS.MILESTONES_CONCEPT, title: 'Meilensteine Konzept', stackItems: false, height: 35 },
  { id: GROUP_IDS.MILESTONES_TECH, title: 'Meilensteine Tech', stackItems: false, height: 35 },
  { id: GROUP_IDS.MILESTONES_STABILIZATION, title: 'Meilensteine Verstetigung', stackItems: true, height: 70 },
  { id: GROUP_IDS.SPRINTS, title: 'Sprints', stackItems: false, height: 35 }
];

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

// ============================================
// CUSTOM GANTT CHART IMPLEMENTATION
// ============================================

const CustomGantt = ({ onItemClick }: { onItemClick: (item: any) => void }) => {
  // 1. Configuration & Timeframe
  const startDate = moment('2026-01-01');
  const endDate = moment('2027-12-31').endOf('day');
  const totalDurationMs = endDate.valueOf() - startDate.valueOf();

  // 2. Define Groups (Order & Title)
  const GROUPS = [
    { id: GROUP_IDS.YEARS, title: 'Jahre', bgColor: 'bg-white' },
    { id: GROUP_IDS.QUARTERS, title: 'Quartale', bgColor: 'bg-white' },
    { id: GROUP_IDS.CALENDAR_MONTHS, title: 'Monate', bgColor: 'bg-white' },
    { id: GROUP_IDS.WEEKS, title: 'Kalenderwochen', bgColor: 'bg-white' },
    { id: GROUP_IDS.PHASES, title: 'Förderphasen', bgColor: 'bg-white' },
    { id: GROUP_IDS.MONTHS, title: 'Fördermonate', bgColor: 'bg-white' },
    { id: GROUP_IDS.MILESTONES_CONCEPT, title: 'Meilensteine Konzept', bgColor: 'bg-white' },
    { id: GROUP_IDS.MILESTONES_TECH, title: 'Meilensteine Tech', bgColor: 'bg-white' },
    { id: GROUP_IDS.MILESTONES_STABILIZATION, title: 'Meilensteine Verstetigung', bgColor: 'bg-white' },
    { id: GROUP_IDS.SPRINTS, title: 'Sprints', bgColor: 'bg-white' }
  ];

  // 3. Helper: Calculate Position & Width (%)
  const getPosition = (start: number, end: number) => {
    const startOffset = start - startDate.valueOf();
    const duration = end - start;
    const left = (startOffset / totalDurationMs) * 100;
    const width = (duration / totalDurationMs) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  // 4. Helper: Process Items for a Group (Overlap Detection)
  const processGroupItems = (groupId: number) => {
    // Filter items for this group
    const items = ALL_TIMELINE_ITEMS.filter(item => item.group === groupId);

    // Sort by start time
    const sorted = [...items].sort((a, b) => a.start_time - b.start_time);

    // Assign rows
    const rows: any[][] = []; // Array of rows, each row is an array of items

    sorted.forEach(item => {
      let placed = false;

      // Try to fit in existing rows
      for (let i = 0; i < rows.length; i++) {
        const lastItemInRow = rows[i][rows[i].length - 1];
        // Check if this item starts AFTER the last item ends (plus a small buffer)
        if (item.start_time >= lastItemInRow.end_time) {
          rows[i].push(item);
          placed = true;
          break;
        }
      }

      // If not placed, create a new row
      if (!placed) {
        rows.push([item]);
      }
    });

    return rows;
  };

  // 6. Helper: Generate Month Grid Lines
  const getMonthGridLines = () => {
    const lines = [];
    let current = startDate.clone().startOf('month');
    while (current.isBefore(endDate)) {
      if (current.isAfter(startDate)) {
        const pos = getPosition(current.valueOf(), current.valueOf()); // Width 0
        lines.push(
          <div
            key={current.format('YYYY-MM')}
            className="absolute top-0 bottom-0 border-l border-gray-200 pointer-events-none z-0"
            style={{ left: pos.left }}
          />
        );
      }
      current.add(1, 'month');
    }
    return lines;
  };

  // 7. Drag to Scroll Logic
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const isDown = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);

  // 8. Mouse Wheel Horizontal Scroll Logic
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If we are scrolling vertically (deltaY), translate it to horizontal scroll
      if (e.deltaY !== 0) {
        e.preventDefault(); // Prevent page vertical scroll
        container.scrollLeft += e.deltaY;
      }
    };

    // Add non-passive listener to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDown.current = true;
    scrollContainerRef.current.classList.add('cursor-grabbing');
    scrollContainerRef.current.classList.remove('cursor-grab');
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.current) return;
    isDown.current = false;
    scrollContainerRef.current.classList.remove('cursor-grabbing');
    scrollContainerRef.current.classList.add('cursor-grab');
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    isDown.current = false;
    scrollContainerRef.current.classList.remove('cursor-grabbing');
    scrollContainerRef.current.classList.add('cursor-grab');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll-fast multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // 5. Render
  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mt-8">
      <div
        ref={scrollContainerRef}
        className="relative w-full overflow-x-auto cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="min-w-[4000px] relative transition-all duration-75 ease-out"> {/* Dynamic width for zoom */}

          {/* Header Grid Lines (Background) */}
          <div className="absolute inset-0 z-0">
            {getMonthGridLines()}
          </div>

          {GROUPS.map(group => {
            const rows = processGroupItems(group.id);
            const rowHeight = 30;
            const gap = 4;
            const groupHeight = Math.max(40, rows.length * (rowHeight + gap) + 16);

            return (
              <div key={group.id} className={`flex border-b border-gray-200 ${group.bgColor} relative z-10`}>
                {/* Left Column: Title */}
                <div className="w-[200px] flex-shrink-0 p-3 border-r border-gray-200 font-medium text-sm text-gray-700 flex items-center sticky left-0 bg-inherit z-50 shadow-sm">
                  {group.title}
                </div>

                {/* Right Column: Timeline Area */}
                <div className="flex-grow relative" style={{ height: `${groupHeight}px` }}>
                  {rows.map((rowItems, rowIndex) => (
                    rowItems.map(item => {
                      const pos = getPosition(item.start_time, item.end_time);
                      return (
                        <div
                          key={item.id}
                          onClick={() => onItemClick(item)} // Trigger click handler
                          className="absolute h-[24px] top-[5px] text-xs flex items-center justify-center px-1 shadow-sm hover:shadow-md transition-all cursor-pointer border border-white/20 text-white hover:scale-[1.01] hover:shadow-md cursor-pointer group/item z-10"
                          style={{
                            left: pos.left,
                            width: pos.width,
                            top: `${8 + rowIndex * (rowHeight + gap)}px`,
                            height: `${rowHeight}px`,
                            ...item.itemProps?.style,
                            borderWidth: '1px',
                            color: 'white',
                            fontWeight: 'bold',
                            zIndex: 20
                          }}
                        >
                          {/* Dark Pink Hover Overlay */}
                          <div
                            className="gantt-hover-overlay absolute inset-0 transition-opacity pointer-events-none z-10 rounded-sm"
                            style={{
                              backgroundColor: '#831843',
                            }}
                          />

                          <span className="truncate px-1 relative z-20 text-white">{item.title}</span>

                          {/* Tooltip */}
                          <div className="hidden group-hover/item:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-700 text-white text-xs p-2 rounded z-50 pointer-events-none shadow-lg">
                            <div className="font-bold mb-1">{item.title}</div>
                            <div className="mb-1 opacity-75">{moment(item.start_time).format('DD.MM.YYYY')} - {moment(item.end_time).format('DD.MM.YYYY')}</div>
                            {item.description && <div className="italic">{item.description}</div>}
                          </div>
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function Intern() {
  const [showDetails, setShowDetails] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [columnOrderMode, setColumnOrderMode] = useState<'default' | 'alphabetical'>('default');
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<any>(null);
  const [isTotalCollapsed, setIsTotalCollapsed] = useState(true);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  React.useEffect(() => {
    moment.locale('de');
  }, []);

  // ============================================
  // KALKULATION LOGIC & STATE
  // ============================================
  const {
    PHASE_1_BUDGET,
    PHASE_1_MONTHS,
    MAX_HOURS_PHASE_1,
    HOLIDAYS_PHASE_1_WEEKDAYS,
    PHASE_2_BUDGET,
    PHASE_2_MONTHS,
    MAX_HOURS_PHASE_2,
    HOLIDAYS_PHASE_2_WEEKDAYS,
    VACATION_DAYS_PER_MONTH,
    TEAM_SIZE
  } = BUDGET_CONFIG;

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

  // Helper for phase calculations
  const calculatePhase = (
    budget: number,
    months: number,
    materialPercentage: number,
    holidaysWeekdays: number,
    egbalHoursPerWeek: number,
    manuelaHoursPerWeek: number
  ) => {
    const materialCosts = budget * (materialPercentage / 100);
    const personnel = budget - materialCosts;

    const egbalTotalHours = egbalHoursPerWeek * 4.33 * months;
    const manuelaTotalHours = manuelaHoursPerWeek * 4.33 * months;
    const teamTotalHours = egbalTotalHours + manuelaTotalHours;

    const hourlyRate = teamTotalHours > 0 ? personnel / teamTotalHours : 0;

    const egbalPay = hourlyRate * egbalTotalHours;
    const manuelaPay = hourlyRate * manuelaTotalHours;

    // Net hours calculation
    const vacationDays = VACATION_DAYS_PER_MONTH * months;
    const deductibleDays = holidaysWeekdays + vacationDays;

    const egbalDeduction = deductibleDays * (egbalHoursPerWeek / 5);
    const manuelaDeduction = deductibleDays * (manuelaHoursPerWeek / 5);

    const egbalNetHours = Math.max(0, egbalTotalHours - egbalDeduction);
    const manuelaNetHours = Math.max(0, manuelaTotalHours - manuelaDeduction);

    return {
      materialCosts,
      personnel,
      egbalTotalHours,
      manuelaTotalHours,
      teamTotalHours,
      hourlyRate,
      egbalPay,
      manuelaPay,
      egbalNetHours,
      manuelaNetHours,
      teamNetHours: egbalNetHours + manuelaNetHours
    };
  };

  // Phase 1 Calculations
  const phase1 = calculatePhase(PHASE_1_BUDGET, PHASE_1_MONTHS, materialCostPercentage, HOLIDAYS_PHASE_1_WEEKDAYS, egbalHours, manuelaHours);

  // Phase 2 Calculations
  const phase2 = calculatePhase(PHASE_2_BUDGET, PHASE_2_MONTHS, materialCostPercentage, HOLIDAYS_PHASE_2_WEEKDAYS, egbalHours, manuelaHours);

  // Total Calculations
  const totalMaterialCosts = phase1.materialCosts + phase2.materialCosts;
  const totalPersonnel = phase1.personnel + phase2.personnel;
  const totalEgbalPay = phase1.egbalPay + phase2.egbalPay;
  const totalManuelaPay = phase1.manuelaPay + phase2.manuelaPay;
  // Weighted average hourly rate
  const totalTeamHours = phase1.teamTotalHours + phase2.teamTotalHours;
  const totalWeightedHourlyRate = totalTeamHours > 0 ? totalPersonnel / totalTeamHours : 0;
  const totalTeamNetHours = phase1.teamNetHours + phase2.teamNetHours;

  // Timeline zoom state
  const [visibleTimeStart, setVisibleTimeStart] = useState(moment('2026-05-25').valueOf());
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(moment('2026-09-25').valueOf());

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
  const tableData = TABLE_DATA;

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

  const groups = TIMELINE_GROUPS;
  const items = ALL_TIMELINE_ITEMS;

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
    const minDuration = 30 * 24 * 60 * 60 * 1000; // 30 days limit
    let newDuration = duration * 0.75; // Zoom in

    if (newDuration < minDuration) {
      newDuration = minDuration;
    }

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


      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bewerbung Prototype Fund</h1>
          <p className="text-gray-800 mt-2">Projektplanung, Kalkulation und Details zur Förderung der CitizenProject.App</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 text-sm">
            <a href="https://citizenproject.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              https://citizenproject.app
            </a>
            <a href="https://github.com/egbalwaldmann/citizenproject.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-100 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              https://github.com/egbalwaldmann/citizenproject.app
            </a>
          </div>
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
                            return renderCell(key, value.content, 'px-3 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200', isSelected);
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
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-12">
          <div className="mb-6">
            <SectionHeading id="meilensteinplanung" title="Meilensteinplanung" className="text-2xl font-bold text-gray-900" />
            <p className="text-gray-800 mt-2">
              Übersicht der parallelen Entwicklungsstränge und Meilensteine
            </p>
          </div>

          {/* NEW Custom Gantt Chart */}
          <CustomGantt onItemClick={setSelectedTimelineItem} />

          {/* Item Details - Responsive: Inline on Mobile, Modal on Desktop */}
          {selectedTimelineItem && (
            <>
              {/* Mobile View: Inline below chart */}
              <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                <div className="bg-gray-50 rounded-md p-4 relative">
                  <button
                    onClick={() => setSelectedTimelineItem(null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    title="Schließen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{selectedTimelineItem.title}</h4>
                  <div className="flex flex-col gap-2 text-sm text-gray-800">
                    <div>
                      <span className="font-semibold opacity-75 block text-xs uppercase tracking-wider">Zeitraum</span>
                      <div className="flex flex-col">
                        <span>{moment(selectedTimelineItem.start_time).format('dddd, DD. MMMM YYYY')} - {moment(selectedTimelineItem.end_time).format('dddd, DD. MMMM YYYY')}</span>
                        <span className="text-xs text-gray-600 font-medium mt-1">
                          Dauer: {Math.round(moment.duration(moment(selectedTimelineItem.end_time).diff(moment(selectedTimelineItem.start_time))).asDays()) + 1} Tage
                          (ca. {Math.round(moment.duration(moment(selectedTimelineItem.end_time).diff(moment(selectedTimelineItem.start_time))).asWeeks())} Wochen)
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold opacity-75 block text-xs uppercase tracking-wider">Kategorie</span>
                      {TIMELINE_GROUPS.find(g => g.id === selectedTimelineItem.group)?.title || 'Unbekannt'}
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

              {/* Desktop View: Modal Overlay */}
              <div
                className="hidden md:flex fixed inset-0 z-[100] items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all"
                onClick={() => setSelectedTimelineItem(null)}
              >
                <div
                  className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative transform transition-all scale-100 border border-gray-100"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedTimelineItem(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Schließen"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 mb-3">
                      {TIMELINE_GROUPS.find(g => g.id === selectedTimelineItem.group)?.title || 'Meilenstein'}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      {selectedTimelineItem.title}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-gray-500 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">Zeitraum & Dauer</h4>
                        <p className="text-gray-700 font-medium">
                          {moment(selectedTimelineItem.start_time).format('dddd, DD. MMMM YYYY')}
                          <br />
                          <span className="text-gray-400 text-sm">bis</span>
                          <br />
                          {moment(selectedTimelineItem.end_time).format('dddd, DD. MMMM YYYY')}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {Math.round(moment.duration(moment(selectedTimelineItem.end_time).diff(moment(selectedTimelineItem.start_time))).asDays()) + 1} Tage
                          </span>
                          <span className="text-xs text-gray-500">
                            (ca. {Math.round(moment.duration(moment(selectedTimelineItem.end_time).diff(moment(selectedTimelineItem.start_time))).asWeeks())} Wochen)
                          </span>
                          <span className="text-xs text-gray-500 border-l border-gray-300 pl-3">
                            KW {moment(selectedTimelineItem.start_time).isoWeek()} - KW {moment(selectedTimelineItem.end_time).isoWeek()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedTimelineItem.description && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                          Beschreibung
                        </h4>
                        <div className="text-gray-600 leading-relaxed bg-white p-1">
                          {selectedTimelineItem.description}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setSelectedTimelineItem(null)}
                      className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                      Schließen
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider for application questions */}
        {/* Divider for application questions */}
        {/*
        <div className="border-t border-gray-200 mt-12 pt-8">
          <SectionHeading id="faq" title="FAQ" className="text-2xl font-bold text-gray-900 mb-4" />

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

          <details className="mb-4 bg-white rounded-lg shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900 select-none">
              8. Meilensteine im Förderzeitraum
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-3">
              <p className="text-sm text-gray-800 font-semibold mb-2">First-Stage Förderung (Juni – November 2026):</p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 mb-4">
                <li><strong>M1 Analyse & Konzept 1 (KW 23-29):</strong> Zielgruppenanalyse, Projektarten, Grundprozesse, Qualitätskriterien, Informationsarchitektur, Backlog</li>
                <li><strong>M2 Setup & Tech (KW 23-24):</strong> Analyse bestehender PM-Software, Repo, CI/CD, Hosting, DB, Auth, Rollenmodell, Sicherheits- und Datenschutzbasis</li>
                <li><strong>M3 Konzept 2 (KW 30-31):</strong> Templates</li>
                <li><strong>M4 Core-Prototyp (KW 25-33):</strong> Projektanlage, erste Projektarten, Basisprozesse, Projektrollen, Ansichten, geführte Schritte, Templates, Wissensstruktur</li>
                <li><strong>M5 Feature-Ausbau (KW 34-37):</strong> weitere Projektarten, Prozesspfade, Tipps, Kalenderlogik, Benachrichtigungen</li>
                <li><strong>M6 Pilotphase 1 (KW 38-43):</strong> reale Pilotprojekte, Interviews, Usability-Tests, Logging, Priorisierung für Verbesserungen</li>
                <li><strong>M7 Stabilisierung (KW 44-48):</strong> technische Optimierung, UX-Verbesserungen, Prototyp-Release, Nutzer- und Entwicklerdokumentation, OSS-Release</li>
                <li><strong>M8 Revision (KW 47-48):</strong> Planung Second Stage</li>
              </ul>

              <p className="text-sm text-gray-800 font-semibold mb-2">Second-Stage Förderung (Dezember 2026 – März 2027):</p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li><strong>M9 Erweiterung des Prototypen (KW 49/2026-KW 4/2027):</strong> zusätzliche Institutionen, strukturierte Tests, Kontextinterviews, Nutzungsanalyse, priorisierte Maßnahmen</li>
                <li><strong>M10 Wissensaufbau (KW 5-8/2027):</strong> Best-Practice-Guides, Projektartenkatalog, verbesserte Templates, Onboarding-Materialien, Dokumentstruktur</li>
                <li><strong>M11 Communityaufbau (KW 49/2026-KW 12/2027):</strong> Kommunikationskanäle, Governance-Modell, Ankerinstitutionen, Workshops für frühe Nutzergruppen</li>
                <li><strong>M12 Verstetigung (KW 5-12/2027):</strong> Betriebsmodell, Finanzierungsszenarien, Roadmap, Implementierungsleitfaden, Abschlussbericht zur nachhaltigen Nutzung</li>
              </ul>


            </div>
          </details>

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
        */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

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

          {/* Toggle Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors flex items-center gap-2"
            >
              <span>{showDetails ? 'Details verbergen' : 'Details anzeigen'}</span>
              <svg className={`w-4 h-4 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showDetails && (
            <>


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
                <div className={`grid ${isTotalCollapsed ? 'grid-cols-3' : 'grid-cols-4'} divide-x divide-gray-200`}>
                  {/* Headers */}
                  <div className="p-6 bg-gray-50 font-bold text-gray-500 uppercase tracking-wider text-sm flex items-center">
                    Bereich
                  </div>
                  <div className="p-6 bg-green-50">
                    <div className="font-bold text-green-900 uppercase tracking-wider text-sm mb-1">Phase 1</div>
                    <div className="text-xs text-green-700">Reguläre Förderung (6 Mon.)</div>
                  </div>
                  <div className="p-6 bg-purple-50 relative group">
                    <div className="font-bold text-purple-900 uppercase tracking-wider text-sm mb-1">Phase 2</div>
                    <div className="text-xs text-purple-700">Second-Stage (4 Mon.)</div>
                    {isTotalCollapsed && (
                      <button
                        onClick={() => setIsTotalCollapsed(false)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white text-purple-900 p-1 rounded shadow-sm transition-all"
                        title="Gesamt anzeigen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {!isTotalCollapsed && (
                    <div className="p-6 bg-gray-800 text-white relative">
                      <div className="font-bold uppercase tracking-wider text-sm mb-1">Gesamt</div>
                      <div className="text-xs text-gray-400">Projektlaufzeit (10 Mon.)</div>
                      <button
                        onClick={() => setIsTotalCollapsed(true)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded shadow-sm transition-all"
                        title="Gesamt ausblenden"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Row: Budget */}
                  <div className="p-4 font-medium text-gray-900 border-t border-gray-100">Budget</div>
                  <div className="p-4 font-mono text-gray-800 border-t border-gray-100">{PHASE_1_BUDGET.toLocaleString('de-DE')} €</div>
                  <div className="p-4 font-mono text-gray-800 border-t border-gray-100">{PHASE_2_BUDGET.toLocaleString('de-DE')} €</div>
                  {!isTotalCollapsed && (
                    <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100">{totalBudget.toLocaleString('de-DE')} €</div>
                  )}

                  {/* Row: Sachkosten */}
                  <div className="p-4 font-medium text-gray-900 border-t border-gray-100 flex items-center justify-between">
                    <span>Sachkosten</span>
                    <div className="relative w-16">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={materialCostPercentage}
                        onChange={(e) => setMaterialCostPercentage(Number(e.target.value))}
                        className="block w-full rounded border-gray-300 py-0.5 px-1 text-xs text-right pr-4 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                        <span className="text-gray-500 text-xs">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 font-mono text-red-600 border-t border-gray-100">-{phase1.materialCosts.toLocaleString('de-DE')} €</div>
                  <div className="p-4 font-mono text-red-600 border-t border-gray-100">-{phase2.materialCosts.toLocaleString('de-DE')} €</div>
                  {!isTotalCollapsed && (
                    <div className="p-4 font-mono font-bold text-red-600 border-t border-gray-100">-{totalMaterialCosts.toLocaleString('de-DE')} €</div>
                  )}

                  {/* Row: Personal */}
                  <div className="p-4 font-medium text-gray-900 border-t border-gray-100 bg-gray-50/50">Verfügbar für Personal</div>
                  <div className="p-4 font-mono font-bold text-green-600 border-t border-gray-100 bg-green-50/30">{phase1.personnel.toLocaleString('de-DE')} €</div>
                  <div className="p-4 font-mono font-bold text-purple-600 border-t border-gray-100 bg-purple-50/30">{phase2.personnel.toLocaleString('de-DE')} €</div>
                  {!isTotalCollapsed && (
                    <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100 bg-gray-50/50">{totalPersonnel.toLocaleString('de-DE')} €</div>
                  )}

                  {/* Row: Hours (Gross) */}
                  <div className="p-4 font-medium text-gray-900 border-t border-gray-100">
                    Geplante Stunden (Brutto)
                  </div>
                  <div className={`p-4 font-mono border-t border-gray-100 ${phase1.teamTotalHours > MAX_HOURS_PHASE_1 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                    {phase1.teamTotalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                  </div>
                  <div className={`p-4 font-mono border-t border-gray-100 ${phase2.teamTotalHours > MAX_HOURS_PHASE_2 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                    {phase2.teamTotalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                  </div>
                  {!isTotalCollapsed && (
                    <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100">
                      {totalTeamHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                    </div>
                  )}

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
                  {!isTotalCollapsed && (
                    <div className="p-4 font-mono text-gray-500 border-t border-gray-100 bg-gray-50/30 italic">
                      {(MAX_HOURS_PHASE_1 + MAX_HOURS_PHASE_2).toLocaleString('de-DE')} h
                    </div>
                  )}

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
                    {phase1.teamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                  </div>
                  <div className="p-4 font-mono text-gray-700 border-t border-gray-100 bg-yellow-50/30">
                    {phase2.teamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                  </div>
                  {!isTotalCollapsed && (
                    <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100 bg-yellow-50/50">
                      {totalTeamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                      <div className="text-xs text-gray-500 mt-1 font-normal">
                        {((totalTeamNetHours / (MAX_HOURS_PHASE_1 + MAX_HOURS_PHASE_2)) * 100).toLocaleString('de-DE', { maximumFractionDigits: 1 })}% vom Limit
                      </div>
                    </div>
                  )}

                  {/* Row: Person Days (PT) */}
                  <div className="p-4 font-medium text-gray-900 border-t border-gray-100 bg-gray-50/50">
                    Personentage (PT)
                    <div className="text-xs text-gray-400 font-normal mt-1">1 PT = 8 Std. (Brutto)</div>
                  </div>
                  <div className="p-4 font-mono text-gray-600 border-t border-gray-100 bg-gray-50/30">{(phase1.teamTotalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                  <div className="p-4 font-mono text-gray-600 border-t border-gray-100 bg-gray-50/30">{(phase2.teamTotalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                  {!isTotalCollapsed && (
                    <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100 bg-gray-50/50">{(totalTeamHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                  )}

                  {/* Row: Stundensatz */}
                  <div className="p-4 font-medium text-gray-900 border-t border-gray-100">Sich ergebender Stundensatz</div>
                  <div className="p-4 font-mono text-gray-600 border-t border-gray-100">{phase1.hourlyRate.toLocaleString('de-DE', { maximumFractionDigits: 2 })} €/h</div>
                  <div className="p-4 font-mono text-gray-600 border-t border-gray-100">{phase2.hourlyRate.toLocaleString('de-DE', { maximumFractionDigits: 2 })} €/h</div>
                  {!isTotalCollapsed && (
                    <div className="p-4 font-mono font-bold text-gray-900 border-t border-gray-100">{totalWeightedHourlyRate.toLocaleString('de-DE', { maximumFractionDigits: 2 })} €/h (Ø)</div>
                  )}

                  {/* Spacer */}
                  <div className={`${isTotalCollapsed ? 'col-span-3' : 'col-span-4'} h-8 bg-gray-50 border-t border-gray-200`}></div>

                  {/* Egbal Section */}
                  <div className="p-4 font-bold text-indigo-900 border-t border-gray-200 bg-indigo-50 flex items-center gap-2">
                    <span>👨‍💻 Egbal</span>
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-indigo-50/10">
                    <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                    <div className="font-bold text-indigo-700">{phase1.egbalPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich</div>
                    <div className="font-mono text-gray-700">{(phase1.egbalPay / PHASE_1_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                    <div className="font-mono text-gray-700">{phase1.egbalTotalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                    <div className="font-mono text-gray-700">{(phase1.egbalTotalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-indigo-50/10">
                    <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                    <div className="font-bold text-indigo-700">{phase2.egbalPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich</div>
                    <div className="font-mono text-gray-700">{(phase2.egbalPay / PHASE_2_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                    <div className="font-mono text-gray-700">{phase2.egbalTotalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                    <div className="font-mono text-gray-700">{(phase2.egbalTotalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                  </div>
                  {!isTotalCollapsed && (
                    <div className="p-4 border-t border-gray-200 bg-indigo-50/30">
                      <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                      <div className="font-bold text-indigo-900 text-lg">{totalEgbalPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                      <div className="text-xs text-gray-500 mt-1 uppercase">Ø Monatlich</div>
                      <div className="font-mono text-gray-900 font-bold">{(totalEgbalPay / totalMonths).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                      <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                      <div className="font-mono text-gray-900 font-bold">{(phase1.egbalTotalHours + phase2.egbalTotalHours).toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                      <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                      <div className="font-mono text-gray-900 font-bold">{((phase1.egbalTotalHours + phase2.egbalTotalHours) / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                    </div>
                  )}

                  {/* Manuela Section */}
                  <div className="p-4 font-bold text-purple-900 border-t border-gray-200 bg-purple-50 flex items-center gap-2">
                    <span>👩‍🔬 Manuela</span>
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-purple-50/10">
                    <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                    <div className="font-bold text-purple-700">{phase1.manuelaPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich</div>
                    <div className="font-mono text-gray-700">{(phase1.manuelaPay / PHASE_1_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                    <div className="font-mono text-gray-700">{phase1.manuelaTotalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                    <div className="font-mono text-gray-700">{(phase1.manuelaTotalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-purple-50/10">
                    <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                    <div className="font-bold text-purple-700">{phase2.manuelaPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich</div>
                    <div className="font-mono text-gray-700">{(phase2.manuelaPay / PHASE_2_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                    <div className="font-mono text-gray-700">{phase2.manuelaTotalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                    <div className="font-mono text-gray-700">{(phase2.manuelaTotalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                  </div>
                  {!isTotalCollapsed && (
                    <div className="p-4 border-t border-gray-200 bg-purple-50/30">
                      <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                      <div className="font-bold text-purple-900 text-lg">{totalManuelaPay.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                      <div className="text-xs text-gray-500 mt-1 uppercase">Ø Monatlich</div>
                      <div className="font-mono text-gray-900 font-bold">{(totalManuelaPay / totalMonths).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                      <div className="text-xs text-gray-500 mt-1 uppercase">Stunden</div>
                      <div className="font-mono text-gray-900 font-bold">{(phase1.manuelaTotalHours + phase2.manuelaTotalHours).toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</div>
                      <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                      <div className="font-mono text-gray-900 font-bold">{((phase1.manuelaTotalHours + phase2.manuelaTotalHours) / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                    </div>
                  )}

                  {/* Beide (Team) Section */}
                  <div className="p-4 font-bold text-gray-900 border-t-4 border-gray-300 bg-gray-100 flex items-center gap-2">
                    <span>👥 Beide (Team)</span>
                  </div>
                  <div className="p-4 border-t-4 border-gray-300 bg-gray-50">
                    <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                    <div className="font-bold text-gray-900">{(phase1.egbalPay + phase1.manuelaPay).toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich (Kombiniert)</div>
                    <div className="font-mono text-gray-700">{((phase1.egbalPay + phase1.manuelaPay) / PHASE_1_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Stunden (Brutto / Netto)</div>
                    <div className="font-mono text-gray-700">
                      {phase1.teamTotalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="font-bold text-gray-800">{phase1.teamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                    <div className="font-mono text-gray-700">{(phase1.teamTotalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                  </div>
                  <div className="p-4 border-t-4 border-gray-300 bg-gray-50">
                    <div className="text-xs text-gray-500 uppercase">Gesamt</div>
                    <div className="font-bold text-gray-900">{(phase2.egbalPay + phase2.manuelaPay).toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Monatlich (Kombiniert)</div>
                    <div className="font-mono text-gray-700">{((phase2.egbalPay + phase2.manuelaPay) / PHASE_2_MONTHS).toLocaleString('de-DE', { maximumFractionDigits: 2 })} €</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Stunden (Brutto / Netto)</div>
                    <div className="font-mono text-gray-700">
                      {phase2.teamTotalHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="font-bold text-gray-800">{phase2.teamNetHours.toLocaleString('de-DE', { maximumFractionDigits: 1 })} h</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">Personentage (PT)</div>
                    <div className="font-mono text-gray-700">{(phase2.teamTotalHours / 8).toLocaleString('de-DE', { maximumFractionDigits: 1 })} PT</div>
                  </div>
                  {!isTotalCollapsed && (
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
                  )}
                </div>
              </div>
            </>
          )}

          {/* FAQ Section */}
          <div className="mt-16 border-t border-gray-200 pt-12 mb-12">
            <div className="mb-8">
              <SectionHeading id="faq" title="FAQ" className="text-2xl font-bold text-gray-900" />
            </div>
            <div className="space-y-4">
              {APPLICATION_DATA.map((section, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === section.category ? null : section.category)}
                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="font-bold text-gray-900">{section.category}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedFAQ === section.category ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFAQ === section.category && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="space-y-6">
                        {section.items.map((item, itemIdx) => (
                          <div key={itemIdx}>
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.q}</h4>
                            {item.a.includes('http') ? (
                              <div className="text-gray-600 text-sm whitespace-pre-wrap">
                                {item.a.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                                  part.match(/https?:\/\/[^\s]+/) ? (
                                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">{part}</a>
                                  ) : (
                                    part
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="text-gray-600 text-sm whitespace-pre-wrap">{item.a}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div >
    </div >
  );
}

