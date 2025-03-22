
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', size = 'md', isLoading = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
    
    const variants = {
      default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/40",
      primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/40",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/40",
      ghost: "hover:bg-secondary hover:text-secondary-foreground focus:ring-secondary",
      outline: "border border-input bg-transparent hover:bg-secondary hover:text-secondary-foreground focus:ring-secondary",
      link: "text-primary underline-offset-4 hover:underline focus:ring-primary/40",
    };
    
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "opacity-80 cursor-wait",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
