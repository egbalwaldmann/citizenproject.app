'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginButton from '@/components/LoginButton';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;
    const isResourceActive = ['/dashboard', '/processes', '/templates', '/tasks', '/team', '/files'].some(path => pathname.startsWith(path));

    return (
        <nav className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="group">
                            <h1 className="text-2xl font-bold text-indigo-600">
                                CitizenProject<span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse mx-0.5 group-hover:scale-125 transition-transform"></span>App
                            </h1>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'}`}>
                            Startseite
                        </Link>
                        <Link href="/projects" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/projects') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'}`}>
                            Projekte
                        </Link>

                        {/* Dropdown for Resources */}
                        <div className="relative group">
                            <button className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${isResourceActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'}`}>
                                Ressourcen
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute right-0 mt-0 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                                <Link
                                    href="/dashboard"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/processes"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Prozesse
                                </Link>
                                <Link
                                    href="/templates"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Vorlagen
                                </Link>
                                <div className="border-t border-gray-100 my-1"></div>
                                <Link
                                    href="/tasks"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Aufgaben
                                </Link>
                                <Link
                                    href="/team"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Team
                                </Link>
                                <Link
                                    href="/files"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Dateien
                                </Link>
                            </div>
                        </div>

                        <div className="ml-4 relative z-50">
                            <LoginButton />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
