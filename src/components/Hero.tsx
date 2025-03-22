import { ArrowRight, Code, Users, Zap, Sparkles, MousePointer, MessageSquare, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { cn } from "@/lib/utils";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section 
      className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradients with parallax effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-60 animate-pulse-subtle transition-all duration-1000"
          style={{ 
            transform: isHovered 
              ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px)` 
              : 'none'
          }}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-accent/20 rounded-full blur-3xl opacity-60 animate-pulse-subtle animation-delay-500 transition-all duration-1000"
          style={{ 
            transform: isHovered 
              ? `translate(${-(mousePosition.x - window.innerWidth / 2) * 0.01}px, ${-(mousePosition.y - window.innerHeight / 2) * 0.01}px)` 
              : 'none'
          }}
        ></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s infinite alternate ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container px-4 mx-auto relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-5 animate-fade-in">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors hover:scale-105 transform cursor-pointer animate-pulse-subtle">
              <Sparkles className="h-3.5 w-3.5 mr-2 text-yellow-400 animate-pulse" />
              Find your perfect hackathon team
              <Sparkles className="h-3.5 w-3.5 ml-2 text-yellow-400 animate-pulse animation-delay-500" />
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-in">
            Connect with the <span className="text-primary relative group">
              perfect teammates
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-bottom-left duration-500"></span>
            </span> for your next hackathon
          </h1>
          
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-up animation-delay-200">
            Our AI-powered platform connects you with the right people based on skills, experience, and goals. Build the ideal team for hackathon success!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-300">
            <Link to="/profile" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Create Your Profile 
                  <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto group border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              onClick={() => setShowPrompt(true)}
            >
              <span className="flex items-center">
                View Agent Prompt
                <MessageSquare className="ml-2 h-4 w-4 transform transition-all group-hover:translate-y-1" />
              </span>
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              feature={feature} 
              className={cn(
                "animate-scale-in", 
                index === 0 ? "animate-delay-200" : 
                index === 1 ? "animate-delay-300" : 
                "animate-delay-400"
              )}
            />
          ))}
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
    </section>
  );
};

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  accentColor?: string;
}

interface FeatureCardProps {
  feature: Feature;
  className?: string;
}

const FeatureCard = ({ feature, className }: FeatureCardProps) => {
  const { icon: Icon, title, description, accentColor } = feature;
  
  return (
    <div className={cn(
      "glass-card p-6 rounded-2xl hover-lift relative overflow-hidden transition-all duration-500 group",
      className
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        accentColor
      )}></div>
      <div className="relative z-10">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-foreground/70">{description}</p>
      </div>
    </div>
  );
};

const features: Feature[] = [
  {
    icon: Users,
    title: "Skill-Based Matching",
    description: "Our algorithm matches participants based on complementary skill sets to create balanced teams.",
    accentColor: "from-blue-500/10"
  },
  {
    icon: Zap,
    title: "AI-Powered Profiling",
    description: "AI agent conducts interviews to gather detailed information about your skills and preferences.",
    accentColor: "from-purple-500/10"
  },
  {
    icon: Code,
    title: "Project Compatibility",
    description: "Find teammates whose interests and experience align with your project vision and hackathon goals.",
    accentColor: "from-green-500/10"
  }
];

export default Hero;
