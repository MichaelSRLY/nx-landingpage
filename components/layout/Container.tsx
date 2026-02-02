import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'wide' | 'narrow';
}

export function Container({ children, className = '', size = 'default' }: ContainerProps) {
  const sizeClasses = {
    default: 'max-w-7xl',
    wide: 'max-w-[1536px]',
    narrow: 'max-w-4xl',
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
