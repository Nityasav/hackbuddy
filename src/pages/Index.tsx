import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { Sparkles, Zap, Code, Users, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* How it works section */}
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-float"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-float animation-delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/5 blur-3xl opacity-20 animate-pulse-subtle"></div>
          </div>
          
          <div className="container px-4 mx-auto relative">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center">
                How <span className="text-primary neon-text mx-2">HackBuddy</span> Works
                <Code className="h-6 w-6 ml-2 text-primary animate-spin-slow" />
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Our platform makes it easy to find the perfect teammates for your next hackathon project
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="text-center glass-card p-8 rounded-xl relative overflow-hidden hover-lift transition-all duration-500 animate-fade-up"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="relative w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      {index + 1}
                      <div className="absolute -z-10 w-16 h-16 rounded-full border border-primary/30 animate-pulse-subtle"></div>
                      <div className="absolute -z-10 w-20 h-20 rounded-full border border-primary/20 animate-pulse-subtle animation-delay-500"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                    <p className="text-foreground/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-30 animate-float"></div>
            <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-3xl opacity-30 animate-float animation-delay-500"></div>
          </div>
        
          <div className="container px-4 mx-auto text-center relative z-10">
            <div className="glass-card rounded-3xl p-10 md:p-16 max-w-4xl mx-auto animate-fade-up hover-lift-small">
              <Sparkles className="h-8 w-8 text-yellow-400 mx-auto mb-6 animate-float" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6 neon-text-blue">Ready to find your dream hackathon team?</h2>
              <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
                Join HackBuddy today and connect with talented individuals who complement your skills and share your passion for innovation.
              </p>
              <button 
                onClick={() => navigate("/profile")}
                className="inline-flex items-center justify-center h-12 px-8 font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-glow relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 border-t border-white/10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="text-xl font-bold tracking-tight flex items-center justify-center md:justify-start">
                  <img src="/logo.png" alt="Logo" className="h-6 w-6 mr-2" />
                  <span className="text-primary neon-text mr-1">Hack</span>
                  <span className="text-white neon-text-blue">Buddy</span>
                </div>
                <p className="text-sm text-foreground/60 mt-1">
                  Connect with the perfect teammates for your next hackathon
                </p>
              </div>
              
              <div className="text-sm text-foreground/60">
                &copy; {new Date().getFullYear()} HackBuddy. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

const steps = [
  {
    title: "Create Your Profile",
    description: "Sign up and build your profile with your skills, experience, and project interests"
  },
  {
    title: "Get Matched",
    description: "Our AI algorithm will match you with compatible teammates based on complementary skills"
  },
  {
    title: "Form Your Dream Team",
    description: "Connect with your matches, discuss your ideas, and form the perfect hackathon team"
  }
];

export default Index;
