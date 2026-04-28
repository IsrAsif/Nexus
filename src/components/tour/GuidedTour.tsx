import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface TooltipPosition {
  top: number;
  left: number;
  arrowSide: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_KEY = 'nexus_tour_done';

const entrepreneurTour: TourStep[] = [
  {
    target: '[data-tour="dashboard-title"]',
    title: '👋 Welcome to Business Nexus!',
    content: 'This is your Entrepreneur Dashboard. Here you get a quick overview of your funding journey.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar-investors"]',
    title: '🔍 Find Investors',
    content: 'Browse and connect with investors who match your industry and funding stage.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-payments"]',
    title: '💳 Payments & Wallet',
    content: 'View your wallet balance, deposit funds, and track all your transactions here.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-chamber"]',
    title: '🔐 Document Chamber',
    content: 'Securely share NDA-protected documents with vetted investors.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-videocall"]',
    title: '🎥 Video Calls',
    content: 'Launch pitch meetings and investor calls directly from Nexus.',
    placement: 'right',
  },
];

const investorTour: TourStep[] = [
  {
    target: '[data-tour="dashboard-title"]',
    title: '👋 Welcome, Investor!',
    content: 'This is your Investor Dashboard. Discover startups, manage deals, and track your portfolio.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar-entrepreneurs"]',
    title: '🚀 Find Startups',
    content: 'Browse curated startups across industries and funding stages.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-payments"]',
    title: '💰 Fund Deals',
    content: 'Use the Payments section to initiate investments directly to entrepreneurs.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-deals"]',
    title: '📋 Deals Pipeline',
    content: 'Track active deals, term sheets, and due diligence progress.',
    placement: 'right',
  },
];

interface GuidedTourProps {
  role: 'entrepreneur' | 'investor';
  forceShow?: boolean;
  onEnd?: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ role, forceShow, onEnd }) => {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState<TooltipPosition | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const steps = role === 'entrepreneur' ? entrepreneurTour : investorTour;
  const current = steps[step];

  useEffect(() => {
    if (forceShow) { setActive(true); setStep(0); return; }
    const done = localStorage.getItem(TOUR_KEY);
    if (!done) {
      setTimeout(() => setActive(true), 1000);
    }
  }, [forceShow]);

  useEffect(() => {
    if (!active || !current) return;
    const timer = setTimeout(() => positionTooltip(), 100);
    return () => clearTimeout(timer);
  }, [active, step]);

  const positionTooltip = () => {
    const target = document.querySelector(current.target);
    if (!target) {
      // Target not found — center on screen
      setPos({ top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 150, arrowSide: 'top' });
      return;
    }
    const rect = target.getBoundingClientRect();
    const placement = current.placement || 'bottom';
    const TW = 320, TH = 160;
    let top = 0, left = 0, arrowSide: TooltipPosition['arrowSide'] = 'top';

    if (placement === 'bottom') {
      top = rect.bottom + 12; left = rect.left + rect.width / 2 - TW / 2; arrowSide = 'top';
    } else if (placement === 'top') {
      top = rect.top - TH - 12; left = rect.left + rect.width / 2 - TW / 2; arrowSide = 'bottom';
    } else if (placement === 'right') {
      top = rect.top + rect.height / 2 - TH / 2; left = rect.right + 12; arrowSide = 'left';
    } else {
      top = rect.top + rect.height / 2 - TH / 2; left = rect.left - TW - 12; arrowSide = 'right';
    }

    // clamp
    left = Math.max(8, Math.min(left, window.innerWidth - TW - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - TH - 8));
    setPos({ top, left, arrowSide });
  };

  const end = () => {
    setActive(false);
    localStorage.setItem(TOUR_KEY, '1');
    onEnd?.();
  };

  const next = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else end();
  };
  const prev = () => { if (step > 0) setStep(s => s - 1); };

  if (!active) return null;

  // Highlight
  const targetEl = current ? document.querySelector(current.target) : null;
  const tRect = targetEl?.getBoundingClientRect();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        {tRect && (
          <div
            className="absolute ring-4 ring-primary-500 ring-offset-2 rounded-lg bg-primary-500/10 transition-all duration-300"
            style={{ top: tRect.top - 4, left: tRect.left - 4, width: tRect.width + 8, height: tRect.height + 8 }}
          />
        )}
      </div>

      {/* Tooltip */}
      {pos && (
        <div
          ref={tooltipRef}
          className="fixed z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ top: pos.top, left: pos.left }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary-200" />
                <span className="text-primary-200 text-xs font-medium">
                  Step {step + 1} of {steps.length}
                </span>
              </div>
              <button onClick={end} className="text-primary-200 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <h3 className="text-white font-bold mt-2">{current.title}</h3>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            <p className="text-gray-600 text-sm leading-relaxed">{current.content}</p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1 pb-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-primary-500' : 'w-1.5 bg-gray-200'}`} />
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 pb-4 flex items-center justify-between">
            <button
              onClick={end}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip tour
            </button>
            <div className="flex gap-2">
              {step > 0 && (
                <button onClick={prev}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronLeft size={14} /> Back
                </button>
              )}
              <button onClick={next}
                className="flex items-center gap-1 text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium">
                {step === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Small launcher button to restart tour
export const TourLauncher: React.FC<{ role: 'entrepreneur' | 'investor' }> = ({ role }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
        title="Start guided tour"
      >
        <Sparkles size={16} /> Tour
      </button>
      {show && <GuidedTour role={role} forceShow onEnd={() => setShow(false)} />}
    </>
  );
};
