"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Ideas",
      icon: "grid_view",
      active: pathname === "/dashboard" || pathname?.startsWith("/ideas"),
    },
    {
      href: "/metrics",
      label: "Metrics",
      icon: "insights",
      active: pathname === "/metrics",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: "account_circle",
      active: pathname === "/profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1c242d] border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="mx-auto max-w-md">
        <div className="grid grid-cols-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                item.active
                  ? "text-[#137fec]"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <span className="material-symbols-outlined text-[24px] mb-1">
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
