
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import { UserProfile } from "@/components/ProfileCard";
import TeamMatch from "@/components/TeamMatch";
import ProfileCard from "@/components/ProfileCard";
import { ArrowRight, Loader2, RefreshCw, Sparkles, User, UserCheck } from "lucide-react";
import Button from "@/components/Button";
import { Link } from "react-router-dom";

// Mock teammates data
const mockTeammates: UserProfile[] = [
  {
    id: "user2",
    name: "Jordan Smith",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "UX/UI Designer",
    bio: "Passionate designer with a focus on creating intuitive and beautiful user interfaces. I love collaborating with developers to bring designs to life.",
    skills: [
      { id: "s1", name: "UI Design", level: "expert", category: "design" },
      { id: "s2", name: "Figma", level: "advanced", category: "design" },
      { id: "s3", name: "Prototyping", level: "advanced", category: "design" },
      { id: "s4", name: "HTML/CSS", level: "intermediate", category: "frontend" }
    ],
    email: "jordan@example.com",
    lookingFor: ["Frontend Developer", "Project Manager"],
    matchPercentage: 95
  },
  {
    id: "user3",
    name: "Taylor Wong",
    avatar: "https://randomuser.me/api/portraits/women/62.jpg",
    role: "Data Scientist",
    bio: "Data scientist with expertise in machine learning and AI. I enjoy working on projects that can make a positive impact through data-driven solutions.",
    skills: [
      { id: "s1", name: "Python", level: "expert", category: "data" },
      { id: "s2", name: "Machine Learning", level: "advanced", category: "data" },
      { id: "s3", name: "Data Visualization", level: "advanced", category: "data" },
      { id: "s4", name: "SQL", level: "intermediate", category: "backend" }
    ],
    email: "taylor@example.com",
    lookingFor: ["Frontend Developer", "Backend Developer"],
    matchPercentage: 87
  }
];

// Mock team matches
const mockTeamMatches = [
  {
    matchId: "match1",
    matchTitle: "Web3 Project Team",
    matchDescription: "A well-balanced team with frontend, backend, and blockchain expertise",
    matchPercentage: 92,
    teammates: mockTeammates
  },
  {
    matchId: "match2",
    matchTitle: "AI Innovation Team",
    matchDescription: "A team focused on machine learning applications and user experience",
    matchPercentage: 85,
    teammates: mockTeammates.slice(0, 1)
  }
];

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const [teamMatches, setTeamMatches] = useState(mockTeamMatches);
  const [pendingConnections, setPendingConnections] = useState<UserProfile[]>([mockTeammates[0]]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefreshMatches = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh matches
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg">Loading your dashboard...</p>
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
            <h2 className="text-2xl font-bold mb-4">Sign in to access your dashboard</h2>
            <p className="text-foreground/70 mb-6">
              You need to sign in or create an account to view your dashboard and find team matches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg">Sign In</Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="lg">Create Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          {/* Welcome section */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            <p className="text-foreground/70 text-lg">
              Your profile has been viewed 24 times in the last week
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Team matches */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Your Team Matches</h2>
                    <p className="text-foreground/70">Based on your skills and preferences</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshMatches}
                    isLoading={isRefreshing}
                  >
                    {!isRefreshing && <RefreshCw className="h-4 w-4 mr-1" />}
                    Refresh
                  </Button>
                </div>
                
                {teamMatches.length > 0 ? (
                  <div className="space-y-6">
                    {teamMatches.map((match) => (
                      <TeamMatch
                        key={match.matchId}
                        matchId={match.matchId}
                        matchTitle={match.matchTitle}
                        matchDescription={match.matchDescription}
                        matchPercentage={match.matchPercentage}
                        teammates={match.teammates}
                      />
                    ))}
                    
                    <div className="text-center pt-4">
                      <Link to="/matches">
                        <Button variant="outline">
                          View All Matches <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card rounded-xl p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
                    <p className="text-foreground/70 mb-6">
                      We're still looking for the perfect teammates for you. Check back soon or update your profile to improve your matches.
                    </p>
                    <Link to="/profile">
                      <Button>Update Profile</Button>
                    </Link>
                  </div>
                )}
              </section>
              
              {/* Pending Connections */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Pending Connections</h2>
                    <p className="text-foreground/70">People waiting for your response</p>
                  </div>
                </div>
                
                {pendingConnections.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {pendingConnections.map((profile) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        onConnect={(id) => console.log(`Connect with: ${id}`)}
                        onMessage={(id) => console.log(`Message: ${id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="glass-card rounded-xl p-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                      <UserCheck className="h-6 w-6 text-secondary-foreground/70" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No pending connections</h3>
                    <p className="text-foreground/70 text-sm">
                      You're all caught up! No connection requests are waiting for your response.
                    </p>
                  </div>
                )}
              </section>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Profile summary */}
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="p-6 pb-4">
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mr-4 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-8 w-8 text-secondary-foreground/60" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-foreground/70">{user.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4">
                    {user.bio.length > 120 ? `${user.bio.substring(0, 120)}...` : user.bio}
                  </p>
                </div>
                
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-medium text-foreground/70 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.slice(0, 4).map((skill) => (
                      <div 
                        key={skill.id}
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {skill.name}
                      </div>
                    ))}
                    {user.skills.length > 4 && (
                      <div className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                        +{user.skills.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex divide-x border-t">
                  <Link to="/profile" className="flex-1 p-3 text-center text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                    Edit Profile
                  </Link>
                  <Link to="/matches" className="flex-1 p-3 text-center text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                    View Matches
                  </Link>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                      <div 
                        className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: activity.iconBg }}
                      >
                        <activity.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-foreground/60">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Tips */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
                <ul className="space-y-3">
                  {quickTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const recentActivity = [
  {
    icon: User,
    iconBg: "#4f46e5",
    text: "Jordan Smith viewed your profile",
    time: "2 hours ago"
  },
  {
    icon: UserCheck,
    iconBg: "#10b981",
    text: "You matched with Web3 Project Team",
    time: "1 day ago"
  },
  {
    icon: Sparkles,
    iconBg: "#f59e0b",
    text: "New team match found based on your skills",
    time: "2 days ago"
  }
];

const quickTips = [
  "Add at least 5 skills to improve your match quality",
  "Be specific about what you're looking for in potential teammates",
  "Keep your profile updated with your latest projects and skills",
  "Respond to connection requests promptly to increase your chances of finding a team"
];

export default Dashboard;
