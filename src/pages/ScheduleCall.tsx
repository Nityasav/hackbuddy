import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, User, Mail, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

// Form schema
const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleCall = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.name || "",
      email: user?.email || "",
      notes: "",
    },
  });

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setValue("date", selectedDate);
    }
  };

  // Time slots
  const timeSlots = [
    "09:00 AM - 09:30 AM",
    "10:00 AM - 10:30 AM",
    "11:00 AM - 11:30 AM",
    "12:00 PM - 12:30 PM",
    "01:00 PM - 01:30 PM",
    "02:00 PM - 02:30 PM",
    "03:00 PM - 03:30 PM",
    "04:00 PM - 04:30 PM",
    "05:00 PM - 05:30 PM",
  ];

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
            scheduled_date: format(data.date, 'yyyy-MM-dd'),
            scheduled_time: data.timeSlot,
            notes: data.notes,
            username: data.username,
            email: data.email
          }
        });

      if (error) {
        throw error;
      }

      toast.success("Call scheduled successfully", {
        description: `Your call is scheduled for ${format(data.date, 'MMMM dd, yyyy')} at ${data.timeSlot}`,
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
              <span className="text-primary neon-text">Schedule</span> a <span className="text-[hsl(var(--blue-accent))] neon-text-blue">Call</span>
            </h1>
            <p className="text-[hsl(var(--blue-accent))]/90 text-lg">
              Book a session with our AI agent to find your perfect hackathon team
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 animate-fade-up animate-delay-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <CalendarClock className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[hsl(var(--blue-accent))] neon-text-blue">AI Agent Call Booking</h2>
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

              {/* Date and Time Selection */}
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground/90 mb-1 block">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal neon-box-blue",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarClock className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="timeSlot" className="text-foreground/90 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Time Slot
                  </Label>
                  <Select onValueChange={(value) => setValue("timeSlot", value)}>
                    <SelectTrigger id="timeSlot" className="w-full mt-1 bg-background/50">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.timeSlot && (
                    <p className="text-red-500 text-sm mt-1">{errors.timeSlot.message}</p>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes" className="text-foreground/90">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  className="mt-1 h-24 bg-background/50 focus:ring-primary"
                  placeholder="Any specific topics you'd like to discuss or questions you have..."
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-medium tracking-wide animate-pulse hover:animate-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Call"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleCall; 