import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase, createScheduledCall } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarCheck, Clock, Phone, Sparkles, User, Mail, Calendar, ArrowRight, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

// Form schema
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters."
  }).max(50),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  phone: z.string().min(7, {
    message: "Phone number must be at least 7 digits."
  }).max(15, {
    message: "Phone number is too long."
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleCall = () => {
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.name || "",
      email: user?.email || "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      // Store the scheduling data in Supabase using the helper function
      const { error } = await createScheduledCall(
        user?.id || 'anonymous',
        data.username,
        data.email,
        data.phone
      );

      if (error) {
        throw error;
      }

      toast.success("Your call has been scheduled!");
      
      // Redirect to dashboard or confirmation page
      navigate("/");
    } catch (error) {
      console.error("Error scheduling call:", error);
      toast.error("Failed to schedule call. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse-subtle"></div>
          <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse-subtle animation-delay-500"></div>
          
          {/* Animated particles */}
          {[...Array(5)].map((_, i) => (
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
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="animate-fade-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
                <span className="mr-3 neon-text">Schedule a Call</span>
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </h1>
              
              <p className="text-lg mb-8 text-foreground/80">
                Schedule a call with our AI agent to discuss your skills, experience, and project goals.
                We'll help match you with the perfect teammates for your next hackathon.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4 hover-lift-micro glass-card p-4 rounded-xl transition-all duration-300">
                  <div className="rounded-full bg-primary/10 p-3 mt-0.5">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">15 Minute Call</h3>
                    <p className="text-foreground/70">
                      The call will be brief but comprehensive, focusing on your skills and preferences.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 hover-lift-micro glass-card p-4 rounded-xl transition-all duration-300">
                  <div className="rounded-full bg-primary/10 p-3 mt-0.5">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Phone Interview</h3>
                    <p className="text-foreground/70">
                      We'll call you at the provided phone number to conduct the interview.
                    </p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowPrompt(true)}
                className="w-full mt-4 py-3 rounded-xl bg-secondary/40 hover:bg-secondary/60 relative overflow-hidden group transition-all duration-300 hover-lift-micro animate-fade-up border border-white/10"
              >
                <span className="relative z-10 flex items-center justify-center font-medium">
                  View Agent Prompt
                </span>
              </button>
            </div>
            
            <div className="glass-card p-8 rounded-2xl relative overflow-hidden animate-fade-right shadow-lg">
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full transform translate-x-20 -translate-y-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full transform -translate-x-20 translate-y-20 blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse-subtle">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold mt-4 neon-text">Book Your Call</h2>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="animate-fade-up" style={{ animationDelay: '100ms' }}>
                          <FormLabel className="flex items-center">
                            <User className="h-4 w-4 text-primary mr-2" /> Username
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <User className="h-4 w-4 text-primary/70" />
                              </div>
                              <Input 
                                placeholder="Your username" 
                                {...field} 
                                className="pl-10 bg-black/30 border-white/20 focus:border-primary transition-all hover:bg-black/40" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="animate-fade-up" style={{ animationDelay: '200ms' }}>
                          <FormLabel className="flex items-center">
                            <Mail className="h-4 w-4 text-primary mr-2" /> Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="h-4 w-4 text-primary/70" />
                              </div>
                              <Input 
                                placeholder="your.email@example.com" 
                                type="email" 
                                {...field} 
                                className="pl-10 bg-black/30 border-white/20 focus:border-primary transition-all hover:bg-black/40" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="animate-fade-up" style={{ animationDelay: '300ms' }}>
                          <FormLabel className="flex items-center">
                            <Phone className="h-4 w-4 text-primary mr-2" /> Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Phone className="h-4 w-4 text-primary/70" />
                              </div>
                              <Input 
                                placeholder="(555) 123-4567" 
                                type="tel" 
                                {...field} 
                                className="pl-10 bg-black/30 border-white/20 focus:border-primary transition-all hover:bg-black/40" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className={cn(
                        "w-full py-3 rounded-full bg-primary relative overflow-hidden group transition-all duration-300 hover-lift-micro animate-fade-up",
                        loading ? "opacity-80" : ""
                      )}
                      style={{ animationDelay: '400ms' }}
                    >
                      <span className="relative z-10 flex items-center justify-center font-medium">
                        {loading ? "Scheduling..." : "Schedule Call"}
                        {!loading && <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                    
                    <p className="text-center text-sm text-foreground/60 animate-fade-up" style={{ animationDelay: '500ms' }}>
                      By scheduling a call, you agree to our terms and privacy policy.
                    </p>
                  </form>
                </Form>
              </div>
            </div>
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
              
              <button 
                onClick={() => setShowPrompt(false)}
                className="w-full mt-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScheduleCall; 