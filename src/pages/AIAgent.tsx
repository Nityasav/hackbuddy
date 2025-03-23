import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import { Phone, PhoneCall, Headphones, MessageSquare, User, MailCheck, X } from "lucide-react";
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
              <span className="text-white neon-text-blue">AI</span> <span className="text-primary neon-text">Agent</span>
            </h1>
            <p className="text-white/90 text-lg">
              Connect with our AI agent to help find your perfect hackathon team match
            </p>
          </div>

          {/* AI Agent Card */}
          <div className="glass-card rounded-xl p-6 mb-10 animate-fade-up animate-delay-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-40 h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-primary/30 flex items-center justify-center bg-secondary/30 animate-pulse">
                <img 
                  src="./logo.png" 
                  alt="AI Agent" 
                  className="h-32 w-32 object-contain neon-glow hover-lift" 
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-white neon-text-blue">Meet Your Match Agent</h2>
                <p className="text-foreground/70 mb-4">
                  Our AI-powered agent will interview you to understand your skills, preferences, and project goals.
                  Based on this information, we'll connect you with the perfect teammates for your next hackathon.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full animate-fade-right animate-delay-200">Skills Assessment</span>
                  <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full animate-fade-right animate-delay-300">Project Matching</span>
                  <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full animate-fade-right animate-delay-400">Team Formation</span>
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
                    className="flex items-center gap-2 neon-box-blue text-white hover-lift"
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
            <h2 className="text-2xl font-bold mb-6 text-white neon-text-blue">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl hover-lift">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">1. Voice Interview</h3>
                <p className="text-foreground/70">Our AI agent uses Vapi API to conduct a voice-based interview about your skills, experience, and hackathon goals.</p>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover-lift">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">2. Profile Creation</h3>
                <p className="text-foreground/70">Based on your interview, we create a comprehensive profile that highlights your strengths and team preferences.</p>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover-lift">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MailCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">3. Team Matching</h3>
                <p className="text-foreground/70">Our algorithm matches you with potential teammates who complement your skills and share similar project interests.</p>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="glass-card rounded-xl p-6 mb-10 animate-fade-up">
            <h2 className="text-2xl font-bold mb-4 text-white neon-text-blue">Our Technology</h2>
            <div className="text-white/90 mb-6">
              <p className="mb-4">
                HackBuddy leverages powerful technology to create the perfect hackathon team matching experience:
              </p>
              
              <ul className="space-y-3 ml-6 list-disc">
                <li><strong className="text-primary">Vapi API Integration</strong> - Voice-based AI interaction that conducts natural conversations to learn about your skills and preferences</li>
                <li><strong className="text-primary">Secure Database</strong> - Safely stores participant profiles and manages connection requests</li>
                <li><strong className="text-primary">Matching Algorithm</strong> - Identifies complementary skill sets and shared interests to form balanced teams</li>
                <li><strong className="text-primary">B2B & B2C Features</strong> - Solutions for both hackathon organizers and individual participants</li>
              </ul>
            </div>
          </div>

          {/* Agent Prompt Modal */}
          {showPrompt && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="glass-card p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-primary">AI Agent Interview Prompt</h3>
                  <button 
                    onClick={() => setShowPrompt(false)}
                    className="rounded-full p-2 hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-foreground/90">
                    Our AI agent will ask you a series of questions focused on the following areas:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="glass-card p-3 rounded-lg border border-white/10">
                      <h4 className="font-medium mb-1">Technical Skills Assessment</h4>
                      <p className="text-sm text-foreground/70">
                        • Proficiency levels in programming languages, frameworks, and tools
                        <br />
                        • Areas of technical specialization and experience
                        <br />
                        • Technical background and education
                      </p>
                    </div>
                    
                    <div className="glass-card p-3 rounded-lg border border-white/10">
                      <h4 className="font-medium mb-1">Project Experience</h4>
                      <p className="text-sm text-foreground/70">
                        • Previous hackathon or project experience
                        <br />
                        • Examples of challenges you've overcome
                        <br />
                        • Your role in team projects
                      </p>
                    </div>
                    
                    <div className="glass-card p-3 rounded-lg border border-white/10">
                      <h4 className="font-medium mb-1">Team Preferences</h4>
                      <p className="text-sm text-foreground/70">
                        • Working style and communication preferences
                        <br />
                        • Skills you're looking for in teammates
                        <br />
                        • Project domains you're most interested in
                      </p>
                    </div>
                    
                    <div className="glass-card p-3 rounded-lg border border-white/10">
                      <h4 className="font-medium mb-1">Availability & Commitment</h4>
                      <p className="text-sm text-foreground/70">
                        • Time availability for hackathon preparation and participation
                        <br />
                        • Preferred hackathon formats (in-person, virtual, hybrid)
                        <br />
                        • Commitment level for upcoming events
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-foreground/90 mt-4">
                    Based on your responses, our matching algorithm will create a detailed profile
                    that helps us connect you with compatible teammates who complement your skills
                    and share your interests.
                  </p>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link to="/schedule-call">
                    <Button 
                      size="sm"
                      className="flex items-center gap-2 mr-3"
                    >
                      Schedule a Call
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPrompt(false)}
                  >
                    Close
                  </Button>
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
