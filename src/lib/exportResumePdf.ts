import type { RefObject } from 'react';

/** html2canvas 1.x cannot parse modern CSS color functions (e.g. oklch from Tailwind v4). */
const MODERN_COLOR_SYNTAX_RE = /oklch|oklab|lch\(|lab\(|hwb\(|color\(/i;

function colorNeedsBridging(value: string): boolean {
  return MODERN_COLOR_SYNTAX_RE.test(value);
}

/**
 * Runs inside html2canvas `onclone`: rewrites computed colors on the cloned DOM to rgb/rgba
 * so html2canvas' parser never sees oklch/lab/etc.
 */
function normalizeCloneColorsForHtml2Canvas(clonedDoc: Document, clonedRoot: HTMLElement): void {
  const win = clonedDoc.defaultView;
  if (!win) return;

  const probe = clonedDoc.createElement('canvas');
  probe.width = 1;
  probe.height = 1;
  const ctx = probe.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  function bridgeSolidCssColor(cssColor: string): string | null {
    const v = cssColor.trim();
    if (!v || v === 'none' || v === 'auto') return null;
    if (v === 'transparent') return 'transparent';
    if (!colorNeedsBridging(v)) return null;

    try {
      ctx.fillStyle = '#000000';
      ctx.fillStyle = v;
      const serialized = ctx.fillStyle;
      if (typeof serialized === 'string' && !colorNeedsBridging(serialized)) {
        return serialized;
      }
    } catch {
      /* fall through to pixel read */
    }

    try {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      if (a === 0) return 'rgba(0, 0, 0, 0)';
      if (a === 255) return `rgb(${r}, ${g}, ${b})`;
      return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(4)})`;
    } catch {
      return null;
    }
  }

  const tree: Element[] = [clonedRoot, ...clonedRoot.querySelectorAll('*')];

  for (const el of tree) {
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) continue;
    const cs = win.getComputedStyle(el);
    const { style } = el;

    for (let i = 0; i < cs.length; i++) {
      const name = cs.item(i);
      if (!name || name.startsWith('--')) continue;
      const val = cs.getPropertyValue(name).trim();
      if (!val || !colorNeedsBridging(val)) continue;

      if (name === 'background-image' || name === '-webkit-background-image' || name === 'mask-image' || name === '-webkit-mask-image') {
        try {
          style.setProperty(name, 'none');
        } catch {
          /* ignore */
        }
        continue;
      }

      if (
        name.includes('shadow') ||
        name === 'filter' ||
        name === 'backdrop-filter' ||
        name === '-webkit-backdrop-filter'
      ) {
        try {
          style.setProperty(name, 'none');
        } catch {
          /* ignore */
        }
        continue;
      }

      if (name === 'background') {
        const bgc = cs.backgroundColor;
        const bridgedBg = bridgeSolidCssColor(bgc);
        if (bridgedBg) {
          try {
            style.setProperty('background-color', bridgedBg);
          } catch {
            /* ignore */
          }
        }
        try {
          style.setProperty('background-image', 'none');
        } catch {
          /* ignore */
        }
        continue;
      }

      const bridged = bridgeSolidCssColor(val);
      if (!bridged) continue;
      try {
        style.setProperty(name, bridged);
      } catch {
        /* ignore unsupported / read-only property names */
      }
    }
  }
}

type JsPdfInstance = {
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  addImage: (data: string, fmt: string, x: number, y: number, w: number, h: number) => void;
  addPage: () => void;
  save: (name: string) => void;
};

async function loadJsPdfCtor(): Promise<new (orientation?: string, unit?: string, format?: string) => JsPdfInstance> {
  const mod = (await import('jspdf')) as { jsPDF?: unknown; default?: unknown };
  const Ctor = (mod.jsPDF ?? mod.default) as new (orientation?: string, unit?: string, format?: string) => JsPdfInstance;
  if (typeof Ctor !== 'function') throw new Error('jsPDF not available');
  return Ctor;
}

/**
 * Renders `element` to a multi-page A4 PDF. Uses html2canvas with a sane scale.
 * Prefer an off-screen element with no CSS `transform` on ancestors.
 */
export async function exportHtmlNodeToPdf(element: HTMLElement, fileBaseName: string): Promise<void> {
  await document.fonts?.ready?.catch(() => undefined);

  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(element, {
    scale: Math.min(2, (window.devicePixelRatio || 1) * 1.25),
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (clonedDoc, clonedElement) => {
      normalizeCloneColorsForHtml2Canvas(clonedDoc, clonedElement);
    },
  });

  let imgData: string;
  try {
    imgData = canvas.toDataURL('image/png');
  } catch (e) {
    throw new Error(
      e instanceof Error
        ? `Canvas export blocked (${e.message}). Avoid cross-origin images in the resume.`
        : 'Canvas export blocked (security).',
    );
  }

  const JsPDF = await loadJsPdfCtor();
  const pdf = new JsPDF('p', 'mm', 'a4');
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;

  let heightLeft = imgH;
  let y = 0;
  pdf.addImage(imgData, 'PNG', 0, y, imgW, imgH);
  heightLeft -= pageH;

  while (heightLeft > 0.5) {
    y = heightLeft - imgH;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, y, imgW, imgH);
    heightLeft -= pageH;
  }

  const safe = fileBaseName.replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '') || 'resume';
  pdf.save(`${safe}-yugamcloud.pdf`);
}

/** Prefer dedicated off-screen capture node; fall back to on-screen preview wrapper. */
export function pickPdfSourceElement(
  captureRef: RefObject<HTMLElement | null>,
  fallbackRef: RefObject<HTMLElement | null>,
): HTMLElement | null {
  return captureRef.current ?? fallbackRef.current;
}
