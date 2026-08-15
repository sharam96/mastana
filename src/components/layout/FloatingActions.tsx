'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

import { contact } from '@/content/company';
import { whatsappLink } from '@/lib/utils';

const WHATSAPP_MESSAGE =
  'Hello Mastana Mechanical Works, I am interested in your textile machinery. I would like to discuss my requirement.';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.35-1.4a9.82 9.82 0 0 0 4.69 1.19h.01c5.43 0 9.85-4.42 9.85-9.86 0-2.63-1.02-5.11-2.88-6.97A9.79 9.79 0 0 0 12.04 2Zm0 17.94h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.14 8.14 0 0 1-1.25-4.35c0-4.52 3.68-8.19 8.2-8.19a8.14 8.14 0 0 1 5.79 2.4 8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.18-8.19 8.18Z" />
    </svg>
  );
}

/**
 * Floating WhatsApp entry point plus a sticky Request-a-Quote bar on mobile.
 * The AI launcher is rendered separately by MastanaAI so the two never overlap.
 */
export function FloatingActions() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onQuotePage = pathname === '/request-quote' || pathname === '/contact';

  return (
    <>
      {/* WhatsApp — sits above the mobile quote bar, left of the AI launcher */}
      <motion.a
        href={whatsappLink(contact.whatsapp.e164, WHATSAPP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Mastana on WhatsApp"
        initial={false}
        animate={{ opacity: show ? 1 : 0, scale: show || reduce ? 1 : 0.85 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: show ? 'auto' : 'none' }}
        className="fixed bottom-20 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-105 md:bottom-6 md:left-6"
      >
        <WhatsAppIcon />
      </motion.a>

      {/* Sticky mobile quote CTA */}
      {!onQuotePage && (
        <motion.div
          initial={false}
          animate={{ y: show ? 0 : 100 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink-950/95 px-4 py-3 backdrop-blur-xl md:hidden"
        >
          <Link
            href="/request-quote"
            className="flex h-11 w-full items-center justify-center gap-2 bg-amber-500 text-sm font-semibold text-ink-950"
          >
            Request a Quote
          </Link>
        </motion.div>
      )}
    </>
  );
}
