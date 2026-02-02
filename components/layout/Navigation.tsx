"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Startseite", href: "#home" },
    { label: "Leistungen", href: "#leistungen" },
    { label: "Vorgehen", href: "#vorgehen" },
    { label: "Referenzen", href: "#referenzen" },
    { label: "Über uns", href: "#ueber-uns" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border" style={{ backgroundColor: 'hsl(40 25% 95% / 0.8)', borderColor: 'hsl(35 15% 85%)' }}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="#home" className="text-h3 font-bold tracking-tight">
            Nexora
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm transition-colors"
              style={{ color: 'hsl(32 12% 35%)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(30 15% 15%)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(32 12% 35%)')}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#kontakt"
              className="px-6 py-2 rounded-lg text-body-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'hsl(30 15% 15%)', color: 'hsl(40 25% 95%)' }}
            >
              Projekt anfragen
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            style={{ color: 'hsl(30 15% 15%)' }}
            aria-label="Menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: 'hsl(35 15% 85%)' }}>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-body transition-colors"
                  style={{ color: 'hsl(32 12% 35%)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(30 15% 15%)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(32 12% 35%)')}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#kontakt"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 rounded-lg text-body text-center font-medium"
                style={{ backgroundColor: 'hsl(30 15% 15%)', color: 'hsl(40 25% 95%)' }}
              >
                Projekt anfragen
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
