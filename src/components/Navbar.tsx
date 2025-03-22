
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogIn } from "lucide-react";
import Button from "./Button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
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

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Matches", href: "/matches" },
    { name: "Profile", href: "/profile" }
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
          <span className="text-primary mr-1">Team</span>
          <span>Finder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary hover:bg-secondary/50"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Profile
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" className="flex items-center">
              <LogIn className="h-4 w-4 mr-1" />
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
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
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary hover:bg-secondary/50"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link to="/login" className="block px-3 py-2 mt-4">
            <Button size="sm" className="w-full flex items-center justify-center">
              <LogIn className="h-4 w-4 mr-1" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
