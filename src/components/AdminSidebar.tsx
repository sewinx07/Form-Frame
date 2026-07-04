"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/stats", label: "Stats", icon: BarChart3 },
  { href: "/admin/users", label: "Team", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/secret-gate");
  };

  const sidebarContent = (
    <>
      <div className="px-5 py-6 border-b border-charcoal-700/40">
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className="font-serif text-lg tracking-[0.1em] text-off-white"
        >
          F<span className="text-off-white-dim">&amp;</span>F
        </Link>
        <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-off-white-dim">
          Admin Console
        </p>
      </div>

      {user && (
        <div className="px-5 py-3 border-b border-charcoal-700/40">
          <p className="text-xs text-off-white truncate">{user.name}</p>
          <p className="text-[8px] uppercase tracking-[0.15em] text-off-white-dim mt-0.5">
            {user.role === "super_user" ? "Super User" : "Team Member"}
          </p>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-[9px] uppercase tracking-[0.15em] transition-all duration-200 ${
                active
                  ? "bg-charcoal-700/70 text-off-white border-l border-off-white/20"
                  : "text-off-white-muted hover:text-off-white hover:bg-charcoal-700/30 border-l border-transparent"
              }`}
            >
              <Icon size={13} className={active ? "text-off-white/70" : ""} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-charcoal-700/40">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-[9px] uppercase tracking-[0.15em] text-off-white-muted hover:text-off-white hover:bg-charcoal-700/30 transition-all duration-200 border-l border-transparent hover:border-red-400/30 cursor-pointer"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden glass p-2 text-off-white-muted hover:text-off-white transition-colors"
        aria-label="Toggle sidebar"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      <aside className="hidden md:flex w-56 flex-col bg-charcoal-900/95 border-r border-charcoal-700/40 shrink-0">
        {sidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-charcoal-900/95 border-r border-charcoal-700/40 flex flex-col z-50 backdrop-blur-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
