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

  const variants = {
    primary:
      "bg-text-primary text-surface hover:opacity-90 shadow-md hover:shadow-lg",
    secondary:
      "bg-transparent border-2 border-text-primary text-text-primary hover:bg-text-primary hover:text-surface",
  };

  return (
    <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
