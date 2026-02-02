import { Container, Section, Button, Card, EscherPattern, GeometricDecoration } from '@/components';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Section className="pt-32 pb-20 sm:pt-40 relative">
        <EscherPattern variant="tessellation" />
        <GeometricDecoration position="top-right" size="lg" />
        <Container size="narrow">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight">
                <span className="block">Nexora</span>
                <span className="block text-foreground-secondary">
                  AI-Powered Innovation
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
                Transforming ideas into reality with cutting-edge artificial intelligence solutions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Get Started</Button>
              <Button variant="secondary" size="lg">Learn More</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section background="secondary">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '~1M', label: 'Users' },
              { value: '22K', label: 'Projects' },
              { value: '7K', label: 'Companies' },
              { value: '10+', label: 'Countries' },
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

      {/* Features Section */}
      <Section className="relative">
        <EscherPattern variant="isometric" />
        <Container>
          <div className="space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Built for the Future
              </h2>
              <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                Powerful features designed to accelerate your workflow
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'AI-Powered Analysis',
                  description: 'Advanced machine learning models that understand and process data with unprecedented accuracy',
                },
                {
                  title: 'Real-Time Processing',
                  description: 'Lightning-fast computation engines delivering results in milliseconds, not minutes',
                },
                {
                  title: 'Seamless Integration',
                  description: 'Connect effortlessly with your existing tools and workflows through our robust API',
                },
              ].map((feature, i) => (
                <Card key={i} hover padding="lg">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-2xl font-bold text-foreground">
                      {i + 1}
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-foreground-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Experience/Timeline Section */}
      <Section background="secondary" id="experience">
        <Container size="narrow">
          <div className="space-y-12">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              Experience
            </h2>
            <div className="space-y-8">
              {[
                {
                  period: '2023 — Present',
                  role: 'Founder + AI Architect',
                  company: 'Nexora AI Solutions',
                  highlights: [
                    'AI M-7.3 Foundation model development (8K ctx, 920GB, 45B tokens)',
                    'Scaled to 50K users worldwide within 9 months',
                    'AI-first company model',
                    'Full-cycle product engineering',
                  ],
                },
                {
                  period: '2024 — Present',
                  role: 'AI Lead + Tech Advisor',
                  company: 'Stealth Fintech',
                  highlights: [
                    'AI strategy for next-gen fintech platform',
                    'High-performance systems design',
                  ],
                },
              ].map((exp, i) => (
                <div key={i} className="border border-border rounded-lg p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <div className="text-sm text-foreground-muted">{exp.period}</div>
                      <h3 className="text-xl font-semibold tracking-tight mt-1">
                        {exp.role}
                      </h3>
                      <div className="text-foreground-secondary">{exp.company}</div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground-secondary">
                    {exp.highlights.map((highlight, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-foreground-muted">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section>
        <Container size="narrow">
          <div className="text-center space-y-8 py-12">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-lg text-foreground-secondary">
              Join thousands of innovators building the future with Nexora
            </p>
            <Button size="lg">Start Your Journey</Button>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border">
        <Container>
          <div className="py-12 text-center text-sm text-foreground-muted">
            © 2026 Nexora. Built with precision and purpose.
          </div>
        </Container>
      </footer>
    </main>
  );
}
