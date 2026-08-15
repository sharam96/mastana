import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeader } from '@/components/ui/Section';
import { strengths } from '@/content/company';

export function WhyMastana() {
  return (
    <Section className="hairline-t relative overflow-hidden">
      <div className="container-x">
        <SectionHeader
          eyebrow="Why Mastana"
          title="Quality is the lifeline of our business."
          intro="Six reasons customers have returned to Mastana since 1957 — each one taken directly from how the firm actually operates."
        />

        <div className="mt-14 grid gap-px bg-white/8 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {strengths.map((item, i) => (
            <Reveal key={item.title} index={i % 3}>
              <div className="group relative h-full bg-ink-950 p-8 transition-colors hover:bg-ink-900 md:p-10">
                <span className="font-mono text-[0.625rem] text-steel-600 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-lg font-bold text-mist transition-colors group-hover:text-amber-400">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-steel-400">{item.body}</p>
                <span
                  className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-amber-500 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 md:inset-x-10"
                  aria-hidden
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
