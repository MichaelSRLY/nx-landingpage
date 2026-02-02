export default function Home() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-12 py-4 bg-white border-b border-[#e5e0d8]">
        <div className="text-2xl font-semibold">Nexora</div>
        <nav className="flex gap-8 items-center">
          <a href="#" className="text-sm hover:opacity-70">Startseite</a>
          <a href="#leistungen" className="text-sm hover:opacity-70">Leistungen</a>
          <a href="#vorgehen" className="text-sm hover:opacity-70">Vorgehen</a>
          <a href="#referenzen" className="text-sm hover:opacity-70">Referenzen</a>
          <a href="#ueber-uns" className="text-sm hover:opacity-70">Über uns</a>
          <a href="#kontakt" className="bg-[#2d2a26] text-white px-5 py-2.5 rounded-md text-sm hover:opacity-90">
            Projekt anfragen
          </a>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="text-center px-12 py-32 max-w-[900px] mx-auto">
          <h1 className="text-[56px] font-semibold leading-[1.1] mb-6">
            Generalunternehmer für Energie & Infrastruktur
          </h1>
          <p className="text-2xl font-medium text-[#5a5650] mb-4">
            Komplexe Projekte. Ein Partner.
          </p>
          <p className="text-lg text-[#6a6560] mb-8">
            Nexora übernimmt die Gesamtverantwortung für Ihre Energie-, Elektro- und Infrastrukturprojekte – von der Anfrage bis zur Abnahme.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#kontakt" className="bg-[#2d2a26] text-white px-5 py-2.5 rounded-md hover:opacity-90">
              Projekt anfragen
            </a>
            <a href="#leistungen" className="bg-[#e5e0d8] text-[#2d2a26] px-5 py-2.5 rounded-md hover:opacity-90">
              Leistungen entdecken
            </a>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="px-12 py-20 max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Das Problem</h2>
          <p className="text-xl font-medium text-[#5a5650] mb-4">
            Komplexe Projekte, viele Gewerke – wer koordiniert?
          </p>
          <p className="text-base text-[#6a6560] leading-relaxed">
            Bei Großprojekten im Bereich Energie und Infrastruktur arbeiten zahlreiche Spezialisten zusammen: Elektriker, Tiefbauer, Blitzschutz-Experten, PV-Installateure und viele mehr. Das Ergebnis ohne zentrale Steuerung: Terminverzögerungen, Schnittstellenprobleme und undurchsichtige Verantwortlichkeiten.
          </p>
        </section>

        {/* Solution Section */}
        <section id="loesung" className="px-12 py-20 max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Unsere Lösung: One Face to the Customer</h2>
          <ul className="space-y-3 text-base text-[#6a6560]">
            <li>• Ein Ansprechpartner für alle Gewerke</li>
            <li>• Klare Verantwortlichkeiten und Prozesse</li>
            <li>• Transparente Kommunikation und Reporting</li>
            <li>• Terminsicherheit durch professionelles Projektmanagement</li>
            <li>• Qualitätssicherung über alle Schnittstellen</li>
          </ul>
        </section>

        {/* Benefits Section */}
        <section id="vorteile" className="px-12 py-20 max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Ihre Vorteile</h2>
          <p className="text-base text-[#6a6560] mb-8">Warum Auftraggeber mit Nexora arbeiten</p>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-semibold mb-3">Ein Ansprechpartner</h3>
              <p className="text-base text-[#6a6560]">
                Keine Koordination zwischen Dutzenden Gewerken. Sie sprechen mit uns – wir kümmern uns um den Rest.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-semibold mb-3">Gesamtverantwortung</h3>
              <p className="text-base text-[#6a6560]">
                Wir übernehmen die volle Verantwortung für Ihr Projekt. Termine, Qualität und Budget aus einer Hand.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-semibold mb-3">Strukturiertes Vorgehen</h3>
              <p className="text-base text-[#6a6560]">
                Klare Prozesse, transparente Kommunikation und nachvollziehbare Meilensteine von Anfang bis Ende.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="leistungen" className="px-12 py-20 max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Leistungen</h2>
          <p className="text-base text-[#6a6560] mb-8">Was wir für Sie tun</p>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-semibold mb-3">Generalunternehmung</h3>
              <p className="text-base text-[#6a6560]">
                Wir bündeln alle Gewerke und übernehmen die Gesamtverantwortung für Ihr Projekt.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-semibold mb-3">Projektmanagement</h3>
              <p className="text-base text-[#6a6560]">
                Professionelle Steuerung komplexer Vorhaben mit klaren Strukturen und Prozessen.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-semibold mb-3">Energie & Elektro</h3>
              <p className="text-base text-[#6a6560]">
                Spezialisiert auf anspruchsvolle Energie- und Elektroinfrastruktur-Projekte.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8] col-span-3 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-3">Infrastruktur</h3>
              <p className="text-base text-[#6a6560]">
                Von Tiefbau über Kabelverlegung bis zur schlüsselfertigen Übergabe.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="flex justify-center gap-16 px-12 py-16 bg-white">
          <div className="text-center">
            <div className="text-5xl font-bold">150+</div>
            <div className="text-sm text-[#6a6560] mt-2">Abgeschlossene Projekte</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold">98%</div>
            <div className="text-sm text-[#6a6560] mt-2">Termingerechte Übergabe</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold">15+</div>
            <div className="text-sm text-[#6a6560] mt-2">Jahre Erfahrung</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold">100%</div>
            <div className="text-sm text-[#6a6560] mt-2">Gesamtverantwortung</div>
          </div>
        </div>

        {/* Clients Section */}
        <section id="auftraggeber" className="px-12 py-20 max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Für wen wir arbeiten</h2>
          <p className="text-base text-[#6a6560] mb-8">Unsere Auftraggeber</p>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-semibold mb-3">Industrieunternehmen</h3>
              <p className="text-base text-[#6a6560]">Produktions- und Logistikstandorte</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-semibold mb-3">Projektentwickler</h3>
              <p className="text-base text-[#6a6560]">Gewerbliche Bauprojekte</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-semibold mb-3">Energieversorger</h3>
              <p className="text-base text-[#6a6560]">Infrastruktur & Netzausbau</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#e5e0d8] col-span-3 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-3">Betreiber</h3>
              <p className="text-base text-[#6a6560]">Märkte, Gewerbeimmobilien</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="px-12 py-20 text-center max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Bereit für Ihr nächstes Projekt?</h2>
          <p className="text-base text-[#6a6560] mb-8">
            Lassen Sie uns gemeinsam besprechen, wie wir Ihr Vorhaben erfolgreich umsetzen können. Unverbindlich und transparent.
          </p>
          <a href="#kontakt" className="inline-block bg-[#2d2a26] text-white px-5 py-2.5 rounded-md hover:opacity-90">
            Projekt anfragen
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2d2a26] text-white px-12 py-16">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-lg mb-8">
            Ihr Generalunternehmer für komplexe Energie-, Elektro- und Infrastrukturprojekte. Ein Ansprechpartner – von der Anfrage bis zur Abnahme.
          </p>
          <div className="flex justify-between">
            <div className="space-y-1">
              <p>Grüner Ring 15</p>
              <p>04509 Delitzsch</p>
              <p>info@nexora-pv.de</p>
              <p>+49 (0) 34202 899882</p>
            </div>
            <div>
              <p>© 2026 Nexora GmbH. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
