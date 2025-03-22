import { ArrowRight, Code, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-60 animate-pulse-subtle"></div>
        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-accent/20 rounded-full blur-3xl opacity-60 animate-pulse-subtle animation-delay-500"></div>
      </div>

      <div className="container px-4 mx-auto relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-5 animate-fade-in">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Find your perfect hackathon team
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-in">
            Connect with the <span className="text-primary">perfect teammates</span> for your next hackathon
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-200">
            <Link to="/profile">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your Profile <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              feature={feature} 
              className={cn("animate-scale-in", 
                index === 0 ? "animate-delay-200" : 
                index === 1 ? "animate-delay-300" : 
                "animate-delay-400"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
  className?: string;
}

const FeatureCard = ({ feature, className }: FeatureCardProps) => {
  const { icon: Icon, title, description } = feature;
  
  return (
    <div className={cn(
      "glass-card p-6 rounded-2xl hover-lift",
      className
    )}>
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
};

const features: Feature[] = [
  {
    icon: Users,
    title: "Skill-Based Matching",
    description: "Our algorithm matches participants based on complementary skill sets to create balanced teams."
  },
  {
    icon: Zap,
    title: "AI-Powered Profiling",
    description: "AI agent conducts interviews to gather detailed information about your skills and preferences."
  },
  {
    icon: Code,
    title: "Project Compatibility",
    description: "Find teammates whose interests and experience align with your project vision and hackathon goals."
  }
];

export default Hero;
