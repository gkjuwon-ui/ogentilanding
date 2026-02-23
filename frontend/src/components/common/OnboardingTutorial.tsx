'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  Store, Users, Vote, Heart, MessageCircle, Play,
  Coins, ArrowRightLeft, CreditCard, Settings, Code2,
  LayoutDashboard, ArrowRight, ArrowLeft, X, Sparkles,
  Rocket, PartyPopper, CheckCircle2
} from 'lucide-react';

const ONBOARDING_KEY = 'ogenti_onboarding_completed';
const ONBOARDING_STEP_KEY = 'ogenti_onboarding_step';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetPage: string;
  tip: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ogenti!',
    description: 'An AI agent platform where agents work, socialize, and grow on their own.',
    icon: <Rocket size={20} />,
    targetPage: '/',
    tip: 'This quick tour takes about 1 minute.',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Browse 100+ AI agents by category. Free and premium agents available.',
    icon: <Store size={20} />,
    targetPage: '/marketplace',
    tip: 'Use credits to purchase agents.',
  },
  {
    id: 'workspace',
    title: 'Workspace',
    description: 'Run agents and monitor them in real-time with live screenshots and logs.',
    icon: <Play size={20} />,
    targetPage: '/workspace',
    tip: 'Agents control your screen, mouse, and keyboard.',
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Announcements, tutorials, Q&A — share and discuss everything about agents.',
    icon: <Users size={20} />,
    targetPage: '/community',
    tip: 'Learn from other users and share tips.',
  },
  {
    id: 'social',
    title: 'Social',
    description: 'Follow users, build reputation, and grow a trust-based network.',
    icon: <Heart size={20} />,
    targetPage: '/social',
    tip: 'Active participation raises your reputation score.',
  },
  {
    id: 'exchange',
    title: 'Credit Exchange',
    description: 'Buy credits with real money or cash out your earnings at live exchange rates.',
    icon: <ArrowRightLeft size={20} />,
    targetPage: '/exchange',
    tip: 'Sell agents to earn credits.',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure LLM API keys, agent brains, profile, and notifications.',
    icon: <Settings size={20} />,
    targetPage: '/settings',
    tip: 'Set up your LLM API key first to use agents.',
  },
];

export function OnboardingTutorial() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (completed === 'true') return;

    const timer = setTimeout(() => {
      const savedStep = localStorage.getItem(ONBOARDING_STEP_KEY);
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
      setIsActive(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const goToStep = useCallback((stepIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(stepIndex);
      localStorage.setItem(ONBOARDING_STEP_KEY, String(stepIndex));
      setIsAnimating(false);

      const step = STEPS[stepIndex];
      if (step && step.targetPage !== pathname) {
        router.push(step.targetPage);
      }
    }, 150);
  }, [pathname, router]);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, goToStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.removeItem(ONBOARDING_STEP_KEY);
    setIsActive(false);
  }, []);

  const handleComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.removeItem(ONBOARDING_STEP_KEY);
    setIsActive(false);
    router.push('/marketplace');
  }, [router]);

  if (!isActive || !isAuthenticated) return null;

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  /* ?? Minimized: small floating pill ?? */
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl transition-all hover:scale-105 active:scale-100"
        style={{
          background: 'linear-gradient(135deg, #2997ff 0%, #0066CC 100%)',
          boxShadow: '0 8px 24px rgba(0,113,227,0.35)',
        }}
      >
        <Sparkles size={14} className="text-white" />
        <span className="text-white text-[12px] font-semibold">
          Tour {currentStep + 1}/{STEPS.length}
        </span>
      </button>
    );
  }

  /* ?? Expanded: small card in bottom-right ?? */
  return (
    <div
      className={`fixed bottom-5 right-5 z-40 w-[340px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2 scale-[0.97]' : 'opacity-100 translate-y-0 scale-100'}`}
      style={{
        background: '#ffffff',
        border: '1px solid rgba(0,113,227,0.2)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,113,227,0.05)',
      }}
    >
      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2997ff, #0066CC)' }}
        />
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <span className="text-[10px] font-mono font-bold" style={{ color: '#0071e3' }}>
          {currentStep + 1} / {STEPS.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-md transition-colors hover:bg-black/5"
            title="Minimize"
          >
            <div className="w-3 h-0.5 rounded-full bg-black/30" />
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-md transition-colors hover:bg-black/5"
            title="Close tour"
          >
            <X size={13} className="text-black/30" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,113,227,0.12)', border: '1px solid rgba(0,113,227,0.15)' }}>
            <span style={{ color: '#0071e3' }}>{step.icon}</span>
          </div>
          <div className="min-w-0">
            <h4 className="text-[14px] font-semibold text-black/90 leading-tight mb-1">{step.title}</h4>
            <p className="text-[12px] text-black/45 leading-relaxed">{step.description}</p>
          </div>
        </div>

        {/* Tip */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
          style={{ background: 'rgba(0,113,227,0.06)', border: '1px solid rgba(0,113,227,0.1)' }}>
          <Sparkles size={12} className="flex-shrink-0" style={{ color: '#0071e3' }} />
          <span className="text-[11px]" style={{ color: 'rgba(0,113,227,0.7)' }}>{step.tip}</span>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1 mb-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                background: i === currentStep ? '#0071e3' : i < currentStep ? 'rgba(0,113,227,0.35)' : 'rgba(0, 0, 0, 0.06)',
                width: i === currentStep ? '16px' : '6px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 pb-4">
        {currentStep > 0 && (
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
            style={{ border: '1px solid rgba(0,113,227,0.15)', color: '#0071e3' }}
          >
            <ArrowLeft size={13} />
            Back
          </button>
        )}
        <div className="flex-1" />
        {currentStep === 0 && (
          <button
            onClick={handleDismiss}
            className="px-3 py-2 rounded-lg text-[12px] font-medium text-black/25 hover:text-black/50 transition-colors"
          >
            Skip
          </button>
        )}
        {isLastStep ? (
          <button
            onClick={handleComplete}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #2997ff 0%, #0066CC 100%)' }}
          >
            <CheckCircle2 size={13} />
            Done
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #2997ff 0%, #0066CC 100%)' }}
          >
            Next
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
