interface SkeletonCardProps {
  delay?: number;
  className?: string;
}

export default function SkeletonCard({ delay = 0, className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`absolute w-64 h-80 bg-surface/60 border border-border/40 rounded-lg backdrop-blur-sm animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="p-6 space-y-4">
        <div className="w-12 h-12 bg-accent-warm/20 rounded-lg" />
        <div className="space-y-2">
          <div className="h-4 bg-border rounded w-3/4" />
          <div className="h-4 bg-border rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
