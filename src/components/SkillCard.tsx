
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type Skill = {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: "frontend" | "backend" | "design" | "data" | "mobile" | "other";
};

const levelColors = {
  beginner: "bg-blue-100 text-blue-800 border-blue-200",
  intermediate: "bg-green-100 text-green-800 border-green-200",
  advanced: "bg-purple-100 text-purple-800 border-purple-200",
  expert: "bg-orange-100 text-orange-800 border-orange-200",
};

const categoryIcons = {
  frontend: "🖥️",
  backend: "⚙️",
  design: "🎨",
  data: "📊",
  mobile: "📱",
  other: "🛠️",
};

interface SkillCardProps {
  skill: Skill;
  className?: string;
  onRemove?: (id: string) => void;
  removable?: boolean;
}

const SkillCard = ({ skill, className, onRemove, removable = false }: SkillCardProps) => {
  return (
    <div 
      className={cn(
        "group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all hover-scale",
        levelColors[skill.level],
        className
      )}
    >
      <span className="mr-1">{categoryIcons[skill.category]}</span>
      {skill.name}
      
      {removable && onRemove && (
        <button 
          onClick={() => onRemove(skill.id)}
          className="ml-1 text-foreground/40 hover:text-foreground/70 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SkillCard;
