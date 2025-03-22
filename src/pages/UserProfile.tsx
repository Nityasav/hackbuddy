
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import SkillCard from "@/components/SkillCard";
import Button from "@/components/Button";
import { Loader2, User, Github, Linkedin, Globe, Mail, MessageCircle, Plus, ArrowLeft, Check, X } from "lucide-react";
import { toast } from "sonner";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { getUserById, user: currentUser, sendConnectionRequest, sendMessage, connections, pendingConnections } = useUser();
  const [profile, setProfile] = useState(userId ? getUserById(userId) : null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const navigate = useNavigate();
  
  // Check connection status
  const isPending = pendingConnections.some(conn => conn.userId === userId);
  const isConnected = connections.some(conn => conn.userId === userId);
  
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch user data from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (userId) {
          const userProfile = getUserById(userId);
          
          if (!userProfile) {
            toast.error("User not found");
            navigate("/matches");
            return;
          }
          
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [userId, getUserById, navigate]);
  
  const handleConnect = async () => {
    if (!userId || !profile) return;
    
    try {
      setIsConnecting(true);
      await sendConnectionRequest(userId);
      toast.success(`Connection request sent to ${profile.name}`);
    } catch (error) {
      console.error("Error connecting:", error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleMessage = async () => {
    if (!userId || !profile || !currentUser) return;
    
    try {
      setIsMessaging(true);
      await sendMessage(userId, `Hi ${profile.name}, I'd like to connect with you!`);
      toast.success(`Message sent to ${profile.name}`);
    } catch (error) {
      console.error("Error messaging:", error);
    } finally {
      setIsMessaging(false);
    }
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-bold mb-4">User not found</h2>
            <p className="text-foreground/70 mb-6">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/matches")}>
              Back to Matches
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto max-w-4xl">
          {/* Back Button */}
          <button 
            onClick={handleGoBack}
            className="mb-6 flex items-center text-foreground/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          
          <div className="glass-card rounded-xl overflow-hidden">
            {/* Profile Header */}
            <div className="p-8 md:p-10 border-b border-border">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="h-32 w-32 rounded-xl overflow-hidden border-2 border-primary/40 shadow-lg">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary flex items-center justify-center">
                      <User className="h-16 w-16 text-secondary-foreground/60" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    {profile.matchPercentage && (
                      <span className="inline-flex items-center justify-center px-3 py-1 text-sm rounded-full bg-primary/10 border border-primary/20 text-primary neon-text">
                        {profile.matchPercentage}% Match
                      </span>
                    )}
                  </div>
                  
                  <p className="text-lg text-foreground/80 mb-4">{profile.role}</p>
                  
                  <p className="mb-6">{profile.bio}</p>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {isConnected ? (
                      <Button variant="outline" disabled className="flex items-center">
                        <Check className="h-4 w-4 mr-1" /> Connected
                      </Button>
                    ) : isPending ? (
                      <Button variant="outline" disabled className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Pending
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleConnect}
                        isLoading={isConnecting}
                        className="flex items-center"
                        disabled={currentUser?.id === profile.id}
                      >
                        {!isConnecting && <Plus className="h-4 w-4 mr-1" />} Connect
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={handleMessage}
                      isLoading={isMessaging}
                      className="flex items-center"
                      disabled={currentUser?.id === profile.id}
                    >
                      {!isMessaging && <MessageCircle className="h-4 w-4 mr-1" />} Message
                    </Button>
                    
                    <a 
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md text-sm font-medium transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-10">
              {/* Skills */}
              <div>
                <h2 className="text-xl font-semibold mb-4 neon-text">Skills</h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.skills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                    />
                  ))}
                </div>
              </div>
              
              {/* Looking For */}
              <div>
                <h2 className="text-xl font-semibold mb-4 neon-text">Looking For</h2>
                
                {profile.lookingFor.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {profile.lookingFor.map((item, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 text-sm rounded-full bg-secondary text-secondary-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground/60 mb-6">Not specified</p>
                )}
              </div>
              
              {/* Social Links */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 neon-text">Links</h2>
                
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.github && (
                    <a 
                      href={profile.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-background/50 border border-border flex items-center justify-center">
                        <Github className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-foreground/60 truncate">
                          {profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                        </p>
                      </div>
                    </a>
                  )}
                  
                  {profile.linkedin && (
                    <a 
                      href={profile.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-background/50 border border-border flex items-center justify-center">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-foreground/60 truncate">
                          {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                        </p>
                      </div>
                    </a>
                  )}
                  
                  {profile.website && (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-background/50 border border-border flex items-center justify-center">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium">Website</p>
                        <p className="text-sm text-foreground/60 truncate">
                          {profile.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                      </div>
                    </a>
                  )}
                  
                  <a 
                    href={`mailto:${profile.email}`} 
                    className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-background/50 border border-border flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-foreground/60 truncate">{profile.email}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
