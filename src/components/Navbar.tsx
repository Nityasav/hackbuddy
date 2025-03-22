
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogIn, LogOut } from "lucide-react";
import Button from "./Button";
import { useUser } from "@/context/UserContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUser();
  
  // Detect if page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Matches", href: "/matches" },
    { name: "Profile", href: "/profile" },
    { name: "AI Agent", href: "/ai-agent" }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-2 glass shadow-sm" : "py-4 bg-transparent"
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl font-bold tracking-tight flex items-center"
        >
          <img 
            src="/lovable-uploads/c58de648-bd38-4a4d-9139-f4f2087d30de.png" 
            alt="HackBuddy Logo" 
            className="h-8 w-8 mr-2 neon-glow" 
          />
          <span className="text-primary neon-text">Hack</span>
          <span className="text-[hsl(var(--blue-accent))] neon-text-blue">Buddy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? index % 2 === 0 
                    ? "text-primary neon-text" 
                    : "text-[hsl(var(--blue-accent))] neon-text-blue"
                  : "text-[hsl(var(--blue-accent))]/90 hover:text-[hsl(var(--blue-accent))] hover:bg-secondary/50"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="flex items-center text-[hsl(var(--blue-accent))]">
                  <User className="h-4 w-4 mr-1" />
                  Profile
                </Button>
              </Link>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center neon-box-blue text-[hsl(var(--blue-accent))]"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" variant="outline" className="flex items-center neon-box-blue text-[hsl(var(--blue-accent))]">
                  <User className="h-4 w-4 mr-1" />
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-[hsl(var(--blue-accent))]" />
          ) : (
            <Menu className="h-6 w-6 text-[hsl(var(--blue-accent))]" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 glass-card shadow-lg overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === item.href
                  ? index % 2 === 0 
                    ? "text-primary neon-text" 
                    : "text-[hsl(var(--blue-accent))] neon-text-blue"
                  : "text-[hsl(var(--blue-accent))]/90 hover:text-[hsl(var(--blue-accent))] hover:bg-secondary/50"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <button 
                onClick={handleLogout}
                className="block w-full px-3 py-2 mt-4"
              >
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full flex items-center justify-center neon-box-blue text-[hsl(var(--blue-accent))]"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 mt-4">
                <Button size="sm" className="w-full flex items-center justify-center">
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="block px-3 py-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full flex items-center justify-center neon-box-blue text-[hsl(var(--blue-accent))]"
                >
                  <User className="h-4 w-4 mr-1" />
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
