"use client";

import Link from "next/link";

interface ButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  href,
  variant = "primary",
  children,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 rounded-lg text-body font-medium transition-all duration-200";

  const primaryStyles = {
    backgroundColor: 'hsl(30 15% 15%)',
    color: 'hsl(40 25% 95%)',
  };

  const secondaryStyles = {
    backgroundColor: 'transparent',
    border: '2px solid hsl(30 15% 15%)',
    color: 'hsl(30 15% 15%)',
  };

  return (
    <Link
      href={href}
      className={`${baseStyles} ${className} hover:opacity-90 shadow-md hover:shadow-lg`}
      style={variant === "primary" ? primaryStyles : secondaryStyles}
      onMouseEnter={(e) => {
        if (variant === "secondary") {
          e.currentTarget.style.backgroundColor = 'hsl(30 15% 15%)';
          e.currentTarget.style.color = 'hsl(40 25% 95%)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "secondary") {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'hsl(30 15% 15%)';
        }
      }}
    >
      {children}
    </Link>
  );
}
