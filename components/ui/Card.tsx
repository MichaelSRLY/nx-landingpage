interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`rounded-lg p-6 md:p-8 ${
        hover ? "transition-all duration-300 hover:shadow-elevated hover:-translate-y-1" : ""
      } ${className}`}
      style={{
        backgroundColor: 'hsl(40 25% 95%)',
        border: '1px solid hsl(35 15% 85%)',
        boxShadow: '0 2px 8px hsl(30 10% 10% / 0.1)',
      }}
    >
      {children}
    </div>
  );
}
