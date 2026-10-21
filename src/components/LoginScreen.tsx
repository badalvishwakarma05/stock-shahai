import React, { useState } from 'react';
import { Store, User, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

interface LoginScreenProps {
  onLogin: (user: { name: string; mobile: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();

    // Validate: name not empty, mobile is 10 digits
    if (!trimmedName || !/^\d{10}$/.test(trimmedMobile)) {
      setError(t('loginError'));
      triggerHaptic(100);
      return;
    }

    setError('');
    setIsSubmitting(true);
    triggerHaptic(50);

    // Small delay for visual feedback
    setTimeout(() => {
      onLogin({ name: trimmedName, mobile: trimmedMobile });
    }, 300);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 select-none overflow-hidden font-sans">
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md w-full mx-auto">
        {/* Animated Logo & Branding */}
        <div className="flex flex-col items-center mb-10 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-5 ring-4 ring-emerald-500/20">
            <Store className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight text-center">
            {t('loginTitle')}
          </h1>
          <p className="text-sm text-emerald-400 font-medium mt-1 text-center">
            {t('loginSubtitle')}
          </p>
          <p className="text-xs text-slate-400 mt-3 text-center">
            {t('loginWelcome')}
          </p>
        </div>

        {/* Login Form Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 shadow-2xl space-y-4"
        >
          {/* Name Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-name"
              className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              {t('loginNameLabel')}
            </label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={t('loginNamePlaceholder')}
              autoComplete="name"
              className="w-full h-14 px-4 rounded-xl bg-slate-900/80 border border-slate-600/60 text-white text-base font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-150"
            />
          </div>

          {/* Mobile Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-mobile"
              className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              {t('loginMobileLabel')}
            </label>
            <input
              id="login-mobile"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={mobile}
              onChange={(e) => {
                // Only allow digits
                const val = e.target.value.replace(/\D/g, '');
                setMobile(val);
                if (error) setError('');
              }}
              placeholder={t('loginMobilePlaceholder')}
              autoComplete="tel"
              className="w-full h-14 px-4 rounded-xl bg-slate-900/80 border border-slate-600/60 text-white text-base font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-150 tracking-widest"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg
              active:scale-95 active:brightness-90 transition-all duration-150
              ${
                isSubmitting
                  ? 'bg-emerald-700/50 text-emerald-300/60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-500 hover:to-green-400 shadow-emerald-500/30'
              }
            `}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {t('loginBtn')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Offline Note */}
        <p className="text-[10px] text-slate-500 mt-6 text-center">
          🔒 {t('offlineMode')} — कोई इंटरनेट नहीं चाहिए
        </p>
      </div>

      {/* Custom animation keyframes */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};
