import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeader } from '@/components/ui/Section';
import { timeline } from '@/content/company';

/** Vertical timeline built from statements on the existing About page. */
export function Story() {
  return (
    <Section id="story" className="relative overflow-hidden">
      <div className="container-x">
        <SectionHeader
          eyebrow="Company"
          title="Built since 1957."
          intro="Nearly seven decades of manufacturing hosiery knitting machines from Ludhiana, Punjab."
          action={
            <ButtonLink href="/company" variant="outline">
              Company profile
              <ArrowRight />
            </ButtonLink>
          }
        />

        <ol className="relative mt-14 md:mt-20">
          {/* the spine */}
          <span
            className="absolute left-[0.4375rem] top-2 bottom-2 w-px bg-gradient-to-b from-amber-500/60 via-white/12 to-transparent md:left-[8.5rem]"
            aria-hidden
          />

          {timeline.map((item, i) => (
            <li key={item.title} className="relative pb-10 last:pb-0">
              <Reveal index={i}>
                <div className="flex gap-6 md:gap-10">
                  <div className="flex shrink-0 items-start gap-6 md:w-[8.5rem] md:justify-end">
                    <span className="hidden font-display text-lg font-bold text-amber-500 md:block">
                      {item.year}
                    </span>
                  </div>

                  <span
                    className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-amber-500 bg-ink-950 md:-ml-[1.6875rem]"
                    aria-hidden
                  />

                  <div className="min-w-0 flex-1 pb-2">
                    <span className="font-display text-base font-bold text-amber-500 md:hidden">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-mist md:mt-0">{item.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-steel-400">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
