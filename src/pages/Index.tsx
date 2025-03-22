
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* How it works section */}
        <section className="py-20 bg-secondary/30">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Team Finder Works</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Our platform makes it easy to find the perfect teammates for your next hackathon project
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-6">
                    {index + 1}
                    <div className="absolute -z-10 w-16 h-16 rounded-full border border-primary/30 animate-pulse-subtle"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-foreground/70">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-20">
          <div className="container px-4 mx-auto text-center">
            <div className="glass-card rounded-3xl p-10 md:p-16 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your dream hackathon team?</h2>
              <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
                Join Team Finder today and connect with talented individuals who complement your skills and share your passion for innovation.
              </p>
              <a href="/profile" className="inline-flex items-center justify-center h-12 px-8 font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors">
                Get Started Now
              </a>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 border-t">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="text-xl font-bold tracking-tight flex items-center justify-center md:justify-start">
                  <span className="text-primary mr-1">Team</span>
                  <span>Finder</span>
                </div>
                <p className="text-sm text-foreground/60 mt-1">
                  Connect with the perfect teammates for your next hackathon
                </p>
              </div>
              
              <div className="text-sm text-foreground/60">
                &copy; {new Date().getFullYear()} Team Finder. All rights reserved.
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
