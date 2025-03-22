
import { cn } from "@/lib/utils";
import { UserProfile } from "./ProfileCard";
import ProfileCard from "./ProfileCard";
import { Info, Users } from "lucide-react";
import { useState } from "react";

interface TeamMatchProps {
  matchId: string;
  teammates: UserProfile[];
  matchTitle: string;
  matchDescription: string;
  matchPercentage: number;
  className?: string;
}

const TeamMatch = ({ 
  matchId, 
  teammates, 
  matchTitle, 
  matchDescription, 
  matchPercentage, 
  className 
}: TeamMatchProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={cn(
      "glass-card rounded-2xl overflow-hidden transition-all duration-300",
      expanded ? "ring-2 ring-primary/40" : "hover-lift",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{matchTitle}</h3>
            </div>
            <p className="text-sm text-foreground/70">{matchDescription}</p>
          </div>
          
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-semibold text-lg">
              {matchPercentage}%
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center px-3 py-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Info className="h-4 w-4 mr-1" />
          {expanded ? "Show less" : "Show details"}
        </button>
      </div>
      
      {/* Teammates */}
      <div className={cn(
        "grid gap-4 transition-all duration-300",
        expanded ? "grid-cols-1 md:grid-cols-2 p-6" : "max-h-0 overflow-hidden p-0"
      )}>
        {teammates.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onConnect={(id) => console.log(`Connect with: ${id}`)}
            onMessage={(id) => console.log(`Message: ${id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamMatch;
