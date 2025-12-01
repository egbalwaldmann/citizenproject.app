import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage = '' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-purple-200">
      {children}
    </div>
  );
}
