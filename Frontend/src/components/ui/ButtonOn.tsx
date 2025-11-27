import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function ButtonOn({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  fullWidth = false,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-xl hover:-translate-y-0.5 focus:ring-brand-500",
    secondary: "bg-white text-slate-900 hover:bg-slate-50 shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 focus:ring-slate-400",
    outline: "border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500",
    ghost: "text-slate-600 hover:text-brand-700 hover:bg-slate-100/50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}