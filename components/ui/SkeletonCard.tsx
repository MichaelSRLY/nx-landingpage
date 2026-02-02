interface SkeletonCardProps {
  delay?: number;
  className?: string;
}

export default function SkeletonCard({ delay = 0, className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`absolute w-64 h-80 rounded-lg backdrop-blur-sm animate-float ${className}`}
      style={{
        backgroundColor: 'hsl(40 25% 95% / 0.6)',
        border: '1px solid hsl(35 15% 85% / 0.4)',
        animationDelay: `${delay}s`,
      }}
    >
      <div className="p-6 space-y-4">
        <div
          className="w-12 h-12 rounded-lg"
          style={{ backgroundColor: 'hsl(35 65% 55% / 0.2)' }}
        />
        <div className="space-y-2">
          <div
            className="h-4 rounded"
            style={{ backgroundColor: 'hsl(35 15% 85%)', width: '75%' }}
          />
          <div
            className="h-4 rounded"
            style={{ backgroundColor: 'hsl(35 15% 85%)', width: '50%' }}
          />
        </div>
      </div>
    </div>
  );
}
