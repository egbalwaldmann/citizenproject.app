'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock events
    const events = [
        { id: 1, title: 'Kick-off Meeting', date: '2024-01-05', type: 'meeting' },
        { id: 2, title: 'Stakeholder Analyse Abgabe', date: '2024-01-15', type: 'deadline' },
        { id: 3, title: 'Budget Review', date: '2024-02-15', type: 'finance' },
    ];

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday

    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
        <Layout currentPage="calendar">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Projektkalender</h1>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">←</button>
                        <h2 className="text-xl font-semibold w-48 text-center">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">→</button>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        + Termin
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                        {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="py-3 text-center text-sm font-semibold text-gray-700">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 auto-rows-fr bg-white">
                        {/* Empty cells for days before start of month */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-[120px] border-b border-r border-gray-100 p-2 bg-gray-50/30"></div>
                        ))}

                        {/* Days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayEvents = events.filter(e => e.date === dateStr);

                            return (
                                <div key={day} className="min-h-[120px] border-b border-r border-gray-100 p-2 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth()
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-700'
                                            }`}>
                                            {day}
                                        </span>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        {dayEvents.map(event => (
                                            <div key={event.id} className={`text-xs p-1 rounded truncate ${event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                                                    event.type === 'deadline' ? 'bg-red-100 text-red-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
