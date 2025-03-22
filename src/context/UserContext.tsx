
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile } from "@/components/ProfileCard";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

type Connection = {
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
};

type Message = {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  read: boolean;
};

type UserContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (userData: Partial<UserProfile>) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  connections: Connection[];
  pendingConnections: Connection[];
  messages: Message[];
  sendMessage: (toUserId: string, content: string) => Promise<void>;
  sendConnectionRequest: (userId: string) => Promise<void>;
  acceptConnection: (userId: string) => Promise<void>;
  rejectConnection: (userId: string) => Promise<void>;
  getUserById: (userId: string) => UserProfile | null;
  uploadAvatar: (file: File) => Promise<string>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data - in a real app this would come from an API
const mockUser: UserProfile = {
  id: "user1",
  name: "Alex Johnson",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  role: "Full Stack Developer",
  bio: "Software engineer with 3 years of experience in web development. Passionate about creating elegant solutions to complex problems and learning new technologies.",
  email: "alex@example.com",
  github: "https://github.com/alexjohnson",
  linkedin: "https://linkedin.com/in/alexjohnson",
  website: "https://alexjohnson.dev",
  skills: [
    {
      id: "skill1",
      name: "React",
      level: "advanced",
      category: "frontend"
    },
    {
      id: "skill2",
      name: "Node.js",
      level: "intermediate",
      category: "backend"
    },
    {
      id: "skill3",
      name: "UI Design",
      level: "beginner",
      category: "design"
    },
    {
      id: "skill4",
      name: "TypeScript",
      level: "intermediate",
      category: "frontend"
    }
  ],
  lookingFor: ["UI Designer", "Data Scientist", "DevOps Engineer"]
};

// Mock user data for the profiles in Matches
const mockUsers: UserProfile[] = [
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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingConnections, setPendingConnections] = useState<Connection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    // In a real app, this would check for an auth token and fetch the user data
    const checkAuth = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check localStorage for saved user
        const savedUser = localStorage.getItem("user");
        const savedConnections = localStorage.getItem("connections");
        const savedPendingConnections = localStorage.getItem("pendingConnections");
        const savedMessages = localStorage.getItem("messages");
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        
        if (savedConnections) {
          setConnections(JSON.parse(savedConnections));
        }
        
        if (savedPendingConnections) {
          setPendingConnections(JSON.parse(savedPendingConnections));
        }
        
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (err) {
        setError("Failed to authenticate user");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);
  
  useEffect(() => {
    localStorage.setItem("connections", JSON.stringify(connections));
  }, [connections]);
  
  useEffect(() => {
    localStorage.setItem("pendingConnections", JSON.stringify(pendingConnections));
  }, [pendingConnections]);
  
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);
  
  const updateUser = (userData: Partial<UserProfile>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
  };
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      if (email && password) {
        // Just for demo, we'll accept any email/password and use our mock user
        const id = uuidv4();
        const loggedInUser = { ...mockUser, id, email };
        setUser(loggedInUser);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError("Failed to login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  
  const getUserById = (userId: string): UserProfile | null => {
    // First check if it's the current user
    if (user && user.id === userId) {
      return user;
    }
    
    // Then check the mock users
    const foundUser = mockUsers.find(u => u.id === userId);
    return foundUser || null;
  };
  
  const sendConnectionRequest = async (userId: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if connection already exists
      if (connections.some(c => c.userId === userId) || pendingConnections.some(c => c.userId === userId)) {
        throw new Error("Connection already exists");
      }
      
      // Add to pending connections
      const newConnection: Connection = {
        userId,
        status: 'pending',
        date: new Date().toISOString()
      };
      
      setPendingConnections(prev => [...prev, newConnection]);
      toast.success("Connection request sent");
    } catch (err) {
      console.error("Error sending connection request:", err);
      toast.error("Failed to send connection request");
      throw err;
    }
  };
  
  const acceptConnection = async (userId: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the pending connection
      const pendingConnection = pendingConnections.find(c => c.userId === userId);
      
      if (!pendingConnection) {
        throw new Error("Connection request not found");
      }
      
      // Update status to accepted and move to connections
      const acceptedConnection: Connection = {
        ...pendingConnection,
        status: 'accepted'
      };
      
      setConnections(prev => [...prev, acceptedConnection]);
      setPendingConnections(prev => prev.filter(c => c.userId !== userId));
      
      toast.success("Connection accepted");
    } catch (err) {
      console.error("Error accepting connection:", err);
      toast.error("Failed to accept connection");
      throw err;
    }
  };
  
  const rejectConnection = async (userId: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from pending connections
      setPendingConnections(prev => prev.filter(c => c.userId !== userId));
      
      toast.success("Connection rejected");
    } catch (err) {
      console.error("Error rejecting connection:", err);
      toast.error("Failed to reject connection");
      throw err;
    }
  };
  
  const sendMessage = async (toUserId: string, content: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        throw new Error("You must be logged in to send messages");
      }
      
      const newMessage: Message = {
        id: uuidv4(),
        from: user.id,
        to: toUserId,
        content,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      toast.success("Message sent");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
      throw err;
    }
  };
  
  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would upload the file to a server and get a URL back
      // For this demo, we'll use a FileReader to get a local data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            resolve(event.target.result.toString());
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        
        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        
        reader.readAsDataURL(file);
      });
    } catch (err) {
      console.error("Error uploading avatar:", err);
      toast.error("Failed to upload avatar");
      throw err;
    }
  };
  
  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        updateUser,
        login,
        logout,
        isAuthenticated: !!user,
        connections,
        pendingConnections,
        messages,
        sendMessage,
        sendConnectionRequest,
        acceptConnection,
        rejectConnection,
        getUserById,
        uploadAvatar
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
