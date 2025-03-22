
import { useState, useEffect, useRef } from "react";
import { Send, X, User, ChevronDown, ChevronUp } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { UserProfile } from "@/components/ProfileCard";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface MessagePopupProps {
  user: UserProfile;
  onClose: () => void;
}

const MessagePopup = ({ user, onClose }: MessagePopupProps) => {
  const [message, setMessage] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const { sendMessage, messages: allMessages, user: currentUser } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Filter messages for this conversation
  useEffect(() => {
    if (!currentUser) return;
    
    const conversationMessages = allMessages.filter(
      msg => (msg.from === currentUser.id && msg.to === user.id) || 
             (msg.from === user.id && msg.to === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    setMessages(conversationMessages);
  }, [allMessages, currentUser, user.id]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;
    
    try {
      await sendMessage(user.id, message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 z-40 w-80 rounded-lg shadow-lg transition-all duration-300 overflow-hidden",
        "bg-background border border-[hsl(var(--blue-accent))]/30 neon-box-blue",
        minimized ? "h-14" : "h-96"
      )}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer bg-[hsl(var(--blue-accent))]/10"
        onClick={() => setMinimized(!minimized)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary flex items-center justify-center mr-2">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-foreground/60" />
            )}
          </div>
          <span className="font-medium text-sm">{user.name}</span>
        </div>
        <div className="flex items-center">
          {minimized ? (
            <ChevronUp className="h-4 w-4 text-foreground/60" />
          ) : (
            <ChevronDown className="h-4 w-4 text-foreground/60" />
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="ml-2 text-foreground/60 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {!minimized && (
        <>
          {/* Messages */}
          <div className="p-3 h-[calc(100%-8rem)] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-foreground/50">
                <p className="text-sm text-center">No messages yet</p>
                <p className="text-xs text-center mt-1">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "mb-3 max-w-[80%] p-2 rounded-lg text-sm",
                    msg.from === currentUser?.id 
                      ? "ml-auto bg-[hsl(var(--blue-accent))]/20 text-foreground" 
                      : "mr-auto bg-secondary/50 text-foreground"
                  )}
                >
                  <div>{msg.content}</div>
                  <div className="text-xs text-foreground/50 mt-1">
                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form 
            onSubmit={handleSendMessage}
            className="absolute bottom-0 left-0 right-0 border-t border-border p-3 bg-background"
          >
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-secondary/50 text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--blue-accent))]"
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="ml-2 h-8 w-8 rounded-full flex items-center justify-center bg-[hsl(var(--blue-accent))] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessagePopup;
