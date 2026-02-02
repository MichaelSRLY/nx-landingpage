interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-lg p-6 md:p-8 shadow-paper ${
        hover ? "transition-all duration-300 hover:shadow-elevated hover:-translate-y-1" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
