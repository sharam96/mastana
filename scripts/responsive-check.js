/*
 * Paste-into-the-console responsive check.
 *
 * Reports elements whose text is clipped horizontally and anything that
 * escapes the viewport, ignoring intentional cases (sr-only text, overflow
 * containers, the marquee track and decorative absolutely-positioned blurs).
 *
 * Usage in DevTools:  __check()
 */
window.__check = function () {
  const de = document.documentElement;

  const intentional = (el) => {
    if (el.classList.contains('sr-only')) return true;
    if (el.closest('.marquee')) return true;
    if (el.getAttribute('aria-hidden') === 'true' && getComputedStyle(el).position === 'absolute')
      return true;
    let n = el;
    while (n && n !== document.body) {
      const cs = getComputedStyle(n);
      if (['auto', 'scroll', 'hidden'].includes(cs.overflowX)) return true;
      n = n.parentElement;
    }
    return false;
  };

  const clipped = [];
  const escaping = [];

  document.querySelectorAll('main *, header *, footer *').forEach((el) => {
    if (intentional(el)) return;

    if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1) {
      clipped.push({
        el: `${el.tagName.toLowerCase()}.${String(el.className || '').split(' ').slice(0, 2).join('.')}`,
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        text: (el.textContent || '').trim().slice(0, 40),
      });
    }

    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > de.clientWidth + 2 || r.left < -2)) {
      escaping.push({
        el: `${el.tagName.toLowerCase()}.${String(el.className || '').split(' ').slice(0, 2).join('.')}`,
        left: Math.round(r.left),
        right: Math.round(r.right),
      });
    }
  });

  const small = [...document.querySelectorAll('a, button, select, input, textarea')].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32) && !el.closest('.marquee');
  });

  return {
    viewport: de.clientWidth,
    horizontalScroll: de.scrollWidth > de.clientWidth + 1,
    pageScrollWidth: de.scrollWidth,
    clipped,
    escaping,
    smallTapTargets: small.length,
    h1: (() => {
      const h = document.querySelector('main h1');
      return h ? { fits: h.scrollWidth <= h.clientWidth + 1, font: getComputedStyle(h).fontSize } : null;
    })(),
  };
};
