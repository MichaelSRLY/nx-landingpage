import { Container, Section, Button, Card, Navigation, EscherPattern, GeometricDecoration } from '@/components';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <Section className="pt-32 pb-20 sm:pt-40 relative">
          <EscherPattern variant="tessellation" />
          <GeometricDecoration position="top-right" size="lg" />
          <Container size="narrow">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight">
                  <span className="block">Generalunternehmer für</span>
                  <span className="block">Energie & Infrastruktur</span>
                </h1>
                <p className="text-2xl sm:text-3xl text-foreground-secondary font-medium tracking-tight">
                  Komplexe Projekte. Ein Partner.
                </p>
                <p className="text-lg sm:text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed pt-4">
                  Nexora übernimmt die Gesamtverantwortung für Ihre Energie-, Elektro- und Infrastrukturprojekte – von der Anfrage bis zur Abnahme.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">Projekt anfragen</Button>
                <Button variant="secondary" size="lg">Leistungen entdecken</Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* Stats Section */}
        <Section background="secondary">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '150+', label: 'Abgeschlossene Projekte' },
                { value: '98%', label: 'Termingerechte Übergabe' },
                { value: '15+', label: 'Jahre Erfahrung' },
                { value: '100%', label: 'Gesamtverantwortung' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-4xl md:text-5xl font-semibold tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm text-foreground-tertiary">{stat.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Problem Section */}
        <Section>
          <Container size="narrow">
            <div className="space-y-6">
              <div className="text-sm text-foreground-muted uppercase tracking-wide">
                Das Problem
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Komplexe Projekte, viele Gewerke – wer koordiniert?
              </h2>
              <p className="text-lg text-foreground-secondary leading-relaxed">
                Bei Großprojekten im Bereich Energie und Infrastruktur arbeiten zahlreiche Spezialisten zusammen: Elektriker, Tiefbauer, Blitzschutz-Experten, PV-Installateure und viele mehr. Das Ergebnis ohne zentrale Steuerung: Terminverzögerungen, Schnittstellenprobleme und undurchsichtige Verantwortlichkeiten.
              </p>
            </div>
          </Container>
        </Section>

        {/* Solution Section */}
        <Section background="secondary">
          <Container size="narrow">
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Unsere Lösung: One Face to the Customer
              </h2>
              <div className="space-y-4">
                {[
                  'Ein Ansprechpartner für alle Gewerke',
                  'Klare Verantwortlichkeiten und Prozesse',
                  'Transparente Kommunikation und Reporting',
                  'Terminsicherheit durch professionelles Projektmanagement',
                  'Qualitätssicherung über alle Schnittstellen',
                ].map((point, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-lg text-foreground-secondary leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Benefits Section */}
        <Section className="relative">
          <EscherPattern variant="isometric" />
          <Container>
            <div className="space-y-16">
              <div className="text-center space-y-4">
                <div className="text-sm text-foreground-muted uppercase tracking-wide">
                  Ihre Vorteile
                </div>
                <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                  Warum Auftraggeber mit Nexora arbeiten
                </h2>
                <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                  Wir reduzieren Komplexität und schaffen klare Strukturen für Ihren Projekterfolg.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Ein Ansprechpartner',
                    description: 'Keine Koordination zwischen Dutzenden Gewerken. Sie sprechen mit uns – wir kümmern uns um den Rest.',
                  },
                  {
                    title: 'Gesamtverantwortung',
                    description: 'Wir übernehmen die volle Verantwortung für Ihr Projekt. Termine, Qualität und Budget aus einer Hand.',
                  },
                  {
                    title: 'Strukturiertes Vorgehen',
                    description: 'Klare Prozesse, transparente Kommunikation und nachvollziehbare Meilensteine von Anfang bis Ende.',
                  },
                ].map((benefit, i) => (
                  <Card key={i} hover padding="lg">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-2xl font-bold text-foreground">
                        {i + 1}
                      </div>
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-foreground-secondary leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Services Section */}
        <Section background="secondary" id="leistungen">
          <Container>
            <div className="space-y-16">
              <div className="text-center space-y-4">
                <div className="text-sm text-foreground-muted uppercase tracking-wide">
                  Leistungen
                </div>
                <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                  Was wir für Sie tun
                </h2>
                <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                  Von der ersten Beratung bis zur finalen Abnahme – wir begleiten Ihr Projekt in allen Phasen.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Generalunternehmung',
                    description: 'Wir bündeln alle Gewerke und übernehmen die Gesamtverantwortung für Ihr Projekt.',
                  },
                  {
                    title: 'Projektmanagement',
                    description: 'Professionelle Steuerung komplexer Vorhaben mit klaren Strukturen und Prozessen.',
                  },
                  {
                    title: 'Energie & Elektro',
                    description: 'Spezialisiert auf anspruchsvolle Energie- und Elektroinfrastruktur-Projekte.',
                  },
                  {
                    title: 'Infrastruktur',
                    description: 'Von Tiefbau über Kabelverlegung bis zur schlüsselfertigen Übergabe.',
                  },
                ].map((service, i) => (
                  <Card key={i} padding="lg">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-foreground-secondary leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="text-center">
                <Button variant="secondary" size="lg">Alle Leistungen ansehen</Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* Target Clients Section */}
        <Section>
          <Container>
            <div className="space-y-16">
              <div className="text-center space-y-4">
                <div className="text-sm text-foreground-muted uppercase tracking-wide">
                  Für wen wir arbeiten
                </div>
                <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                  Unsere Auftraggeber
                </h2>
                <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                  Wir sind der richtige Partner für Unternehmen mit komplexen Anforderungen.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Industrieunternehmen',
                    description: 'Produktions- und Logistikstandorte',
                  },
                  {
                    title: 'Projektentwickler',
                    description: 'Gewerbliche Bauprojekte',
                  },
                  {
                    title: 'Energieversorger',
                    description: 'Infrastruktur & Netzausbau',
                  },
                  {
                    title: 'Betreiber',
                    description: 'Märkte, Gewerbeimmobilien',
                  },
                ].map((client, i) => (
                  <Card key={i} padding="lg">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold tracking-tight">
                        {client.title}
                      </h3>
                      <p className="text-sm text-foreground-tertiary">
                        {client.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Final CTA Section */}
        <Section background="secondary">
          <Container size="narrow">
            <div className="text-center space-y-8 py-12">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Bereit für Ihr nächstes Projekt?
              </h2>
              <p className="text-lg text-foreground-secondary">
                Lassen Sie uns gemeinsam besprechen, wie wir Ihr Vorhaben erfolgreich umsetzen können. Unverbindlich und transparent.
              </p>
              <Button size="lg">Projekt anfragen</Button>
            </div>
          </Container>
        </Section>

        {/* Footer */}
        <footer className="border-t border-border bg-background">
          <Container>
            <div className="py-16 space-y-12">
              {/* Tagline */}
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-lg text-foreground-secondary leading-relaxed">
                  Ihr Generalunternehmer für komplexe Energie-, Elektro- und Infrastrukturprojekte. Ein Ansprechpartner – von der Anfrage bis zur Abnahme.
                </p>
              </div>

              {/* Contact & Navigation */}
              <div className="grid md:grid-cols-3 gap-8 text-sm">
                <div className="space-y-2">
                  <div className="font-semibold text-foreground">Kontakt</div>
                  <div className="space-y-1 text-foreground-secondary">
                    <p>Grüner Ring 15</p>
                    <p>04509 Delitzsch</p>
                    <p className="pt-2">
                      <a href="mailto:info@nexora-pv.de" className="hover:text-foreground transition-colors">
                        info@nexora-pv.de
                      </a>
                    </p>
                    <p>
                      <a href="tel:+4934202899882" className="hover:text-foreground transition-colors">
                        +49 (0) 34202 899882
                      </a>
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-foreground">Navigation</div>
                  <div className="space-y-1 text-foreground-secondary">
                    <p><a href="#" className="hover:text-foreground transition-colors">Startseite</a></p>
                    <p><a href="#leistungen" className="hover:text-foreground transition-colors">Leistungen</a></p>
                    <p><a href="#vorgehen" className="hover:text-foreground transition-colors">Vorgehen</a></p>
                    <p><a href="#referenzen" className="hover:text-foreground transition-colors">Referenzen</a></p>
                    <p><a href="#ueber-uns" className="hover:text-foreground transition-colors">Über uns</a></p>
                    <p><a href="#kontakt" className="hover:text-foreground transition-colors">Kontakt</a></p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-foreground">Rechtliches</div>
                  <div className="space-y-1 text-foreground-secondary">
                    <p><a href="#impressum" className="hover:text-foreground transition-colors">Impressum</a></p>
                    <p><a href="#datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a></p>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="pt-8 border-t border-border text-center text-sm text-foreground-muted">
                © 2026 Nexora GmbH. Alle Rechte vorbehalten.
              </div>
            </div>
          </Container>
        </footer>
      </main>
    </>
  );
}
