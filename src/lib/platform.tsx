import { Link, Camera, Play, Film, Code } from "lucide-react";
import type { ReactNode } from "react";

export interface PlatformInfo {
  icon: ReactNode;
  label: string;
  color: string;
}

export function detectPlatform(url: string): PlatformInfo {
  const u = url.toLowerCase();
  if (u.includes("instagram.com") || u.includes("instagr.am")) {
    return { icon: <Camera size={14} />, label: "Instagram", color: "text-pink-400" };
  }
  if (u.includes("youtube.com") || u.includes("youtu.be")) {
    return { icon: <Play size={14} />, label: "YouTube", color: "text-red-400" };
  }
  if (u.includes("vimeo.com")) {
    return { icon: <Film size={14} />, label: "Vimeo", color: "text-blue-400" };
  }
  if (u.includes("github.com")) {
    return { icon: <Code size={14} />, label: "GitHub", color: "text-off-white" };
  }
  return { icon: <Link size={14} />, label: "Link", color: "text-off-white-muted" };
}
