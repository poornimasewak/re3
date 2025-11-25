'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, History, Settings } from 'lucide-react';

/**
 * Bottom navigation bar component
 * Fixed position at bottom with three tabs: Scan, History, Settings
 */
export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Scan',
      href: '/',
      icon: Camera,
      active: pathname === '/',
    },
    {
      name: 'History',
      href: '/history',
      icon: History,
      active: pathname === '/history',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  item.active
                    ? 'text-[#20B2AA]'
                    : 'text-gray-500 hover:text-[#2E8B57]'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${item.active ? 'stroke-[2.5]' : 'stroke-2'}`}
                />
                <span className={`text-xs mt-1 ${item.active ? 'font-semibold' : 'font-medium'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}


