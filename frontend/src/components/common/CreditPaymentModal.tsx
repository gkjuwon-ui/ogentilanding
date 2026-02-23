'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  X,
  Loader2,
  Shield,
  Check,
  CreditCard,
  Coins,
  AlertCircle,
} from 'lucide-react';

/* --- Stripe promise cache --- */

let stripePromiseCache: Promise<Stripe | null> | null = null;

function getStripePromise(publishableKey: string) {
  if (!stripePromiseCache) {
    stripePromiseCache = loadStripe(publishableKey);
  }
  return stripePromiseCache;
}

/* --- Props --- */

interface CreditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditAmount: number;
  onSuccess: () => void;
}

/* --- Inner checkout form --- */

function CreditCheckoutForm({
  creditAmount,
  amount,
  rate,
  fee,
  paymentIntentId,
  onSuccess,
  onClose,
}: {
  creditAmount: number;
  amount: number;
  rate: number;
  fee: number;
  paymentIntentId: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || '결제에 실패했습니다.');
        setPaying(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm credit on backend
        try {
          await api.stripe.confirmCredit(paymentIntentId, creditAmount);
        } catch {
          // Webhook fallback
        }
        setSuccess(true);
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
      setPaying(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check size={32} className="text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white">결제 완료!</h3>
        <p className="text-sm text-black/60">{creditAmount} 크레딧이 충전되었습니다!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Purchase summary */}
      <div className="bg-black/[0.03] border border-black/10 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2997ff 0%, #0066CC 100%)' }}>
            <Coins size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white">크레딧 구매</h4>
            <p className="text-xs text-black/50">{rate} credits/$1 · 수수료 {(fee).toFixed(2)}$</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">{creditAmount}</p>
            <p className="text-[10px] text-black/40 uppercase">credits</p>
          </div>
        </div>
        <div className="flex justify-between text-xs text-black/50 border-t border-white/[0.06] pt-2 mt-2">
          <span>총결제 금액</span>
          <span className="text-black/80 font-medium">${amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Stripe PaymentElement */}
      <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                address: { country: 'KR' },
              },
            },
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || paying}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #2997ff 0%, #0066CC 100%)' }}
      >
        {paying ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            결제 처리 중..
          </>
        ) : (
          <>
            <CreditCard size={16} />
            ${amount.toFixed(2)} 결제하기
          </>
        )}
      </button>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-black/30">
        <Shield size={12} />
        <span>Stripe 보안 결제 | 카드 정보는 Ogenti에 저장되지 않습니다</span>
      </div>
    </form>
  );
}

/* --- Main Credit Payment Modal --- */

export function CreditPaymentModal({ isOpen, onClose, creditAmount, onSuccess }: CreditPaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [fee, setFee] = useState(0);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  useEffect(() => {
    if (!isOpen || !creditAmount || creditAmount < 5) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setClientSecret(null);

    (async () => {
      try {
        // 1. Get publishable key
        const pkRes = await api.stripe.getPublishableKey();
        const pk = pkRes?.publishableKey || pkRes?.data?.publishableKey;
        if (!pk) throw new Error('Stripe가 설정되지 않았습니다');

        if (!cancelled) setStripePromise(getStripePromise(pk));

        // 2. Create PaymentIntent
        const piRes = await api.stripe.createPaymentIntent(creditAmount);
        const data = piRes?.data || piRes;

        if (!data?.clientSecret) throw new Error('결제를 초기화할 수 없습니다');

        if (!cancelled) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setAmount(data.amount || 0);
          setRate(data.rate || 0);
          setFee(data.fee || 0);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to initialize payment');
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen, creditAmount]);

  if (!isOpen || !creditAmount) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4 bg-white border border-black/10 rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp 0.25s ease-out' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-black/60" />
            <h2 className="text-base font-semibold text-white">크레딧 구매</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-black/40 hover:text-white hover:bg-black/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={28} className="animate-spin text-black/40" />
              <p className="text-sm text-black/50">결제 준비중..</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <AlertCircle size={28} className="text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg bg-black/10 text-black/70 hover:bg-black/20 transition-colors"
              >
                닫기
              </button>
            </div>
          )}

          {!loading && !error && clientSecret && stripePromise && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#0071e3',
                    colorBackground: '#111111',
                    colorText: '#ffffff',
                    colorDanger: '#ef4444',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '10px',
                    colorTextPlaceholder: '#666666',
                  },
                  rules: {
                    '.Input': {
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      boxShadow: 'none',
                    },
                    '.Input:focus': {
                      border: '1px solid rgba(0,113,227,0.5)',
                      boxShadow: '0 0 0 1px rgba(0,113,227,0.2)',
                    },
                    '.Tab': {
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                    },
                    '.Tab--selected': {
                      backgroundColor: 'rgba(0,113,227,0.15)',
                      border: '1px solid rgba(0,113,227,0.4)',
                      color: '#ffffff',
                    },
                    '.Tab--selected:hover': {
                      color: '#ffffff',
                    },
                    '.Tab:hover': {
                      color: '#ffffff',
                    },
                    '.Label': {
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '13px',
                    },
                  },
                },
                locale: 'ko',
              }}
            >
              <CreditCheckoutForm
                creditAmount={creditAmount}
                amount={amount}
                rate={rate}
                fee={fee}
                paymentIntentId={paymentIntentId || ''}
                onSuccess={onSuccess}
                onClose={onClose}
              />
            </Elements>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
