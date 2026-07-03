"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Users, Briefcase, Clock, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ProjectData, UserData } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [session, setSession] = useState<{ name: string; role: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()).catch(() => ({ users: [] })),
    ]).then(([auth, proj, usr]) => {
      if (!auth.user) router.push("/secret-gate");
      else setSession(auth.user);
      setProjects(proj.projects ?? []);
      setUsers(usr.users ?? []);
      setLoaded(true);
    });
  }, [router]);

  const categoryBreakdown = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderKanban },
    { label: "Team Members", value: users.length || "—", icon: Users },
    {
      label: "Categories",
      value: Object.keys(categoryBreakdown).length,
      icon: Briefcase,
    },
  ];

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-4 h-4 border border-off-white-muted border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <Activity size={16} className="text-off-white-dim" />
          <h1 className="font-serif text-2xl tracking-[0.05em] text-off-white">
            Dashboard
          </h1>
        </div>
        {session && (
          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-off-white-dim ml-[31px]">
            Welcome back, {session.name}
            {session.role === "super_user" && (
              <span className="ml-2 text-amber-400/80">&middot; CEO</span>
            )}
          </p>
        )}
      </motion.div>

      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={item}
              className="glass group p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim">
                  {stat.label}
                </p>
                <Icon
                  size={15}
                  className="text-off-white-dim group-hover:text-off-white-muted transition-colors duration-300"
                />
              </div>
              <p className="font-serif text-3xl text-off-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          variants={item}
          className="glass p-5"
        >
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim mb-4 flex items-center gap-2">
            <Clock size={12} />
            Recent Projects
          </h2>
          {projects.length === 0 ? (
            <p className="text-sm text-charcoal-400">No projects yet.</p>
          ) : (
            <div className="space-y-px">
              {projects.slice(0, 5).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="flex items-center justify-between py-2.5 border-b border-charcoal-700/30 last:border-0"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <span className="text-sm text-off-white truncate block">
                      {p.title}
                    </span>
                    <span className="text-[8px] text-off-white-dim">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.15em] text-off-white-dim bg-charcoal-700/50 px-2 py-0.5 shrink-0">
                    {p.category}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          variants={item}
          className="glass p-5"
        >
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim mb-4 flex items-center gap-2">
            <Briefcase size={12} />
            Projects by Category
          </h2>
          {Object.keys(categoryBreakdown).length === 0 ? (
            <p className="text-sm text-charcoal-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([cat, count], i) => {
                const total = projects.length;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-off-white">{cat}</span>
                      <span className="text-off-white-dim text-xs">{count}</span>
                    </div>
                    <div className="h-1 bg-charcoal-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease }}
                        className="h-full bg-off-white/20 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
