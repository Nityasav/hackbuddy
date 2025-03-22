import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import { Phone, PhoneCall, Headphones, MessageSquare, User, MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIAgent = () => {
  const { toast } = useToast();
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="text-[hsl(var(--blue-accent))] neon-text-blue">AI</span> <span className="text-primary neon-text">Agent</span>
            </h1>
            <p className="text-[hsl(var(--blue-accent))]/90 text-lg">
              Connect with our AI agent to help find your perfect hackathon team match
            </p>
          </div>

          {/* AI Agent Card */}
          <div className="glass-card rounded-xl p-6 mb-10 animate-fade-up animate-delay-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-40 h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-primary/30 flex items-center justify-center bg-secondary/30 animate-pulse">
                <img 
                  src="./robot.png" 
                  alt="AI Agent" 
                  className="h-32 w-32 object-contain neon-glow hover-lift" 
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-[hsl(var(--blue-accent))] neon-text-blue">Meet Your Match Agent</h2>
                <p className="text-foreground/70 mb-4">
                  Our AI-powered agent will interview you to understand your skills, preferences, and project goals.
                  Based on this information, we'll connect you with the perfect teammates for your next hackathon.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-[hsl(var(--blue-accent))]/10 text-[hsl(var(--blue-accent))] text-sm px-3 py-1 rounded-full animate-fade-right animate-delay-200">Skills Assessment</span>
                  <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full animate-fade-right animate-delay-300">Project Matching</span>
                  <span className="bg-[hsl(var(--blue-accent))]/10 text-[hsl(var(--blue-accent))] text-sm px-3 py-1 rounded-full animate-fade-right animate-delay-400">Team Formation</span>
                  <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full animate-fade-right animate-delay-500">Hackathon Networking</span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Link to="/schedule-call">
                    <Button 
                      size="lg"
                      className="flex items-center gap-2 hover-scale"
                    >
                      <PhoneCall className="h-5 w-5" />
                      Schedule a Call
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex items-center gap-2 neon-box-blue text-[hsl(var(--blue-accent))] hover-lift"
                    onClick={() => setShowPrompt(!showPrompt)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    View Agent Prompt
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12 animate-fade-up animate-delay-300">
            <h2 className="text-2xl font-bold mb-6 text-[hsl(var(--blue-accent))] neon-text-blue">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl hover-lift">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">1. Interview</h3>
                <p className="text-foreground/70">Our AI agent conducts a brief interview to understand your skills, experience, and hackathon goals.</p>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover-lift">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--blue-accent))]/10 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-[hsl(var(--blue-accent))]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[hsl(var(--blue-accent))]">2. Profile Creation</h3>
                <p className="text-foreground/70">Based on your interview, we create a comprehensive profile that highlights your strengths and team preferences.</p>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover-lift">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MailCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">3. Matching</h3>
                <p className="text-foreground/70">Our algorithm matches you with potential teammates who complement your skills and share similar project interests.</p>
              </div>
            </div>
          </div>

          {/* Agent Prompt Section */}
          {showPrompt && (
            <div className="glass-card rounded-xl p-6 mb-10 border border-[hsl(var(--blue-accent))]/40 animate-fade-up">
              <h2 className="text-2xl font-bold mb-4 text-[hsl(var(--blue-accent))] neon-text-blue">Agent Prompt</h2>
              <div className="bg-black/50 p-6 rounded-lg border border-[hsl(var(--blue-accent))]/20">
                <h3 className="text-xl font-semibold mb-4 text-primary">HackBuddy AI Agent: Hackathon Team Matching System</h3>
                
                <div className="text-[hsl(var(--blue-accent))]/90 leading-relaxed">
                  <p className="mb-4"><strong className="text-[hsl(var(--blue-accent))]">Project Overview:</strong> HackBuddy is an AI-powered matching platform designed to solve one of the most significant challenges in hackathons: finding the ideal team. This innovative solution uses advanced AI to connect participants based on complementary skills, experience levels, and project interests.</p>
                  
                  <p className="mb-4"><strong className="text-[hsl(var(--blue-accent))]">Target Competition:</strong> GenAI Genesis Hackathon in the "Beginner AI" and "Best AI-Powered Tool for Hackathon" categories, focusing on human empowerment through technology.</p>
                  
                  <p className="mb-4"><strong className="text-[hsl(var(--blue-accent))]">Core Problem:</strong> Many hackathon participants struggle to find teammates whose skills complement their own, leading to suboptimal team formation and project outcomes. This issue is especially challenging for first-time hackers.</p>
                  
                  <p className="mb-4"><strong className="text-[hsl(var(--blue-accent))]">Solution:</strong> HackBuddy employs a conversational AI agent that conducts personalized interviews with participants to gather detailed information about their technical skills, previous projects, interests, and team preferences. This data is then used to create optimal team matches.</p>
                  
                  <p className="mb-4"><strong className="text-[hsl(var(--blue-accent))]">Key Features:</strong></p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>AI-powered interview system that learns about participants through natural conversation</li>
                    <li>Skill-based matching algorithm that creates balanced, complementary teams</li>
                    <li>B2B integration for hackathon organizers to streamline participant registration and team formation</li>
                    <li>B2C functionality allowing individuals to find ideal teammates across various hackathon events</li>
                  </ul>
                  
                  <p className="mb-4"><strong className="text-[hsl(var(--blue-accent))]">Technical Implementation:</strong> The platform integrates with the Vapi API for voice-based AI interaction, with a database system that securely stores participant profiles and facilitates optimal matching.</p>
                  
                  <p className="mb-4"><strong className="text-[hsl(var(--blue-accent))]">Market Validation:</strong> Similar models have proven successful in professional networking contexts (e.g., Boardy for LinkedIn), demonstrating the viability and demand for AI-powered connection services.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AIAgent;
