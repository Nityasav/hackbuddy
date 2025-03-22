
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import { UserProfile } from "@/components/ProfileCard";
import ProfileCard from "@/components/ProfileCard";
import SkillCard, { Skill } from "@/components/SkillCard";
import Button from "@/components/Button";
import { Check, Filter, Loader2, Search, UserCheck, X } from "lucide-react";
import { toast } from "sonner";

// Mock potential matches data
const mockPotentialMatches: UserProfile[] = [
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
    github: "https://github.com/jordansmith",
    linkedin: "https://linkedin.com/in/jordansmith",
    website: "https://jordansmith.design",
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
    github: "https://github.com/taylorwong",
    linkedin: "https://linkedin.com/in/taylorwong",
    website: null,
    lookingFor: ["Frontend Developer", "Backend Developer"],
    matchPercentage: 87
  },
  {
    id: "user4",
    name: "Casey Martinez",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    role: "Backend Developer",
    bio: "Backend developer specializing in Node.js and database design. I love building scalable and efficient systems that power amazing applications.",
    skills: [
      { id: "s1", name: "Node.js", level: "expert", category: "backend" },
      { id: "s2", name: "MongoDB", level: "advanced", category: "backend" },
      { id: "s3", name: "Express", level: "advanced", category: "backend" },
      { id: "s4", name: "GraphQL", level: "intermediate", category: "backend" }
    ],
    email: "casey@example.com",
    github: "https://github.com/caseymartinez",
    linkedin: "https://linkedin.com/in/caseymartinez",
    website: "https://caseymartinez.io",
    lookingFor: ["Frontend Developer", "UI Designer", "Project Manager"],
    matchPercentage: 82
  },
  {
    id: "user5",
    name: "Robin Chen",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    role: "Mobile Developer",
    bio: "Mobile developer with experience in React Native and Flutter. I'm passionate about creating seamless mobile experiences that users love.",
    skills: [
      { id: "s1", name: "React Native", level: "expert", category: "mobile" },
      { id: "s2", name: "Flutter", level: "intermediate", category: "mobile" },
      { id: "s3", name: "JavaScript", level: "advanced", category: "frontend" },
      { id: "s4", name: "Firebase", level: "intermediate", category: "backend" }
    ],
    email: "robin@example.com",
    github: "https://github.com/robinchen",
    linkedin: "https://linkedin.com/in/robinchen",
    website: null,
    lookingFor: ["UI Designer", "Backend Developer"],
    matchPercentage: 78
  },
  {
    id: "user6",
    name: "Avery Williams",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    role: "Project Manager",
    bio: "Experienced project manager with a background in agile methodologies. I enjoy helping teams collaborate effectively to deliver successful projects.",
    skills: [
      { id: "s1", name: "Agile", level: "expert", category: "other" },
      { id: "s2", name: "Scrum", level: "advanced", category: "other" },
      { id: "s3", name: "JIRA", level: "advanced", category: "other" },
      { id: "s4", name: "Product Management", level: "intermediate", category: "other" }
    ],
    email: "avery@example.com",
    github: "https://github.com/averywilliams",
    linkedin: "https://linkedin.com/in/averywilliams",
    website: "https://averywilliams.com",
    lookingFor: ["Frontend Developer", "Backend Developer", "UI Designer"],
    matchPercentage: 73
  }
];

const skillCategories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
  { value: "data", label: "Data Science" },
  { value: "mobile", label: "Mobile" },
  { value: "other", label: "Other" }
];

const Matches = () => {
  const { user, isLoading, sendConnectionRequest, sendMessage } = useUser();
  const [matches, setMatches] = useState(mockPotentialMatches);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API search delay
    setTimeout(() => {
      const filtered = mockPotentialMatches.filter(match => {
        // Filter by search term
        const matchesSearch = searchTerm === "" || 
          match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Filter by skills
        const matchesSkills = filterSkills.length === 0 || 
          match.skills.some(skill => 
            filterSkills.includes(skill.category)
          );
        
        return matchesSearch && matchesSkills;
      });
      
      setMatches(filtered);
      setIsSearching(false);
    }, 800);
  };
  
  const toggleSkillFilter = (category: string) => {
    setFilterSkills(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setFilterSkills([]);
    setMatches(mockPotentialMatches);
  };
  
  const handleConnect = async (id: string) => {
    try {
      await sendConnectionRequest(id);
      toast.success("Connection request sent");
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };
  
  const handleMessage = async (id: string) => {
    try {
      if (user) {
        const match = matches.find(m => m.id === id);
        if (match) {
          await sendMessage(id, `Hi ${match.name}, I'd like to connect with you!`);
          toast.success("Message sent");
        }
      }
    } catch (error) {
      console.error("Error messaging:", error);
    }
  };
  
  const handleProfileClick = (id: string) => {
    navigate(`/user/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg">Loading matches...</p>
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
            <h2 className="text-2xl font-bold mb-4 neon-text">Sign in to view matches</h2>
            <p className="text-foreground/70 mb-6">
              You need to sign in or create an account to view potential teammates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Create Profile</Button>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-3 neon-text">Find Your Team</h1>
            <p className="text-foreground/70">
              Browse potential teammates based on your skills and preferences
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="glass-card rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-foreground/50" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    placeholder="Search by name, role, or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                  
                  <Button 
                    onClick={handleSearch}
                    isLoading={isSearching}
                  >
                    {!isSearching && <Search className="h-4 w-4 mr-1" />}
                    Search
                  </Button>
                </div>
              </div>
              
              {/* Filters */}
              {showFilters && (
                <div className="pt-4 border-t border-border animate-slide-in">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Filter by skill category:</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillCategories.map((category) => (
                        <button
                          key={category.value}
                          onClick={() => toggleSkillFilter(category.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            filterSkills.includes(category.value)
                              ? "bg-primary text-white"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {filterSkills.includes(category.value) && (
                            <Check className="h-3 w-3 mr-1 inline" />
                          )}
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {(filterSkills.length > 0 || searchTerm) && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-sm"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Results */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold neon-text">
                {isSearching ? "Searching..." : `${matches.length} Potential Teammates`}
              </h2>
            </div>
            
            {matches.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onConnect={handleConnect}
                    onMessage={handleMessage}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-secondary-foreground/70" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                <p className="text-foreground/70 mb-6">
                  We couldn't find any matches with your current filters. Try adjusting your search criteria.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Matches;
