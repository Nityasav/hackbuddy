import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Users, UserPlus, UserCheck, UserX, Mail, RefreshCw, User, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types for our connections
type Connection = {
  id: string;
  created_at: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  profile?: {
    name: string;
    avatar_url: string;
    skills: string[];
    email: string;
  };
};

// Mock connections data for development purposes
const mockConnections: Connection[] = [
  {
    id: "conn1",
    created_at: new Date().toISOString(),
    requester_id: "user1",
    recipient_id: "user2",
    status: "pending",
    profile: {
      name: "Jordan Smith",
      avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      skills: ["UI Design", "Figma", "Prototyping"],
      email: "jordan@example.com"
    }
  },
  {
    id: "conn2",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    requester_id: "user3",
    recipient_id: "user1",
    status: "accepted",
    profile: {
      name: "Taylor Wong",
      avatar_url: "https://randomuser.me/api/portraits/women/62.jpg",
      skills: ["Python", "Machine Learning", "Data Visualization"],
      email: "taylor@example.com"
    }
  },
  {
    id: "conn3",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    requester_id: "user4",
    recipient_id: "user1",
    status: "pending",
    profile: {
      name: "Alex Johnson",
      avatar_url: "https://randomuser.me/api/portraits/men/44.jpg",
      skills: ["React", "TypeScript", "Next.js", "UI/UX"],
      email: "alex.j@example.com"
    }
  },
  {
    id: "conn4",
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    requester_id: "user1",
    recipient_id: "user5",
    status: "rejected",
    profile: {
      name: "Samantha Lee",
      avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
      skills: ["Product Management", "Scrum", "Market Research"],
      email: "samantha.lee@example.com"
    }
  },
  {
    id: "conn5",
    created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    requester_id: "user6",
    recipient_id: "user1",
    status: "accepted",
    profile: {
      name: "David Chen",
      avatar_url: "https://randomuser.me/api/portraits/men/78.jpg",
      skills: ["Node.js", "Express", "MongoDB", "AWS"],
      email: "david.chen@example.com"
    }
  },
  {
    id: "conn6",
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    requester_id: "user7",
    recipient_id: "user1",
    status: "rejected",
    profile: {
      name: "Emily Rodriguez",
      avatar_url: "https://randomuser.me/api/portraits/women/17.jpg",
      skills: ["C++", "Game Development", "Unity", "3D Modeling"],
      email: "emily.r@example.com"
    }
  },
  {
    id: "conn7",
    created_at: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    requester_id: "user1",
    recipient_id: "user8",
    status: "accepted",
    profile: {
      name: "Michael Thompson",
      avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
      skills: ["Flutter", "Dart", "Mobile Development", "Firebase"],
      email: "michael.t@example.com"
    }
  },
  {
    id: "conn8",
    created_at: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    requester_id: "user9",
    recipient_id: "user1",
    status: "pending",
    profile: {
      name: "Olivia Wilson",
      avatar_url: "https://randomuser.me/api/portraits/women/28.jpg",
      skills: ["Data Science", "R", "Statistics", "Tableau"],
      email: "olivia.w@example.com"
    }
  },
  {
    id: "conn9",
    created_at: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
    requester_id: "user10",
    recipient_id: "user1",
    status: "pending",
    profile: {
      name: "James Kim",
      avatar_url: "https://randomuser.me/api/portraits/men/55.jpg",
      skills: ["Blockchain", "Solidity", "Smart Contracts", "Web3"],
      email: "james.kim@example.com"
    }
  },
  {
    id: "conn10",
    created_at: new Date(Date.now() - 777600000).toISOString(), // 9 days ago
    requester_id: "user1",
    recipient_id: "user11",
    status: "accepted",
    profile: {
      name: "Sophia Garcia",
      avatar_url: "https://randomuser.me/api/portraits/women/90.jpg",
      skills: ["DevOps", "Kubernetes", "Docker", "CI/CD"],
      email: "sophia.g@example.com"
    }
  }
];

