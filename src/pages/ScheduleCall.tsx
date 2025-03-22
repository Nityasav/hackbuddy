import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase, createScheduledCall } from "@/lib/supabase";
import { initiateCall } from "@/lib/vapi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarCheck, Clock, Phone, Sparkles, User, Mail, Calendar, ArrowRight, X, CheckCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

// Canadian area codes
const CANADIAN_AREA_CODES = [
  '226', '249', '289', '343', '365', '416', '437', '438', 
  '450', '519', '548', '579', '581', '587', '604', '613', 
  '639', '647', '705', '709', '778', '780', '807', '819', 
  '867', '873', '902', '905', '506', '204'
];

// Email regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Common valid email domains for more realistic validation
const COMMON_EMAIL_DOMAINS = [
  // Popular email services
  'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com',
  'aol.com', 'zoho.com', 'mail.com', 'yandex.com', 'gmx.com', 'tutanota.com',
  
  // Canadian educational institutions
  'utoronto.ca', 'ubc.ca', 'mcgill.ca', 'yorku.ca', 'ualberta.ca', 'uwaterloo.ca',
  'queensu.ca', 'uottawa.ca', 'ryerson.ca', 'sfu.ca', 'concordia.ca', 'uwo.ca',
  'dal.ca', 'ucalgary.ca', 'umontreal.ca', 'hec.ca',
  
  // Canadian corporate domains
  'shopify.com', 'rbc.com', 'td.com', 'bmo.com', 'cibc.com', 'scotiabank.com',
  'telus.com', 'rogers.com', 'bell.ca', 'deloitte.ca', 'kpmg.ca', 'pwc.com',
  'blackberry.com', 'bombardier.com', 'cgi.com', 'manulife.com', 'sunlife.com',
  
  // Canadian government
  'canada.ca', 'gc.ca', 'ontario.ca', 'quebec.ca', 'alberta.ca', 'bc.ca', 
  'manitoba.ca', 'saskatchewan.ca', 'novascotia.ca', 'nb.ca', 'pe.ca', 'gov.yk.ca',
  'ntassembly.ca', 'gov.nu.ca'
];

