import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'secondary' | 'tertiary';
}

export function Section({
  children,
  className = '',
  id,
  background = 'default'
}: SectionProps) {
  const bgClasses = {
    default: 'bg-background',
    secondary: 'bg-background-secondary',
    tertiary: 'bg-background-tertiary',
  };

  return (
    <section
      id={id}
      className={`py-16 sm:py-20 lg:py-24 ${bgClasses[background]} ${className}`}
    >
      {children}
    </section>
  );
}
