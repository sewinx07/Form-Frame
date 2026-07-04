"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Save, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { StatData } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AdminStats() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(data.stats ?? []);
    setLoaded(true);
  };

  useEffect(() => { fetchStats(); }, []);

  const handleChange = (id: string, value: string) => {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stats }),
    });
    setSaving(false);
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-4 h-4 border border-off-white-muted border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 size={16} className="text-off-white-dim" />
        <h1 className="font-serif text-2xl tracking-[0.05em] text-off-white">
          Stats
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease }}
        className="glass p-6"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-charcoal-700/40">
          <Pencil size={12} className="text-off-white-dim" />
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim">
            Edit Statistics
          </h2>
        </div>
        <div className="space-y-5">
          {stats.map((stat) => (
            <div key={stat.id} className="flex items-end gap-4">
              <div className="flex-1">
                <Input
                  id={`stat-${stat.id}`}
                  label={stat.label}
                  value={stat.value}
                  onChange={(e) => handleChange(stat.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-charcoal-700/40 flex justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2"
          >
            <Save size={13} />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
