export default function EscherPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="escherGrid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="50" height="50" fill="hsl(35, 20%, 88%)" opacity="0.3" />
          <rect x="50" y="50" width="50" height="50" fill="hsl(35, 20%, 88%)" opacity="0.3" />
          <path
            d="M 25 0 Q 50 25 25 50 Q 0 25 25 0"
            fill="hsl(38, 30%, 75%)"
            opacity="0.2"
          />
          <path
            d="M 75 50 Q 100 75 75 100 Q 50 75 75 50"
            fill="hsl(38, 30%, 75%)"
            opacity="0.2"
          />
          <circle cx="25" cy="25" r="8" fill="hsl(35, 40%, 70%)" opacity="0.25" />
          <circle cx="75" cy="75" r="8" fill="hsl(35, 40%, 70%)" opacity="0.25" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#escherGrid)" />
    </svg>
  );
}
