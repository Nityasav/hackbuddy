
import { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile } from "@/components/ProfileCard";
import MessagePopup from "@/components/messaging/MessagePopup";

type MessagingContextType = {
  openChat: (user: UserProfile) => void;
  closeChat: (userId: string) => void;
};

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const [activeChats, setActiveChats] = useState<UserProfile[]>([]);
  
  const openChat = (user: UserProfile) => {
    if (!activeChats.some(chat => chat.id === user.id)) {
      // Limit to 3 active chats at a time
      const updatedChats = [...activeChats];
      if (updatedChats.length >= 3) {
        updatedChats.shift(); // Remove oldest chat
      }
      updatedChats.push(user);
      setActiveChats(updatedChats);
    }
  };
  
  const closeChat = (userId: string) => {
    setActiveChats(activeChats.filter(chat => chat.id !== userId));
  };
  
  return (
    <MessagingContext.Provider value={{ openChat, closeChat }}>
      {children}
      
      {/* Render active chat popups */}
      <div className="fixed bottom-0 right-0 z-40 flex flex-row-reverse">
        {activeChats.map((user, index) => (
          <MessagePopup 
            key={user.id} 
            user={user} 
            onClose={() => closeChat(user.id)} 
          />
        ))}
      </div>
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error("useMessaging must be used within a MessagingProvider");
  }
  return context;
};
