'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import type { Category } from '@/types/catalog';
import { cn } from '@/lib/utils';

type NavItem = { label: string; href: string };

const NAV: NavItem[] = [
  { label: 'Company', href: '/company' },
  { label: 'Machines', href: '/machines' },
  { label: 'Technology', href: '/technology' },
  { label: 'Infrastructure', href: '/infrastructure' },
  { label: 'Why Mastana', href: '/why-mastana' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route change closes every overlay. Adjusting state during render (rather
  // than in an effect) avoids a cascading re-render on every navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMegaOpen(false);
      setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled || megaOpen
            ? 'border-b border-white/8 bg-ink-950/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        )}
      >
        <div className="container-x">
          <div
            className={cn(
              'flex items-center justify-between transition-all duration-500',
              scrolled ? 'h-16' : 'h-20 md:h-24'
            )}
          >
            <Link href="/" className="flex items-center gap-3" aria-label="Mastana Mechanical Works — home">
              <Image
                src="/media/assets__images__logo.png"
                alt="Mastana Mechanical Works"
                width={220}
                height={44}
                priority
                className="h-8 w-auto brightness-0 invert md:h-9"
              />
            </Link>

            {/* ---------------------------------------------------- desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV.map((item) =>
                item.href === '/machines' ? (
                  <div key={item.href} onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                    <Link
                      href={item.href}
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      onFocus={openMega}
                      className={cn(
                        'relative flex items-center gap-1.5 px-3.5 py-2 text-[0.8125rem] font-medium tracking-tight transition-colors',
                        isActive(item.href) ? 'text-white' : 'text-steel-400 hover:text-white'
                      )}
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 10 6"
                        className={cn('h-1.5 w-2.5 transition-transform duration-300', megaOpen && 'rotate-180')}
                        aria-hidden
                      >
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                      </svg>
                      {isActive(item.href) && (
                        <span className="absolute inset-x-3 -bottom-px h-px bg-amber-500" aria-hidden />
                      )}
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-3.5 py-2 text-[0.8125rem] font-medium tracking-tight transition-colors',
                      isActive(item.href) ? 'text-white' : 'text-steel-400 hover:text-white'
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute inset-x-3.5 -bottom-px h-px bg-amber-500" aria-hidden />
                    )}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-3">
              <ButtonLink href="/request-quote" size="sm" className="hidden sm:inline-flex">
                Request a Quote
                <ArrowRight />
              </ButtonLink>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="flex h-10 w-10 items-center justify-center border border-white/12 text-mist transition-colors hover:border-amber-500/60 lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      'absolute left-0 block h-px w-full bg-current transition-all duration-300',
                      mobileOpen ? 'top-1.5 rotate-45' : 'top-0'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 top-1.5 block h-px w-full bg-current transition-opacity duration-200',
                      mobileOpen && 'opacity-0'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 block h-px w-full bg-current transition-all duration-300',
                      mobileOpen ? 'top-1.5 -rotate-45' : 'top-3'
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={openMega}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full hidden border-t border-white/8 bg-ink-950/97 backdrop-blur-xl lg:block"
            >
              <div className="container-x py-10">
                <div className="mb-7 flex items-baseline justify-between">
                  <span className="eyebrow">Machine Catalogue — 7 categories</span>
                  <Link
                    href="/machines"
                    className="group inline-flex items-center gap-2 text-[0.8125rem] text-amber-400 hover:text-amber-300"
                  >
                    View all machines
                    <ArrowRight />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-1 xl:grid-cols-4">
                  {categories.map((c, i) => (
                    <Link
                      key={c.slug}
                      href={`/machines/category/${c.slug}`}
                      className="group flex items-start gap-4 border-t border-white/6 py-4 transition-colors hover:border-amber-500/40"
                    >
                      <span className="mt-1 font-mono text-[0.625rem] text-steel-500 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.9375rem] font-semibold text-mist transition-colors group-hover:text-amber-400">
                          {c.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-steel-500">
                          {counts[c.slug] ?? 0} {counts[c.slug] === 1 ? 'machine' : 'machines'} · {c.tagline}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3 border-t border-white/6 pt-7">
                  <ButtonLink href="/machines" variant="outline" size="sm">
                    Browse catalogue
                  </ButtonLink>
                  <ButtonLink href="/compare" variant="outline" size="sm">
                    Compare machines
                  </ButtonLink>
                  <ButtonLink href="/machine-finder" variant="outline" size="sm">
                    Find my machine
                  </ButtonLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --------------------------------------------------------- mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-ink-950 pt-20 lg:hidden"
          >
            <nav className="container-x pb-32" aria-label="Mobile">
              <ul className="border-t border-white/8">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: reduce ? 0 : -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.35 }}
                    className="border-b border-white/8"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-5 text-xl font-semibold text-mist"
                    >
                      {item.label}
                      <ArrowRight className="text-steel-500" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <p className="eyebrow mt-9 mb-3">Categories</p>
              <ul className="grid gap-px bg-white/8">
                {categories.map((c) => (
                  <li key={c.slug} className="bg-ink-950">
                    <Link
                      href={`/machines/category/${c.slug}`}
                      className="flex items-center justify-between py-3.5 text-sm text-steel-300"
                    >
                      {c.name}
                      <span className="font-mono text-[0.6875rem] text-steel-500">{counts[c.slug] ?? 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-9 grid gap-3">
                <ButtonLink href="/request-quote" size="lg">
                  Request a Quote
                  <ArrowRight />
                </ButtonLink>
                <ButtonLink href="/machine-finder" variant="outline" size="lg">
                  Find my machine
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