// Form schema with enhanced validation
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters."
  }).max(50),
  email: z.string()
    .email({ message: "Please enter a valid email address." })
    .refine((email) => EMAIL_REGEX.test(email), {
      message: "Invalid email format. Please use a valid email address."
    }),
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number is too long." })
    .refine((phone) => {
      // Remove all non-digit characters for validation
      const digitsOnly = phone.replace(/\D/g, '');
      
      // Check if it has 10 digits (standard North American number)
      if (digitsOnly.length !== 10) {
        return false;
      }
      
      // Check if it starts with a valid Canadian area code
      const areaCode = digitsOnly.substring(0, 3);
      return CANADIAN_AREA_CODES.includes(areaCode);
    }, {
      message: "Please enter a valid Canadian phone number starting with a valid area code."
    }),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleCall = () => {
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
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
    mode: "onChange"
  });

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format: (XXX) XXX-XXXX
    if (digitsOnly.length >= 10) {
      const areaCode = digitsOnly.substring(0, 3);
      const prefix = digitsOnly.substring(3, 6);
      const lineNumber = digitsOnly.substring(6, 10);
      return `(${areaCode}) ${prefix}-${lineNumber}`;
    } else if (digitsOnly.length >= 6) {
      const areaCode = digitsOnly.substring(0, 3);
      const prefix = digitsOnly.substring(3, 6);
      const lineNumber = digitsOnly.substring(6);
      return `(${areaCode}) ${prefix}-${lineNumber}`;
    } else if (digitsOnly.length >= 3) {
      const areaCode = digitsOnly.substring(0, 3);
      const prefix = digitsOnly.substring(3);
      return `(${areaCode}) ${prefix}`;
    } else {
      return digitsOnly ? `(${digitsOnly}` : '';
    }
  };

  // Validate email through API simulation and realistic checks
  const validateEmail = async (email: string) => {
    // Initial format validation
    if (!EMAIL_REGEX.test(email)) {
      setIsEmailValid(false);
      return false;
    }

    setIsCheckingEmail(true);
    
    try {
      // Extract parts of the email
      const [localPart, domain] = email.split('@');
      
      // Check local part (username) format and constraints
      // Most real email services have restrictions on username length and format
      if (localPart.length < 3 || localPart.length > 64) {
        setIsEmailValid(false);
        return false;
      }
      
      // Check for consecutive special characters which are usually not allowed
      if (/[._%+-]{2,}/.test(localPart)) {
        setIsEmailValid(false);
        return false;
      }
      
      // Cannot start or end with certain special characters
      if (/^[._%+-]|[._%+-]$/.test(localPart)) {
        setIsEmailValid(false);
        return false;
      }
      
      // Domain validation
      const domainParts = domain.split('.');
      const tld = domainParts[domainParts.length - 1]; // Top-level domain
      
      // Check domain constraints
      if (domainParts.length < 2 || tld.length < 2) {
        setIsEmailValid(false);
        return false;
      }
      
      /*
       * PRODUCTION EMAIL VALIDATION IMPLEMENTATION:
       * 
       * In a real production environment, the proper approach would be:
       * 
       * 1. Frontend validation for basic format (already implemented)
       * 
       * 2. Backend validation using specialized libraries or services:
       *    - Create a backend API endpoint that takes an email to validate
       *    - Use libraries like "email-deep-validator" or "email-validator" with DNS checks
       *    - Implement DNS MX record lookup to verify domain can receive email
       *    - Verify SMTP connection to the mail server without sending actual messages
       *    - Check disposable email database to filter temporary emails
       * 
       * 3. Use third-party email validation services (for critical applications):
       *    - Integration with services like Abstract API, Mailgun Email Validation, or Sendgrid
       *    - These services maintain databases of known valid/invalid email patterns
       *    - They perform real-time DNS, MX, SMTP, and mailbox verification
       *    - They can detect disposable/throwaway email services
       * 
       * 4. Actual implementation:
       *    const response = await fetch('/api/validate-email', {
       *      method: 'POST',
       *      headers: { 'Content-Type': 'application/json' },
       *      body: JSON.stringify({ email })
       *    });
       *    const result = await response.json();
       *    return result.isValid;
       */
      
      // Simulate API call for email validation service check
      // This would be replaced with a real API call to a service like Abstract API, EmailVerifier, etc.
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demonstration purposes, only reject obviously fake patterns
      if (/asdf|qwerty|test|fake|example|invalid|123456|abcdef/.test(localPart)) {
        setIsEmailValid(false);
        return false;
      }
      
      // Check for gibberish patterns (long strings of consonants or random characters)
      if (/[bcdfghjklmnpqrstvwxyz]{6,}/.test(localPart)) {
        setIsEmailValid(false);
        return false;
      }
      
      // In this demo, accept all well-formed emails that don't have obviously fake patterns
      // For nitya.ca and other custom domains, this approach will accept them as valid
      setIsEmailValid(true);
      return true;
      
    } catch (error) {
      console.error("Error validating email:", error);
      setIsEmailValid(false);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // When email field changes
  const handleEmailChange = async (email: string) => {
    form.setValue('email', email);
    if (email && EMAIL_REGEX.test(email)) {
      await validateEmail(email);
    } else {
      setIsEmailValid(false);
    }
  };

  // When phone field changes
  const handlePhoneChange = (phone: string) => {
    const formatted = formatPhoneNumber(phone);
    form.setValue('phone', formatted);
    
    // Validate Canadian area code
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length >= 3) {
      const areaCode = digitsOnly.substring(0, 3);
      setIsPhoneValid(CANADIAN_AREA_CODES.includes(areaCode) && digitsOnly.length === 10);
    } else {
      setIsPhoneValid(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Final validation check before submission
    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    if (!isPhoneValid) {
      toast.error("Please enter a valid Canadian phone number.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Initiate the Vapi call directly
      const { success, callId, error: callError } = await initiateCall(data.phone);
      
      if (!success) {
        console.error('Vapi Call Error:', callError);
        throw new Error(callError || 'Failed to initiate call. Please check your Vapi API key and try again.');
      }

      toast.success("Your call has been scheduled! We'll be calling you shortly.");
      
      // Redirect to dashboard or confirmation page
      navigate("/");
    } catch (error) {
      console.error("Error scheduling call:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to schedule call. Please try again.";
      
      toast.error(errorMessage);
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
                                onChange={(e) => handleEmailChange(e.target.value)}
                                className={cn(
                                  "pl-10 bg-black/30 border-white/20 focus:border-primary transition-all hover:bg-black/40",
                                  field.value && (isEmailValid ? "border-green-500" : "border-red-500")
                                )}
                              />
                              {field.value && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  {isCheckingEmail ? (
                                    <div className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                                  ) : isEmailValid ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                          {field.value && !isEmailValid && !isCheckingEmail && (
                            <p className="text-sm text-red-500 mt-1">
                              {!EMAIL_REGEX.test(field.value) ? 
                                "Please enter a valid email format (e.g., name@domain.com)" :
                                field.value.split('@')[0].length < 3 ?
                                "Email username must be at least 3 characters" :
                                field.value.split('@')[0].length > 64 ?
                                "Email username cannot exceed 64 characters" :
                                /[._%+-]{2,}/.test(field.value.split('@')[0]) ?
                                "Email cannot contain consecutive special characters" :
                                /^[._%+-]|[._%+-]$/.test(field.value.split('@')[0]) ?
                                "Email cannot start or end with special characters" :
                                /[bcdfghjklmnpqrstvwxyz]{6,}/.test(field.value.split('@')[0]) ?
                                "This email appears to contain random characters" :
                                /asdf|qwerty|test|fake|example|invalid|123456|abcdef/.test(field.value.split('@')[0]) ?
                                "This email appears to be for testing purposes" :
                                "Please enter a valid email address"
                              }
                            </p>
                          )}
                          <p className="text-xs text-foreground/60 mt-1">
                            Please provide your actual email address for communication purposes.
                          </p>
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
                                placeholder="(XXX) XXX-XXXX" 
                                type="tel"
                                {...field}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                className={cn(
                                  "pl-10 bg-black/30 border-white/20 focus:border-primary transition-all hover:bg-black/40",
                                  field.value && (isPhoneValid ? "border-green-500" : "border-red-500")
                                )}
                              />
                              {field.value && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  {isPhoneValid ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                          {field.value && !isPhoneValid && field.value.replace(/\D/g, '').length >= 3 && (
                            <p className="text-sm text-red-500 mt-1">
                              Please enter a valid Canadian phone number starting with a valid area code.
                            </p>
                          )}
                          <p className="text-xs text-foreground/60 mt-1">
                            Must be a valid Canadian phone number (e.g., (647) 555-1234)
                          </p>
                        </FormItem>
                      )}
                    />
                    
                    <button 
                      type="submit" 
                      disabled={loading || !isEmailValid || !isPhoneValid}
                      className={cn(
                        "w-full py-3 rounded-full relative overflow-hidden group transition-all duration-300 hover-lift-micro animate-fade-up",
                        loading || !isEmailValid || !isPhoneValid ? 
                          "bg-primary/40 cursor-not-allowed" : 
                          "bg-primary hover:bg-primary/90"
                      )}
                      style={{ animationDelay: '400ms' }}
                    >
                      <span className="relative z-10 flex items-center justify-center font-medium">
                        {loading ? "Scheduling..." : "Schedule Call"}
                        {!loading && <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />}
                      </span>
                      {(isEmailValid && isPhoneValid) && (
                        <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      )}
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