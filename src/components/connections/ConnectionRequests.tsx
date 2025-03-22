
import { useState } from "react";
import { Check, X, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ConnectionRequests = () => {
  const { pendingConnections, acceptConnection, rejectConnection, getUserById } = useUser();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  
  if (pendingConnections.length === 0) {
    return null;
  }
  
  const handleAccept = async (userId: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [userId]: true }));
      await acceptConnection(userId);
      toast.success("Connection accepted");
    } catch (error) {
      console.error("Error accepting connection:", error);
      toast.error("Failed to accept connection");
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleReject = async (userId: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [userId]: true }));
      await rejectConnection(userId);
      toast.success("Connection rejected");
    } catch (error) {
      console.error("Error rejecting connection:", error);
      toast.error("Failed to reject connection");
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleViewProfile = (userId: string) => {
    navigate(`/user/${userId}`);
  };
  
  return (
    <div className="glass-blue rounded-xl p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 neon-text-blue">Connection Requests</h3>
      
      <div className="space-y-3">
        {pendingConnections.map((connection) => {
          const user = getUserById(connection.userId);
          if (!user) return null;
          
          return (
            <div 
              key={connection.userId}
              className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-[hsl(var(--blue-accent))]/10"
            >
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handleViewProfile(connection.userId)}
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-secondary mr-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User className="h-5 w-5 text-foreground/60" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-sm text-foreground/70">{user.role}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(connection.userId)}
                  disabled={isLoading[connection.userId]}
                  className={cn(
                    "p-2 rounded-full bg-[hsl(var(--blue-accent))]/10 text-[hsl(var(--blue-accent))] hover:bg-[hsl(var(--blue-accent))]/20 transition-colors",
                    isLoading[connection.userId] && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleReject(connection.userId)}
                  disabled={isLoading[connection.userId]}
                  className={cn(
                    "p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors",
                    isLoading[connection.userId] && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionRequests;
