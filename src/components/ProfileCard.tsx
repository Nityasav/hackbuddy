
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SkillCard, { Skill } from "./SkillCard";
import Button from "./Button";
import { Mail, MessageCircle, Plus, User, Check, X, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useMessaging } from "@/context/MessagingContext";

export type UserProfile = {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  bio: string;
  skills: Skill[];
  email: string;
  github?: string;
  linkedin?: string;
  website?: string | null;
  lookingFor: string[];
  matchPercentage?: number;
};

interface ProfileCardProps {
  profile: UserProfile;
  className?: string;
  variant?: "compact" | "full";
  onConnect?: (id: string) => void;
  onMessage?: (id: string) => void;
}

const ProfileCard = ({ 
  profile, 
  className, 
  variant = "compact", 
  onConnect, 
  onMessage 
}: ProfileCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const { user, sendConnectionRequest, sendMessage, connections, pendingConnections } = useUser();
  const { openChat } = useMessaging();
  const navigate = useNavigate();
  
  // Check connection status
  const isPending = pendingConnections.some(conn => conn.userId === profile.id);
  const isConnected = connections.some(conn => conn.userId === profile.id);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (isConnected || isPending) return;
    
    try {
      setIsConnecting(true);
      await sendConnectionRequest(profile.id);
      if (onConnect) {
        onConnect(profile.id);
      }
    } catch (error) {
      console.error("Error connecting:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Open the chat popup
    openChat(profile);
    
    if (onMessage) {
      onMessage(profile.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/user/${profile.id}`);
  };

  return (
    <div 
      className={cn(
        "glass-card rounded-2xl overflow-hidden transition-all hover-lift cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Avatar and Match Percentage */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="flex items-center">
            <div className={cn(
              "relative h-16 w-16 rounded-xl overflow-hidden border-2 border-[hsl(var(--blue-accent))]/40 shadow-sm mr-4",
              !imageLoaded && "image-loading"
            )}>
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className={cn(
                    "h-full w-full object-cover transition-opacity",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={handleImageLoad}
                />
              ) : (
                <div className="h-full w-full bg-secondary flex items-center justify-center">
                  <User className="h-8 w-8 text-secondary-foreground/60" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-foreground/70">{profile.role}</p>
            </div>
          </div>
          
          {profile.matchPercentage && (
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[hsl(var(--blue-accent))]/10 border border-[hsl(var(--blue-accent))]/20">
              <span className="text-[hsl(var(--blue-accent))] font-semibold neon-text-blue">
                {profile.matchPercentage}%
              </span>
            </div>
          )}
        </div>
        
        {/* Skills */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-foreground/70 mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, variant === "compact" ? 4 : undefined).map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
              />
            ))}
            {variant === "compact" && profile.skills.length > 4 && (
              <div className="flex items-center justify-center px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                <Plus className="h-3.5 w-3.5 mr-1" />
                {profile.skills.length - 4} more
              </div>
            )}
          </div>
        </div>
        
        {/* Bio - Only in full variant */}
        {variant === "full" && (
          <div className="px-6 pb-4">
            <h4 className="text-sm font-medium text-foreground/70 mb-2">About</h4>
            <p className="text-sm">{profile.bio}</p>
          </div>
        )}
        
        {/* Looking For - Only in full variant */}
        {variant === "full" && profile.lookingFor.length > 0 && (
          <div className="px-6 pb-6">
            <h4 className="text-sm font-medium text-foreground/70 mb-2">Looking for</h4>
            <div className="flex flex-wrap gap-2">
              {profile.lookingFor.map((item, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="p-4 bg-secondary/50 flex items-center justify-between">
          {user?.id !== profile.id && (
            <>
              {isConnected ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 mr-2 text-[hsl(var(--blue-accent))]"
                  disabled
                >
                  <Check className="h-4 w-4 mr-1" /> Connected
                </Button>
              ) : isPending ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 mr-2 text-[hsl(var(--blue-accent))]"
                  disabled
                >
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Pending
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  onClick={handleConnect}
                  className="flex-1 mr-2 bg-[hsl(var(--blue-accent))]"
                  isLoading={isConnecting}
                >
                  {!isConnecting && <Plus className="h-4 w-4 mr-1" />} Connect
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMessage}
                className="flex-1 border-[hsl(var(--blue-accent))]/20 hover:bg-[hsl(var(--blue-accent))]/10"
                isLoading={isMessaging}
              >
                {!isMessaging && <MessageCircle className="h-4 w-4 mr-1" />} Message
              </Button>
            </>
          )}
          
          {variant === "full" && (
            <a 
              href={`mailto:${profile.email}`}
              className="ml-2 p-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
