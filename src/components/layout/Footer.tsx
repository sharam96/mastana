import Image from 'next/image';
import Link from 'next/link';

import { company, contact } from '@/content/company';
import type { Category } from '@/types/catalog';

const COMPANY_LINKS = [
  { label: 'Company Profile', href: '/company' },
  { label: 'Technology & R&D', href: '/technology' },
  { label: 'Infrastructure', href: '/infrastructure' },
  { label: 'Why Mastana', href: '/why-mastana' },
  { label: 'Contact', href: '/contact' },
  { label: 'Request a Quote', href: '/request-quote' },
];

export function Footer({ categories }: { categories: Category[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t relative overflow-hidden bg-ink-900">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[52rem] -translate-x-1/2 rounded-full bg-amber-500/8 blur-3xl"
        aria-hidden
      />

      {/* extra bottom padding on mobile clears the fixed Request-a-Quote bar */}
      <div className="container-x relative pt-16 pb-28 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-4">
            <Image
              src="/media/assets__images__logo.png"
              alt="Mastana Mechanical Works"
              width={240}
              height={48}
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-steel-400">{company.positioning}</p>

            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <dt className="eyebrow">Established</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-mist">{company.established}</dd>
              </div>
              <div>
                <dt className="eyebrow">Certification</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-mist">ISO 9001</dd>
              </div>
            </dl>
          </div>

          {/* links */}
          <nav className="lg:col-span-2" aria-label="Company">
            <h2 className="eyebrow mb-5">Company</h2>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-steel-400 transition-colors hover:text-amber-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-3" aria-label="Machine categories">
            <h2 className="eyebrow mb-5">Machines</h2>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/machines/category/${c.slug}`}
                    className="text-sm text-steel-400 transition-colors hover:text-amber-400"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          <div className="lg:col-span-3">
            <h2 className="eyebrow mb-5">Contact</h2>

            <address className="space-y-5 not-italic">
              {contact.addresses.slice(0, 2).map((a) => (
                <div key={a.label}>
                  <p className="font-mono text-[0.625rem] uppercase tracking-widest text-steel-500">{a.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">{a.lines.join(', ')}</p>
                </div>
              ))}

              <div>
                <p className="font-mono text-[0.625rem] uppercase tracking-widest text-steel-500">Phone</p>
                <ul className="mt-1.5 space-y-1">
                  {contact.phones.slice(0, 3).map((p) => (
                    <li key={p.tel}>
                      <a href={`tel:${p.tel}`} className="text-sm text-steel-400 transition-colors hover:text-amber-400">
                        {p.number}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-mono text-[0.625rem] uppercase tracking-widest text-steel-500">Email</p>
                <ul className="mt-1.5 space-y-1">
                  {contact.emails.map((e) => (
                    <li key={e.address}>
                      <a
                        href={`mailto:${e.address}`}
                        className="text-sm break-all text-steel-400 transition-colors hover:text-amber-400"
                      >
                        {e.address}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-14 border-t border-white/8 pt-7">
          <p className="eyebrow mb-3">Branches</p>
          <p className="text-sm text-steel-400">{contact.branches.join(' · ')}</p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-7 text-xs text-steel-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName} ({company.registered}). All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-2">
            {contact.hours.map((h) => (
              <span key={h.days}>
                {h.days}: {h.time}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
