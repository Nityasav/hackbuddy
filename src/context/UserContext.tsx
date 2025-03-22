
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile } from "@/components/ProfileCard";
import { v4 as uuidv4 } from 'uuid';

type UserContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (userData: Partial<UserProfile>) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, this would check for an auth token and fetch the user data
    const checkAuth = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check localStorage for saved user
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // For demo purposes, we'll use our mock user
          const id = uuidv4();
          const demoUser = { ...mockUser, id };
          setUser(demoUser);
          localStorage.setItem("user", JSON.stringify(demoUser));
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
  
  const updateUser = (userData: Partial<UserProfile>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
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
        localStorage.setItem("user", JSON.stringify(loggedInUser));
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
  
  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        updateUser,
        login,
        logout,
        isAuthenticated: !!user
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
