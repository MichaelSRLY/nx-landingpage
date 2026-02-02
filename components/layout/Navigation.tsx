'use client';

import { Container } from './Container';
import { Button } from '../ui/Button';

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-semibold tracking-tight">
            Nexora
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#" className="text-foreground-secondary hover:text-foreground transition-colors">
              Startseite
            </a>
            <a href="#leistungen" className="text-foreground-secondary hover:text-foreground transition-colors">
              Leistungen
            </a>
            <a href="#vorgehen" className="text-foreground-secondary hover:text-foreground transition-colors">
              Vorgehen
            </a>
            <a href="#referenzen" className="text-foreground-secondary hover:text-foreground transition-colors">
              Referenzen
            </a>
            <a href="#ueber-uns" className="text-foreground-secondary hover:text-foreground transition-colors">
              Über uns
            </a>
            <Button size="sm">Projekt anfragen</Button>
          </div>
        </div>
      </Container>
    </nav>
  );
}