const Connections = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [usesMockData, setUsesMockData] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch connections from Supabase
  const fetchConnections = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    console.log("Starting to fetch connections for user:", user.id);
    
    try {
      // Check if tables exist by making a small query
      const { error: tableCheckError } = await supabase
        .from('connections')
        .select('id')
        .limit(1);
      
      // If there's an error, tables might not be set up
      if (tableCheckError) {
        console.log("Error checking tables, using mock data:", tableCheckError);
        setConnections(mockConnections);
        setUsesMockData(true);
        return;
      }
      
      // First get all connections for the user
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select('*')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);
      
      console.log("Connections query result:", { connectionsData, connectionsError });
      
      if (connectionsError) {
        console.log("Error fetching connections, using mock data");
        setConnections(mockConnections);
        setUsesMockData(true);
        return;
      }
      
      if (!connectionsData || connectionsData.length === 0) {
        console.log("No connections found");
        setConnections([]);
        return;
      }
      
      // Extract all user IDs we need to get profiles for
      const userIds = connectionsData.map(conn => 
        conn.requester_id === user.id ? conn.recipient_id : conn.requester_id
      );
      
      console.log("User IDs to fetch profiles for:", userIds);
      
      // Fetch all relevant profiles in a single query
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);
      
      console.log("Profiles query result:", { profilesData, profilesError });
      
      if (profilesError) {
        console.log("Error fetching profiles, using mock data");
        setConnections(mockConnections);
        setUsesMockData(true);
        return;
      }
      
      // Map connections with profile data
      const processedConnections = connectionsData.map(conn => {
        const otherUserId = conn.requester_id === user.id ? conn.recipient_id : conn.requester_id;
        // Try finding by either user_id or id
        const profileData = profilesData?.find(p => 
          p.user_id === otherUserId || p.id === otherUserId
        ) || null;
        
        console.log(`Processing connection ${conn.id} with other user ${otherUserId}`, { profileData });
        
        const connection: Connection = {
          ...conn,
          profile: profileData ? {
            name: profileData.name || "Unknown User",
            avatar_url: profileData.avatar_url || "",
            skills: profileData.skills || [],
            email: profileData.contact_email || ""
          } : {
            name: "Unknown User",
            avatar_url: "",
            skills: [],
            email: ""
          }
        };
        
        return connection;
      });
      
      console.log("Processed connections:", processedConnections);
      setConnections(processedConnections);
      setUsesMockData(false);
    } catch (error) {
      console.error("Error fetching connections:", error);
      setConnections(mockConnections);
      setUsesMockData(true);
      toast({
        title: "Failed to load connections",
        description: "Using mock data for development",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchConnections();
    }
  }, [user?.id]);

  // Filter connections based on active tab
  const filteredConnections = connections.filter(conn => {
    if (activeTab === 'all') return true;
    return conn.status === activeTab;
  });

  // Handle accepting a connection
  const handleAcceptConnection = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);
      
      if (error) throw error;
      
      // Update local state
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, status: 'accepted' } 
            : conn
        )
      );
      
      toast({
        title: "Connection accepted",
        description: "You can now message this user",
      });
    } catch (error) {
      console.error("Error accepting connection:", error);
      toast({
        title: "Failed to accept connection",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Handle rejecting a connection
  const handleRejectConnection = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', connectionId);
      
      if (error) throw error;
      
      // Update local state
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, status: 'rejected' } 
            : conn
        )
      );
      
      toast({
        title: "Connection rejected",
      });
    } catch (error) {
      console.error("Error rejecting connection:", error);
      toast({
        title: "Failed to reject connection",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Navigate to profile page
  const handleViewProfile = (connectionId: string, userId: string) => {
    // Find the connection by ID
    const connection = connections.find(conn => conn.id === connectionId);
    
    if (!connection) return;
    
    // For mock data, map each connection to a unique profile URL
    if (usesMockData) {
      // Get the profile name to determine the correct URL
      const name = connection.profile?.name || "";
      
      // Map specific names to specific profile URLs
      if (name.includes("Jordan")) {
        navigate("/user/jordan");
      } else if (name.includes("Taylor")) {
        navigate("/user/taylor");
      } else if (name.includes("Alex")) {
        navigate("/user/alex");
      } else if (name.includes("Emily")) {
        navigate("/user/emily");
      } else if (name.includes("Michael")) {
        navigate("/user/michael");
      } else if (name.includes("Olivia")) {
        navigate("/user/olivia");
      } else if (name.includes("James")) {
        navigate("/user/james");
      } else if (name.includes("Sophia")) {
        navigate("/user/sophia");
      } else if (name.includes("Casey")) {
        navigate("/user/casey");
      } else if (name.includes("Robin")) {
        navigate("/user/robin");
      } else if (name.includes("Samantha")) {
        navigate("/user/samantha");
      } else if (name.includes("David")) {
        navigate("/user/david");
      } else {
        // Extract user number from the userId as fallback
        const userNumber = userId.replace("user", "");
        navigate(`/user/user${userNumber}`);
      }
    } else {
      // For actual Supabase data, use the actual ID
      navigate(`/user/${userId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-primary neon-text">My</span> <span className="text-white neon-text-blue">Connections</span>
              </h1>
              <p className="text-white/70">
                View and manage your hackathon team connections
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                onClick={fetchConnections} 
                className="flex items-center neon-box hover-lift"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Connection Stats */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up">
              <div className="glass-card p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Total</p>
                  <p className="text-2xl font-semibold">{connections.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              <div className="glass-card p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-400/60">Pending</p>
                  <p className="text-2xl font-semibold text-yellow-400">
                    {connections.filter(conn => conn.status === 'pending').length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-yellow-400" />
                </div>
              </div>
              
              <div className="glass-card p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-400/60">Accepted</p>
                  <p className="text-2xl font-semibold text-green-400">
                    {connections.filter(conn => conn.status === 'accepted').length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-400" />
                </div>
              </div>
              
              <div className="glass-card p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-400/60">Rejected</p>
                  <p className="text-2xl font-semibold text-red-400">
                    {connections.filter(conn => conn.status === 'rejected').length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <UserX className="h-5 w-5 text-red-400" />
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-6 flex-wrap">
            <button
              className={cn(
                "py-2 px-4 font-medium text-sm transition-colors relative",
                activeTab === 'all' 
                  ? "text-primary" 
                  : "text-white/60 hover:text-white"
              )}
              onClick={() => setActiveTab('all')}
            >
              <Users className="inline-block h-4 w-4 mr-1" />
              All Connections
              {activeTab === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            
            <button
              className={cn(
                "py-2 px-4 font-medium text-sm transition-colors relative",
                activeTab === 'pending' 
                  ? "text-primary" 
                  : "text-white/60 hover:text-white"
              )}
              onClick={() => setActiveTab('pending')}
            >
              <UserPlus className="inline-block h-4 w-4 mr-1" />
              Pending
              {activeTab === 'pending' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            
            <button
              className={cn(
                "py-2 px-4 font-medium text-sm transition-colors relative",
                activeTab === 'accepted' 
                  ? "text-primary" 
                  : "text-white/60 hover:text-white"
              )}
              onClick={() => setActiveTab('accepted')}
            >
              <UserCheck className="inline-block h-4 w-4 mr-1" />
              Accepted
              {activeTab === 'accepted' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            
            <button
              className={cn(
                "py-2 px-4 font-medium text-sm transition-colors relative",
                activeTab === 'rejected' 
                  ? "text-primary" 
                  : "text-white/60 hover:text-white"
              )}
              onClick={() => setActiveTab('rejected')}
            >
              <UserX className="inline-block h-4 w-4 mr-1" />
              Rejected
              {activeTab === 'rejected' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          {loading ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="animate-spin h-10 w-10 mx-auto mb-4">
                <RefreshCw className="text-primary" />
              </div>
              <p className="text-white/70">Loading your connections...</p>
            </div>
          ) : filteredConnections.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <Users className="h-16 w-16 mx-auto text-white/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">No connections found</h3>
              <p className="text-white/70 mb-6">
                {activeTab === 'all' 
                  ? "You haven't connected with any hackathon teams yet."
                  : activeTab === 'pending'
                    ? "You don't have any pending connection requests."
                    : activeTab === 'accepted'
                      ? "You don't have any accepted connections yet."
                      : "You don't have any rejected connections."}
              </p>
              <p className="text-white/70">
                Use the AI Agent to find suitable teammates for your next hackathon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map((connection) => (
                <div 
                  key={connection.id} 
                  className={cn(
                    "glass-card rounded-xl p-6 hover-lift transition-all duration-300 cursor-pointer relative group",
                    connection.status === 'accepted' ? "border border-green-500/30" : 
                    connection.status === 'pending' ? "border border-yellow-500/30" : 
                    "border border-red-500/30"
                  )}
                  onClick={() => handleViewProfile(connection.id, connection.requester_id === user?.id ? connection.recipient_id : connection.requester_id)}
                >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center overflow-hidden mr-4">
                      {connection.profile?.avatar_url ? (
                        <img 
                          src={connection.profile.avatar_url} 
                          alt={connection.profile.name}
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-white">{connection.profile?.name}</h3>
                      <a 
                        href={`mailto:${connection.profile?.email}`} 
                        className="text-sm text-white/60 hover:text-primary flex items-center"
                        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking email
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        {connection.profile?.email}
                      </a>
                    </div>
                  </div>
                  
                  {/* Skills */}
                  {connection.profile?.skills && connection.profile.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs uppercase tracking-wider text-white/40 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {connection.profile.skills.slice(0, 3).map((skill, i) => (
                          <span 
                            key={i} 
                            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                        {connection.profile.skills.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/60">
                            +{connection.profile.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span 
                          className={cn(
                            "h-2 w-2 rounded-full mr-2",
                            connection.status === 'accepted' ? "bg-green-500" : 
                            connection.status === 'rejected' ? "bg-red-500" : 
                            "bg-yellow-500"
                          )}
                        />
                        <span className={cn(
                          "text-sm capitalize",
                          connection.status === 'accepted' ? "text-green-400" : 
                          connection.status === 'rejected' ? "text-red-400" : 
                          "text-yellow-400"
                        )}>
                          {connection.status}
                        </span>
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {new Date(connection.created_at).toLocaleDateString()} · {connection.requester_id === user?.id ? 'Outgoing' : 'Incoming'}
                      </div>
                    </div>
                    
                    {connection.status === 'pending' && connection.recipient_id === user?.id && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click when clicking button
                            handleAcceptConnection(connection.id);
                          }}
                          className="text-white hover:text-green-500"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click when clicking button
                            handleRejectConnection(connection.id);
                          }}
                          className="text-white hover:text-red-500"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Connections; 