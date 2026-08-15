import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { contact } from '@/content/company';
import { whatsappLink } from '@/lib/utils';

const WHATSAPP_MESSAGE =
  'Hello Mastana Mechanical Works, I am interested in your textile machinery. I would like to discuss my requirement.';

export function ContactCta() {
  return (
    <section className="hairline-t relative overflow-hidden bg-ink-900 py-20 md:py-28">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[52rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-amber-500/12 blur-[110px]"
        aria-hidden
      />

      <div className="container-x relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Get in touch</span>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-[1.02] font-extrabold">
              Tell us what you need to produce.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.975rem] leading-relaxed text-steel-400">
              Send us your requirement — gauge, width, production volume — and our team will come back
              with the right machine from the Mastana range.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/request-quote" size="lg">
                Request a Quote
                <ArrowRight />
              </ButtonLink>
              <a
                href={whatsappLink(contact.whatsapp.e164, WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center gap-2.5 border border-white/15 px-8 text-[0.9375rem] font-medium text-mist transition-colors hover:border-[#25D366]/60 hover:text-white"
              >
                WhatsApp
              </a>
            </div>

            <dl className="mt-14 grid gap-8 border-t border-white/8 pt-10 text-left sm:grid-cols-3">
              <div>
                <dt className="eyebrow">Call</dt>
                <dd className="mt-2 space-y-1">
                  {contact.phones.slice(0, 3).map((p) => (
                    <a
                      key={p.tel}
                      href={`tel:${p.tel}`}
                      className="block text-sm text-steel-300 transition-colors hover:text-amber-400"
                    >
                      {p.number}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-2 space-y-1">
                  {contact.emails.map((e) => (
                    <a
                      key={e.address}
                      href={`mailto:${e.address}`}
                      className="block text-sm break-all text-steel-300 transition-colors hover:text-amber-400"
                    >
                      {e.address}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Visit</dt>
                <dd className="mt-2 text-sm leading-relaxed text-steel-300">
                  {contact.addresses[0].lines.join(', ')}
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
