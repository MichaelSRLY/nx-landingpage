'use client';

interface GeometricDecorationProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GeometricDecoration({
  position = 'top-right',
  size = 'md',
  className = ''
}: GeometricDecorationProps) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full text-accent opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Escher-inspired geometric shapes */}
        <g transform="translate(100, 100)">
          <path
            d="M 0,-60 L 52,-30 L 52,30 L 0,60 L -52,30 L -52,-30 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <path
            d="M 0,-40 L 35,-20 L 35,20 L 0,40 L -35,20 L -35,-20 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M 0,-20 L 17,-10 L 17,10 L 0,20 L -17,10 L -17,-10 Z"
            fill="currentColor"
            opacity="0.1"
          />
        </g>
      </svg>
    </div>
  );
}
