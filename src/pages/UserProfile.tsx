import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import { useMessaging } from "@/context/MessagingContext";
import SkillCard from "@/components/SkillCard";
import Button from "@/components/Button";
import { Loader2, User, Github, Linkedin, Globe, Mail, MessageCircle, Plus, ArrowLeft, Check, X } from "lucide-react";
import { toast } from "sonner";
import type { UserProfile as UserProfileType } from "@/components/ProfileCard";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { getUserById, user: currentUser, sendConnectionRequest, connections, pendingConnections } = useUser();
  const { openChat } = useMessaging();
  const [profile, setProfile] = useState(userId ? getUserById(userId) : null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  
  console.log("UserProfile - userId:", userId);
  console.log("UserProfile - current connections:", connections);
  console.log("UserProfile - pendingConnections:", pendingConnections);
  
  // Check connection status
  const isPending = pendingConnections.some(conn => conn.userId === userId);
  const isConnected = connections.some(conn => conn.userId === userId);
  
  // Function to copy email to clipboard
  const copyEmailToClipboard = () => {
    if (profile?.email) {
      navigator.clipboard.writeText(profile.email)
        .then(() => {
          toast.success("Email copied to clipboard");
        })
        .catch((err) => {
          console.error("Could not copy email: ", err);
          toast.error("Failed to copy email");
        });
    }
  };
  
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      console.log("Loading profile for userId:", userId);
      
      try {
        // In a real app, this would fetch user data from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (userId) {
          // Try to get user from context
          const userProfile = getUserById(userId);
          console.log("Found profile:", userProfile);
          
          if (!userProfile) {
            // If not found in context, check if we're using mock data
            // This is a fallback for the connections page mock data
            if (userId.startsWith("user")) {
              console.log("Using mock data for user:", userId);
              
              // Create a mock profile based on userId
              const mockProfile = {
                id: userId,
                name: userId === "user2" ? "Jordan Smith" : "Taylor Wong",
                avatar: userId === "user2" 
                  ? "https://randomuser.me/api/portraits/men/32.jpg" 
                  : "https://randomuser.me/api/portraits/women/62.jpg",
                role: userId === "user2" ? "UX/UI Designer" : "Data Scientist",
                bio: userId === "user2" 
                  ? "Passionate designer with a focus on creating intuitive and beautiful user interfaces."
                  : "Data scientist with expertise in machine learning and AI.",
                email: userId === "user2" ? "jordan@example.com" : "taylor@example.com",
                github: "https://github.com/" + (userId === "user2" ? "jordansmith" : "taylorwong"),
                linkedin: "https://linkedin.com/in/" + (userId === "user2" ? "jordansmith" : "taylorwong"),
                website: userId === "user2" ? "https://jordansmith.design" : null,
                skills: userId === "user2" 
                  ? [
                      { id: "s1", name: "UI Design", level: "expert" as const, category: "design" as const },
                      { id: "s2", name: "Figma", level: "advanced" as const, category: "design" as const },
                      { id: "s3", name: "Prototyping", level: "advanced" as const, category: "design" as const }
                    ]
                  : [
                      { id: "s1", name: "Python", level: "expert" as const, category: "data" as const },
                      { id: "s2", name: "Machine Learning", level: "advanced" as const, category: "data" as const },
                      { id: "s3", name: "Data Visualization", level: "advanced" as const, category: "data" as const }
                    ],
                lookingFor: userId === "user2" 
                  ? ["Frontend Developer", "Project Manager"]
                  : ["Frontend Developer", "Backend Developer"]
              } as UserProfileType;
              
              setProfile(mockProfile);
              setIsLoading(false);
              return;
            }
            
            toast.error("User not found");
            navigate("/connections");
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
  
  const handleMessage = () => {
    if (!userId || !profile || !currentUser) return;
    
    // Open chat popup
    openChat(profile);
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
            <Loader2 className="animate-spin h-12 w-12 text-[hsl(var(--blue-accent))] mx-auto mb-4" />
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
            className="mb-6 flex items-center text-foreground/70 hover:text-[hsl(var(--blue-accent))] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          
          <div className="glass-card rounded-xl overflow-hidden">
            {/* Profile Header */}
            <div className="p-8 md:p-10 border-b border-border">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="h-32 w-32 rounded-xl overflow-hidden border-2 border-[hsl(var(--blue-accent))]/40 shadow-lg">
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
                      <span className="inline-flex items-center justify-center px-3 py-1 text-sm rounded-full bg-[hsl(var(--blue-accent))]/10 border border-[hsl(var(--blue-accent))]/20 text-[hsl(var(--blue-accent))] neon-text-blue">
                        {profile.matchPercentage}% Match
                      </span>
                    )}
                  </div>
                  
                  <p className="text-lg text-foreground/80 mb-4">{profile.role}</p>
                  
                  <p className="mb-6">{profile.bio}</p>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {currentUser?.id !== profile.id && (
                      <>
                        {isConnected ? (
                          <Button variant="outline" disabled className="flex items-center text-[hsl(var(--blue-accent))]">
                            <Check className="h-4 w-4 mr-1" /> Connected
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            onClick={handleMessage}
                            className="flex items-center border-[hsl(var(--blue-accent))]/20 hover:bg-[hsl(var(--blue-accent))]/10"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" /> Message
                          </Button>
                        )}
                      </>
                    )}
                    
                    <Button
                      variant="secondary"
                      onClick={copyEmailToClipboard}
                      className="inline-flex items-center text-secondary-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-1" /> Copy Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="p-8 md:p-10">
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
                
                <div 
                  onClick={copyEmailToClipboard}
                  className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-background/50 border border-border flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-foreground/60 truncate">{profile.email}</p>
                  </div>
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

