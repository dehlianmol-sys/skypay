import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import type { HomeBanner } from '@/lib/v2data';

interface GuidedInstallModalProps {
  open: boolean;
  appName: string;
  slides: HomeBanner[];
  title?: string;
  emptyTitle?: string;
  emptyText?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function GuidedInstallModal({
  open,
  appName,
  slides,
  title = 'Open Chrome Browser',
  emptyTitle = 'Continue in Chrome',
  emptyText,
  confirmLabel = 'Confirm & Open Chrome',
  onClose,
  onConfirm,
}: GuidedInstallModalProps) {
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
  }, [open, slides]);

  // Har step ki image pehle se load kar lete hain, taki step badalte hi nayi
  // image turant dikhe (purani image ruki hui na lage).
  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    slides.forEach((slide) => {
      if (!slide.imageUrl) return;
      const preload = new window.Image();
      preload.src = slide.imageUrl;
    });
  }, [open, slides]);

  useEffect(() => {
    if (!open) return;
    setSeconds(3);
    const interval = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [open, index]);

  const isLast = slides.length === 0 || index === slides.length - 1;

  // Agar user Next na dabaye to 5 second baad apne aap agla step dikhta hai.
  // Aakhri step par rukta hai — Confirm user hi dabata hai.
  useEffect(() => {
    if (!open || isLast) return;
    const timer = window.setTimeout(() => setIndex((value) => value + 1), 5000);
    return () => window.clearTimeout(timer);
  }, [open, index, isLast]);

  if (!open) return null;

  const hasSlides = slides.length > 0;
  const lastSlide = isLast;
  const current = slides[index];

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <div className="tutorial-dialog animate-scale-in">
        <header className="tutorial-header">
          <button type="button" className="tutorial-icon-button" onClick={onClose} aria-label="Close tutorial">
            <X size={21} />
          </button>
          <div>
            <h2 id="tutorial-title">{title}</h2>
            <p>{hasSlides ? `Step ${index + 1} of ${slides.length}` : `${appName} download`}</p>
          </div>
          <span className="tutorial-header-spacer" aria-hidden="true" />
        </header>

        <div className="tutorial-image-wrap">
          {current ? (
            <img
              key={`${current.id}-${index}`}
              src={current.imageUrl}
              alt={`Tutorial step ${index + 1}`}
              className="tutorial-image"
              decoding="async"
            />
          ) : (
            <div className="tutorial-empty">
              <strong>{emptyTitle}</strong>
              <span>{emptyText ?? `Chrome will open the ${appName} APK download.`}</span>
            </div>
          )}
        </div>

        {hasSlides && (
          <div className="tutorial-dots" aria-label="Tutorial progress">
            {slides.map((slide, slideIndex) => (
              <span key={slide.id} className={slideIndex === index ? 'is-active' : ''} />
            ))}
          </div>
        )}

        <footer className="tutorial-footer">
          <button
            type="button"
            className="tutorial-back"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={index === 0}
          >
            <ChevronLeft size={18} /> Back
          </button>
          <button
            type="button"
            className="tutorial-next"
            disabled={seconds > 0}
            onClick={() => {
              if (lastSlide) onConfirm();
              else setIndex((value) => value + 1);
            }}
          >
            {seconds > 0 ? `${lastSlide ? 'Confirm' : 'Next'} (${seconds}s)` : lastSlide ? confirmLabel : 'Next'}
            {seconds === 0 && !lastSlide && <ChevronRight size={18} />}
          </button>
        </footer>
      </div>
    </div>
  );
}