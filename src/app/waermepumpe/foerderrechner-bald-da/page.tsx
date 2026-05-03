import type { Metadata } from 'next';
import { SignupForm } from './SignupForm';

export const metadata: Metadata = {
  title: 'Wärmepumpen-Förder-Rechner — Live ab 14. Mai 2026 | Nexora',
  description:
    'Eine konkrete Euro-Zahl statt "30 bis 70 %". 60 Sekunden, ohne Login. Tragen Sie sich ein und bekommen Sie den Link zum Launch.',
  alternates: { canonical: 'https://nex-ora.de/waermepumpe/foerderrechner-bald-da/' },
};

export default function Page() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 24px',
        fontFamily: 'var(--font-sans)',
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
        <p
          style={{
            margin: 0,
            marginBottom: 32,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#c8a97e',
          }}
        >
          // Förder-Rechner · Live ab 14. Mai 2026
        </p>

        <h1
          style={{
            margin: 0,
            marginBottom: 24,
            fontSize: 'clamp(36px, 7vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
          }}
        >
          Wieviel Förderung bekommen{' '}
          <em style={{ fontStyle: 'normal', color: '#c8a97e' }}>SIE</em> für Ihre
          Wärmepumpe?
        </h1>

        <p
          style={{
            margin: '0 0 16px',
            fontSize: 19,
            lineHeight: 1.55,
            color: 'var(--muted-foreground)',
            maxWidth: 640,
          }}
        >
          Kein „30 bis 70 %" wie bei der KfW. Eine konkrete Euro-Zahl in 60
          Sekunden — basierend auf Ihrem Einkommen, Ihrer Heizung, Ihrer Region.
        </p>

        <p
          style={{
            margin: '0 0 40px',
            fontSize: 16,
            lineHeight: 1.6,
            color: 'var(--muted-foreground)',
            maxWidth: 640,
          }}
        >
          Wir bauen das Tool gerade fertig. Tragen Sie sich ein und bekommen Sie
          den Link, sobald es live ist — keine Werbung, kein Newsletter, eine
          einzige Mail am Tag des Launches.
        </p>

        <SignupForm />

        <p
          style={{
            marginTop: 64,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
          }}
        >
          NEXORA — FULL-SERVICE WÄRMEPUMPE · NEX-ORA.DE
        </p>
      </div>
    </main>
  );
}
