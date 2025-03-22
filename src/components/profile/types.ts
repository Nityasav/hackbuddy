
import { Skill } from "../SkillCard";

export interface ProfileFormProps {
  onSave: (profileData: ProfileFormData) => void;
  initialData?: ProfileFormData;
  className?: string;
}

export interface ProfileFormData {
  name: string;
  role: string;
  bio: string;
  email: string;
  github?: string;
  linkedin?: string;
  website?: string;
  avatar?: string;
  skills: Skill[];
  lookingFor: string[];
}

export const skillCategories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
  { value: "data", label: "Data Science" },
  { value: "mobile", label: "Mobile" },
  { value: "other", label: "Other" }
];

export const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" }
];

export const defaultSkills: Skill[] = [];
