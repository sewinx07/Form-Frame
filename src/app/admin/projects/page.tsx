"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderKanban, Plus, Image } from "lucide-react";
import { detectPlatform } from "@/lib/platform";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import type { ProjectData, ProjectCategory } from "@/lib/types";

const categories: ProjectCategory[] = ["Design", "Development", "Editing", "Other"];

const categoryVariant: Record<ProjectCategory, "default" | "success" | "warning" | "danger"> = {
  Design: "success",
  Development: "warning",
  Editing: "danger",
  Other: "default",
};

const columns = [
  { key: "title", header: "Title", render: (p: ProjectData) => <span>{p.title}</span> },
  {
    key: "media",
    header: "Media",
    render: (p: ProjectData) => (
      <div className="flex items-center gap-2">
        {p.imageUrl && (
          <span className="text-off-white-dim" title="Has image">
            <Image size={12} />
          </span>
        )}
        {p.linkUrl && (
          <span className={detectPlatform(p.linkUrl).color} title={detectPlatform(p.linkUrl).label}>
            {detectPlatform(p.linkUrl).icon}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    render: (p: ProjectData) => (
      <Badge variant={categoryVariant[p.category as ProjectCategory] ?? "default"}>
        {p.category}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Added",
    render: (p: ProjectData) => (
      <span className="text-off-white-dim text-xs">
        {new Date(p.createdAt).toLocaleDateString()}
      </span>
    ),
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("Design");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data.projects ?? []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, imageUrl, linkUrl, category }),
    });
    setTitle("");
    setDescription("");
    setImageUrl("");
    setLinkUrl("");
    setCategory("Design");
    setLoading(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    fetchProjects();
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
        <FolderKanban size={16} className="text-off-white-dim" />
        <h1 className="font-serif text-2xl tracking-[0.05em] text-off-white">
          Projects
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease }}
        className="glass p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-5">
          <Plus size={12} className="text-off-white-dim" />
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim">
            Publish New Work
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="title"
            label="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="relative">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Description"
              className="peer w-full bg-transparent border-b border-charcoal-500 px-0 pb-2 pt-6 text-sm text-off-white placeholder-transparent transition-all duration-300 focus:outline-none focus:border-off-white/60 resize-none h-24"
            />
            <label
              htmlFor="description"
              className="absolute left-0 top-0 text-[9px] tracking-[0.15em] uppercase text-off-white-muted pointer-events-none"
            >
              Description
            </label>
          </div>
          <Input
            id="imageUrl"
            label="Project Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Input
            id="linkUrl"
            label="External Link (Instagram, YouTube, etc.)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="w-full bg-transparent border-b border-charcoal-500 px-0 pb-2 pt-6 text-sm text-off-white transition-all duration-300 focus:outline-none focus:border-off-white/60 appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-charcoal-900">
                  {cat}
                </option>
              ))}
            </select>
            <label
              htmlFor="category"
              className="absolute left-0 top-0 text-[9px] tracking-[0.15em] uppercase text-off-white-muted pointer-events-none"
            >
              Category
            </label>
          </div>
          <Button type="submit" variant="primary" size="md" disabled={loading}>
            {loading ? "Publishing..." : "Publish Project"}
          </Button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease }}
      >
        <h2 className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim mb-4">
          Current Projects ({projects.length})
        </h2>
        <DataTable<ProjectData>
          columns={columns}
          data={projects}
          onDelete={(p) => setConfirmDelete(p.id)}
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
                Confirm Deletion
              </p>
              <p className="text-sm text-off-white mb-6 leading-relaxed">
                Are you sure you want to delete this project? This action cannot be undone.
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
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
