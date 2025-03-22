
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import TeamMatch from "@/components/TeamMatch";
import Button from "@/components/Button";
import { UserProfile } from "@/components/ProfileCard";
import ConnectionRequests from "@/components/connections/ConnectionRequests";
import { useMessaging } from "@/context/MessagingContext";
import { ChevronRight, Loader2, Users, Bot, PhoneCall } from "lucide-react";

const Dashboard = () => {
  const { user, isLoading, getUserById } = useUser();
  const navigate = useNavigate();
  const { openChat } = useMessaging();
  
  // Mock team matches data
  const teamMatches = [
    {
      matchId: "team1",
      matchTitle: "Full-Stack Project Team",
      matchDescription: "A balanced team of frontend, backend, and UI/UX specialists",
      matchPercentage: 92,
      teammateIds: ["user2", "user3", "user4"] // User IDs that would be fetched from an API
    },
    {
      matchId: "team2",
      matchTitle: "Mobile App Development",
      matchDescription: "Mobile developers and designers focused on cross-platform apps",
      matchPercentage: 85,
      teammateIds: ["user5", "user2", "user6"] // User IDs that would be fetched from an API
    }
  ];
  
  // Get actual user objects for teammates
  const getTeammates = (teammateIds: string[]): UserProfile[] => {
    return teammateIds
      .map(id => getUserById(id))
      .filter((user): user is UserProfile => user !== null);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-[hsl(var(--blue-accent))] mx-auto mb-4" />
            <p className="text-lg text-[hsl(var(--blue-accent))]/90">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-bold mb-4 text-[hsl(var(--blue-accent))] neon-text-blue">Sign in to view your dashboard</h2>
            <p className="text-foreground/70 mb-6">
              You need to sign in or create an account to access your personal dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="neon-box-blue text-[hsl(var(--blue-accent))]">Create Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Your <span className="text-[hsl(var(--blue-accent))] neon-text-blue">Dashboard</span>
            </h1>
            <p className="text-foreground/70">
              Welcome back, <span className="text-[hsl(var(--blue-accent))]">{user.name}</span>! Here's an overview of your connections and team matches.
            </p>
          </div>
          
          {/* AI Agent Banner */}
          <div className="glass-card rounded-xl p-5 mb-8 border border-[hsl(var(--blue-accent))]/20">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[hsl(var(--blue-accent))]/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-[hsl(var(--blue-accent))]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[hsl(var(--blue-accent))] neon-text-blue">AI Matching Agent</h3>
                <p className="text-foreground/70 mb-2">Talk to our AI agent to find your perfect hackathon team match.</p>
              </div>
              <Link to="/ai-agent">
                <Button variant="outline" className="flex items-center gap-2 neon-box-blue text-[hsl(var(--blue-accent))]">
                  <PhoneCall className="h-4 w-4" />
                  Connect with Agent
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Connection Requests */}
          <ConnectionRequests />
          
          {/* Team Recommendations */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[hsl(var(--blue-accent))] neon-text-blue">Team Recommendations</h2>
              <Link 
                to="/matches"
                className="text-[hsl(var(--blue-accent))] hover:text-[hsl(var(--blue-accent))]/80 flex items-center text-sm font-medium"
              >
                View all matches <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-6">
              {teamMatches.map((match) => (
                <TeamMatch
                  key={match.matchId}
                  matchId={match.matchId}
                  teammates={getTeammates(match.teammateIds)}
                  matchTitle={match.matchTitle}
                  matchDescription={match.matchDescription}
                  matchPercentage={match.matchPercentage}
                />
              ))}
            </div>
          </div>
          
          {/* Suggestions to complete profile */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gradient-blue">Complete Your Profile</h2>
            <p className="mb-6 text-foreground/70">
              A complete profile increases your chances of finding the perfect team matches.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-secondary/30 rounded-lg p-4 border border-[hsl(var(--blue-accent))]/20">
                <h3 className="text-lg font-medium mb-2 text-[hsl(var(--blue-accent))]">Update Skills</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  Add all your technical and soft skills to help us find better matches.
                </p>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full neon-box-blue text-[hsl(var(--blue-accent))]">
                    Update Skills
                  </Button>
                </Link>
              </div>
              
              <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                <h3 className="text-lg font-medium mb-2 text-primary">Find Teammates</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  Browse potential teammates and connect with those who match your interests.
                </p>
                <Link to="/matches">
                  <Button variant="outline" size="sm" className="w-full neon-box">
                    Find Teammates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
