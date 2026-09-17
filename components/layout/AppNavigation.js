"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoWordmark } from "@/components";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/settings", label: "Settings" },
];

function DesktopNav({ collapsed, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-base-300 bg-linear-to-b from-base-100 to-base-200/70 px-5 py-6 backdrop-blur transition-all duration-300 ease-out md:block ${
        collapsed
          ? "-translate-x-full opacity-0 pointer-events-none"
          : "translate-x-0 opacity-100"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <LogoWordmark className="h-9 w-auto text-base-content" />
        <button
          type="button"
          onClick={onToggle}
          className="btn btn-ghost btn-xs rounded-lg text-base-content/70 hover:text-base-content"
          aria-label="Collapse navigation"
          title="Collapse navigation"
        >
          «
        </button>
      </div>
      <nav className="mt-8 grid gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl border py-3 text-sm font-semibold transition px-4 ${
                isActive
                  ? "border-primary/30 bg-primary/15 text-primary"
                  : "border-transparent text-base-content/70 hover:border-base-300 hover:bg-base-100 hover:text-base-content"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function DesktopCollapsedTrigger({ onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed left-3 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-primary/30 bg-base-100/95 p-2 shadow-lg backdrop-blur transition duration-300 ease-out hover:scale-105 md:grid"
      aria-label="Expand navigation"
      title="Expand navigation"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small branded nav control */}
      <img src="/favicon.svg" alt="SKLedger" className="h-8 w-8" />
    </button>
  );
}

function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-1/2 z-30 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center justify-around rounded-2xl border border-primary/20 bg-base-100/95 px-3 py-2 text-base-content shadow-xl backdrop-blur md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
              isActive
                ? "bg-primary/15 text-primary"
                : "text-base-content/65 hover:text-base-content"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppNavigation({
  desktopCollapsed = false,
  onDesktopToggle = () => {},
}) {
  return (
    <>
      <DesktopNav collapsed={desktopCollapsed} onToggle={onDesktopToggle} />
      <div
        className={`hidden transition-opacity duration-300 ease-out md:block ${
          desktopCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <DesktopCollapsedTrigger onToggle={onDesktopToggle} />
      </div>
      <MobileNav />
    </>
  );
}
