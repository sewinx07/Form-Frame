"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Crown, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import type { UserData } from "@/lib/types";

const columns = [
  { key: "name", header: "Name", render: (u: UserData) => <span>{u.name}</span> },
  {
    key: "email",
    header: "Email",
    render: (u: UserData) => (
      <span className="text-off-white-dim text-xs">{u.email}</span>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (u: UserData) => (
      <Badge variant={u.role === "super_user" ? "warning" : "default"}>
        {u.role === "super_user" ? "CEO" : "Team"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Joined",
    render: (u: UserData) => (
      <span className="text-off-white-dim text-xs">
        {new Date(u.createdAt).toLocaleDateString()}
      </span>
    ),
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [session, setSession] = useState<{ id: string; role: string } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"team_member" | "super_user">("team_member");
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.status === 403) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);
    const data = await res.json();
    setUsers(data.users ?? []);
  }, []);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          window.location.href = "/secret-gate";
          return;
        }
        setSession(d.user);
      });
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to add member");
        return;
      }
      setName("");
      setEmail("");
      setPassword("");
      setRole("team_member");
      fetchUsers();
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to delete");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setConfirmDelete(null);
    fetchUsers();
  };

  if (authorized === false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="w-14 h-14 border border-charcoal-500/30 flex items-center justify-center mb-5">
          <ShieldAlert size={28} className="text-charcoal-400" />
        </div>
        <h1 className="font-serif text-xl tracking-[0.05em] text-off-white mb-2">
          Access Restricted
        </h1>
        <p className="text-sm text-off-white-muted max-w-sm leading-relaxed">
          This area is reserved for the CEO. Only users with super_user privileges can manage team members.
        </p>
      </motion.div>
    );
  }

  if (authorized === null) {
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
      <div className="flex items-center gap-3 mb-1">
        <Crown size={18} className="text-amber-400/70" />
        <h1 className="font-serif text-2xl tracking-[0.05em] text-off-white">
          Command Center
        </h1>
      </div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim mb-8 ml-[31px]">
        CEO-Only — Team Management
      </p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease }}
        className="glass p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-5">
          <UserPlus size={12} className="text-off-white-dim" />
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim">
            Add Team Member
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Temporary Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="relative">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "team_member" | "super_user")}
              className="w-full bg-transparent border-b border-charcoal-500 px-0 pb-2 pt-6 text-sm text-off-white transition-all duration-300 focus:outline-none focus:border-off-white/60 appearance-none cursor-pointer"
            >
              <option value="team_member" className="bg-charcoal-900">
                Team Member
              </option>
              <option value="super_user" className="bg-charcoal-900">
                Super User (CEO)
              </option>
            </select>
            <label
              htmlFor="role"
              className="absolute left-0 top-0 text-[9px] tracking-[0.15em] uppercase text-off-white-muted pointer-events-none"
            >
              Role
            </label>
          </div>
          {error && (
            <p className="text-[9px] uppercase tracking-[0.15em] text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" size="md" disabled={loading}>
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease }}
      >
        <h2 className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim mb-4">
          Team Directory ({users.length})
        </h2>
        <DataTable<UserData>
          columns={columns}
          data={users}
          onDelete={(u) => setConfirmDelete(u.id)}
        />
      </motion.div>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease }}
              className="glass p-6 max-w-sm w-full"
            >
              <p className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim mb-3">
                Confirm Removal
              </p>
              <p className="text-sm text-off-white mb-6 leading-relaxed">
                Are you sure you want to remove this team member? They will lose access to the admin panel immediately.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(confirmDelete)}
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
