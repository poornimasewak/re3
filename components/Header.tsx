'use client';

import { Recycle } from 'lucide-react';

interface HeaderProps {
  showTagline?: boolean;
}

/**
 * App header component with Re3 branding
 */
export default function Header({ showTagline = true }: HeaderProps) {
  return (
    <header className="gradient-bg text-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <Recycle className="w-8 h-8" />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Re3</h1>
            {showTagline && (
              <p className="text-sm opacity-90 tracking-wide">Reduce Reuse Recycle</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


