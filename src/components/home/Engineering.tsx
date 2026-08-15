import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { infrastructure } from '@/content/company';

const ICONS: Record<string, React.ReactNode> = {
  Manufacturing: (
    <>
      <path d="M3 21h18M5 21V9l5 3.5V9l5 3.5V6l4 2.5V21" strokeLinejoin="round" />
    </>
  ),
  'Research & development': (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5M11 8v6M8 11h6" strokeLinecap="round" />
    </>
  ),
  'Quality control': (
    <>
      <path d="M12 3l7 3v6c0 4.2-2.9 7.9-7 9-4.1-1.1-7-4.8-7-9V6l7-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'Technological adaptability': (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
    </>
  ),
};

/** Engineering / R&D band, built on the blueprint visual language. */
export function Engineering() {
  return (
    <Section className="hairline-t relative overflow-hidden bg-ink-900">
      <div className="blueprint-fine pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-amber-500/8 blur-[100px]"
        aria-hidden
      />

      <div className="container-x relative">
        <SectionHeader
          eyebrow="Engineering & R&D"
          title="Every machine passes through our own R&D wing."
          intro="Mastana runs an in-house Research and Development wing staffed by trained engineers. New model design development is undertaken regularly, and every product is tested before it leaves the works."
          action={
            <ButtonLink href="/technology" variant="outline">
              Technology & R&D
              <ArrowRight />
            </ButtonLink>
          }
        />

        <div className="mt-14 grid gap-px bg-white/8 md:mt-20 md:grid-cols-2 xl:grid-cols-4">
          {infrastructure.map((item, i) => (
            <Reveal key={item.title} index={i}>
              <div className="bracket group h-full bg-ink-900 p-7 transition-colors hover:bg-ink-880 md:p-8">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  aria-hidden
                  className="h-7 w-7 text-amber-500"
                >
                  {ICONS[item.title]}
                </svg>
                <h3 className="mt-6 text-base font-bold text-mist">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-steel-400">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
