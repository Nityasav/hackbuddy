import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

// Form schema
const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleCall = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Store the scheduling data in Supabase
      const { error } = await supabase
        .from('agent_calls')
        .insert({
          user_id: user?.id || 'anonymous',
          call_duration: 0, // Will be updated after the call
          call_summary: 'Scheduled',
          updated_profile_data: {
            username: data.username,
            email: data.email
          }
        });

      if (error) {
        throw error;
      }

      toast.success("Call scheduled successfully", {
        description: "Our AI agent will contact you soon to conduct the interview.",
      });
      
      // Redirect to dashboard or confirmation page
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error scheduling call:", error);
      toast.error("Failed to schedule call", {
        description: "Please try again later or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto max-w-3xl">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="text-primary neon-text">Schedule</span> a <span className="text-white neon-text-blue">Call</span>
            </h1>
            <p className="text-white/90 text-lg">
              Book a session with our AI agent to find your perfect hackathon team
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 animate-fade-up animate-delay-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <img 
                  src="./logo.png" 
                  alt="AI Agent" 
                  className="h-10 w-10 object-contain neon-glow" 
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white neon-text-blue">AI Agent Call Booking</h2>
                <p className="text-foreground/70">Set up your interview with our team matching AI</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* User Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-foreground/90 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Username
                  </Label>
                  <Input
                    id="username"
                    {...register("username")}
                    className="mt-1 bg-background/50 focus:ring-primary"
                    placeholder="Your username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-foreground/90 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="mt-1 bg-background/50 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-medium tracking-wide animate-pulse hover:animate-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Call"}
              </Button>

              <p className="text-center text-sm text-white/60 mt-4">
                By scheduling a call, you agree to be contacted by our AI agent for a brief interview to gather information about your skills and preferences.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleCall; 