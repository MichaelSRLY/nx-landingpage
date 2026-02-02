'use client';

interface EscherPatternProps {
  variant?: 'tessellation' | 'isometric' | 'penrose';
  className?: string;
}

export function EscherPattern({ variant = 'tessellation', className = '' }: EscherPatternProps) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {variant === 'tessellation' && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="tessellation"
              x="0"
              y="0"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 120 30 L 120 90 L 60 120 L 0 90 L 0 30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tessellation)" />
        </svg>
      )}

      {variant === 'isometric' && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="isometric"
              x="0"
              y="0"
              width="80"
              height="140"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 80 23 L 80 70 L 40 93 L 0 70 L 0 23 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M 40 47 L 80 70 L 80 117 L 40 140 L 0 117 L 0 70 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#isometric)" />
        </svg>
      )}

      {variant === 'penrose' && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="penrose"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              {/* Penrose triangle inspired pattern */}
              <path
                d="M 100 50 L 150 130 L 50 130 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="miter"
              />
              <path
                d="M 100 50 L 85 75 L 100 100 L 115 75 Z"
                fill="currentColor"
                opacity="0.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#penrose)" />
        </svg>
      )}
    </div>
  );
}
