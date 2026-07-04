export type ProjectCategory = "Design" | "Development" | "Editing" | "Other";

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  category: ProjectCategory;
  createdAt: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "super_user" | "team_member";
  createdAt: string;
}

export type TabFilter = ProjectCategory | "All";

export interface StatData {
  id: string;
  label: string;
  value: string;
  order: number;
}
