import Navigation from "@/components/layout/Navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EscherPattern from "@/components/ui/EscherPattern";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <EscherPattern className="w-full h-full" />
        </div>

        {/* Floating Skeleton Cards - Desktop Only */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <SkeletonCard delay={0} className="top-20 left-10" />
          <SkeletonCard delay={0.2} className="top-40 right-20" />
          <SkeletonCard delay={0.4} className="bottom-32 left-20" />
          <SkeletonCard delay={0.6} className="bottom-20 right-10" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 text-center px-4 py-16 md:py-24">
          <h1 className="text-display font-bold mb-6 animate-fadeDown">
            Generalunternehmer für<br />Energie & Infrastruktur
          </h1>
          <p className="text-h2 mb-8 animate-fadeUp" style={{ color: 'hsl(32 12% 35%)', animationDelay: "0.1s" }}>
            Komplexe Projekte. Ein Partner.
          </p>
          <p className="text-body-lg max-w-2xl mx-auto mb-12 animate-fadeUp" style={{ color: 'hsl(35 10% 55%)', animationDelay: "0.2s" }}>
            Nexora übernimmt die Gesamtverantwortung für Ihre Energie-, Elektro- und
            Infrastrukturprojekte – von der Anfrage bis zur Abnahme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeUp" style={{ animationDelay: "0.3s" }}>
            <Button href="#kontakt" variant="primary">
              Projekt anfragen
            </Button>
            <Button href="#leistungen" variant="secondary">
              Leistungen entdecken
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 md:mt-24 max-w-4xl mx-auto">
            {[
              { value: "150+", label: "Abgeschlossene Projekte" },
              { value: "98%", label: "Termingerechte Übergabe" },
              { value: "15+", label: "Jahre Erfahrung" },
              { value: "100%", label: "Gesamtverantwortung" },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-fadeUp" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <div className="text-h1 font-bold mb-2" style={{ color: 'hsl(35 65% 55%)' }}>{stat.value}</div>
                <div className="text-body-sm" style={{ color: 'hsl(35 10% 55%)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Das Problem */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'hsl(40 25% 95% / 0.5)' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-h1 font-bold mb-6">
              Komplexe Projekte, viele Gewerke – wer koordiniert?
            </h2>
            <p className="text-body-lg" style={{ color: 'hsl(32 12% 35%)' }}>
              Bei Großprojekten im Bereich Energie und Infrastruktur arbeiten zahlreiche
              Spezialisten zusammen: Elektriker, Tiefbauer, Blitzschutz-Experten, PV-Installateure
              und viele mehr. Das Ergebnis ohne zentrale Steuerung: Terminverzögerungen,
              Schnittstellenprobleme und undurchsichtige Verantwortlichkeiten.
            </p>
          </div>
        </div>
      </section>

      {/* Unsere Lösung */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-h1 font-bold mb-12 text-center">
              Unsere Lösung: One Face to the Customer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Ein Ansprechpartner für alle Gewerke",
                "Klare Verantwortlichkeiten und Prozesse",
                "Transparente Kommunikation und Reporting",
                "Terminsicherheit durch professionelles Projektmanagement",
                "Qualitätssicherung über alle Schnittstellen",
              ].map((item, index) => (
                <Card key={index} hover className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: 'hsl(35 65% 55% / 0.2)' }} />
                  <p className="text-body" style={{ color: 'hsl(30 15% 15%)' }}>{item}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ihre Vorteile */}
      <section id="vorgehen" className="py-16 md:py-24" style={{ backgroundColor: 'hsl(40 25% 95% / 0.5)' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h1 font-bold mb-4">
                Warum Auftraggeber mit Nexora arbeiten
              </h2>
              <p className="text-body-lg" style={{ color: 'hsl(32 12% 35%)' }}>
                Wir reduzieren Komplexität und schaffen klare Strukturen für Ihren Projekterfolg.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Ein Ansprechpartner",
                  description:
                    "Keine Koordination zwischen Dutzenden Gewerken. Sie sprechen mit uns – wir kümmern uns um den Rest.",
                },
                {
                  title: "Gesamtverantwortung",
                  description:
                    "Wir übernehmen die volle Verantwortung für Ihr Projekt. Termine, Qualität und Budget aus einer Hand.",
                },
                {
                  title: "Strukturiertes Vorgehen",
                  description:
                    "Klare Prozesse, transparente Kommunikation und nachvollziehbare Meilensteine von Anfang bis Ende.",
                },
              ].map((benefit, index) => (
                <Card key={index} hover>
                  <h3 className="text-h3 font-bold mb-4">{benefit.title}</h3>
                  <p className="text-body" style={{ color: 'hsl(32 12% 35%)' }}>{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leistungen */}
      <section id="leistungen" className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h1 font-bold mb-4">Was wir für Sie tun</h2>
              <p className="text-body-lg" style={{ color: 'hsl(32 12% 35%)' }}>
                Von der ersten Beratung bis zur finalen Abnahme – wir begleiten Ihr Projekt in
                allen Phasen.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Generalunternehmung",
                  description:
                    "Wir bündeln alle Gewerke und übernehmen die Gesamtverantwortung für Ihr Projekt.",
                },
                {
                  title: "Projektmanagement",
                  description:
                    "Professionelle Steuerung komplexer Vorhaben mit klaren Strukturen und Prozessen.",
                },
                {
                  title: "Energie & Elektro",
                  description:
                    "Spezialisiert auf anspruchsvolle Energie- und Elektroinfrastruktur-Projekte.",
                },
                {
                  title: "Infrastruktur",
                  description:
                    "Von Tiefbau über Kabelverlegung bis zur schlüsselfertigen Übergabe.",
                },
              ].map((service, index) => (
                <Card key={index} hover>
                  <h3 className="text-h3 font-bold mb-4">{service.title}</h3>
                  <p className="text-body" style={{ color: 'hsl(32 12% 35%)' }}>{service.description}</p>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button href="#kontakt" variant="secondary">
                Alle Leistungen ansehen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Für wen wir arbeiten */}
      <section id="referenzen" className="py-16 md:py-24" style={{ backgroundColor: 'hsl(40 25% 95% / 0.5)' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h1 font-bold mb-4">Unsere Auftraggeber</h2>
              <p className="text-body-lg" style={{ color: 'hsl(32 12% 35%)' }}>
                Wir sind der richtige Partner für Unternehmen mit komplexen Anforderungen.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Industrieunternehmen",
                  description: "Produktions- und Logistikstandorte",
                },
                {
                  title: "Projektentwickler",
                  description: "Gewerbliche Bauprojekte",
                },
                {
                  title: "Energieversorger",
                  description: "Infrastruktur & Netzausbau",
                },
                {
                  title: "Betreiber",
                  description: "Märkte, Gewerbeimmobilien",
                },
              ].map((client, index) => (
                <Card key={index} hover className="text-center">
                  <h3 className="text-h3 font-bold mb-3">{client.title}</h3>
                  <p className="text-body-sm" style={{ color: 'hsl(32 12% 35%)' }}>{client.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="kontakt" className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-h1 font-bold mb-6">Bereit für Ihr nächstes Projekt?</h2>
            <p className="text-body-lg mb-8" style={{ color: 'hsl(32 12% 35%)' }}>
              Lassen Sie uns gemeinsam besprechen, wie wir Ihr Vorhaben erfolgreich umsetzen können.
              Unverbindlich und transparent.
            </p>
            <Button href="mailto:info@nexora-pv.de" variant="primary">
              Projekt anfragen
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="ueber-uns" className="py-12 md:py-16" style={{ backgroundColor: 'hsl(30 15% 15%)', color: 'hsl(40 25% 95%)' }}>
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-h3 font-bold mb-4">Nexora GmbH</h3>
              <p className="text-body-sm mb-4" style={{ opacity: 0.8 }}>
                Ihr Generalunternehmer für komplexe Energie-, Elektro- und Infrastrukturprojekte.
                Ein Ansprechpartner – von der Anfrage bis zur Abnahme.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-body font-bold mb-4">Kontakt</h4>
              <div className="space-y-2 text-body-sm" style={{ opacity: 0.8 }}>
                <p>Grüner Ring 15</p>
                <p>04509 Delitzsch</p>
                <p className="pt-2">
                  <a href="mailto:info@nexora-pv.de" className="hover:opacity-100 transition-opacity">
                    info@nexora-pv.de
                  </a>
                </p>
                <p>
                  <a href="tel:+4934202899882" className="hover:opacity-100 transition-opacity">
                    +49 (0) 34202 899882
                  </a>
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-body font-bold mb-4">Navigation</h4>
              <div className="space-y-2 text-body-sm">
                {["Startseite", "Leistungen", "Vorgehen", "Referenzen", "Über uns", "Kontakt"].map(
                  (item) => (
                    <div key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(" ", "-").replace("ü", "ue")}`}
                        className="hover:opacity-100 transition-opacity"
                        style={{ opacity: 0.8 }}
                      >
                        {item}
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-body-sm" style={{ borderColor: 'hsl(40 25% 95% / 0.2)', opacity: 0.6 }}>
            <p>© 2026 Nexora GmbH. Alle Rechte vorbehalten.</p>
            <div className="flex gap-6">
              <a href="#impressum" className="hover:opacity-100 transition-opacity">
                Impressum
              </a>
              <a href="#datenschutz" className="hover:opacity-100 transition-opacity">
                Datenschutz
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
