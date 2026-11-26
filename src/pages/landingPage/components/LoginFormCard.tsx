import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Lock, LogIn, ShieldCheck, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ADMIN_CREDENTIALS, LOGIN_CONTENT, PAINT_SWATCHES } from '@/data/login';
import { cn } from '@/lib/utils';
import type { LoginFormValues } from '@/types/auth';

export function LoginFormCard() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormValues>({
    username: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (
      form.username.trim() !== ADMIN_CREDENTIALS.username ||
      form.password !== ADMIN_CREDENTIALS.password
    ) {
      setErrorMessage(LOGIN_CONTENT.invalidCredentialsError);
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Signed in to Bare Bears Admin.');
      navigate('/dashboard');
    }, 350);
  };

  return (
    <motion.section
      aria-labelledby="login-heading"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex w-full flex-col justify-center px-6 py-8 sm:px-10 sm:py-10"
    >
      <div className="mx-auto w-full max-w-sm">
        {/* Colorful admin badge + paint dots */}
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1D6CE0]/10 px-3 py-1 text-xs font-semibold text-[#1554B3]">
            <ShieldCheck className="size-4 text-[#169C46]" aria-hidden="true" />
            <span>{LOGIN_CONTENT.adminBadge}</span>
          </span>

          <div className="flex items-center gap-1.5" aria-hidden="true">
            {PAINT_SWATCHES.map((swatch) => (
              <span key={swatch.name} className={cn('size-2.5 rounded-full', swatch.colorClass)} />
            ))}
          </div>
        </div>

        <h1 id="login-heading" className="text-3xl font-bold tracking-tight text-slate-900">
          {LOGIN_CONTENT.heading}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {errorMessage ? (
            <div
              role="alert"
              className="rounded-xl border border-[#E5242A]/30 bg-[#E5242A]/10 px-3.5 py-2.5 text-sm font-medium text-[#B91C1C]"
            >
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-slate-700">
              {LOGIN_CONTENT.usernameLabel}
            </Label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#1D6CE0]/12 text-[#1D6CE0]"
              >
                <User className="size-4" />
              </span>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                required
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                placeholder={LOGIN_CONTENT.usernamePlaceholder}
                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-12 text-slate-900 placeholder:text-slate-400 user-valid:border-[#169C46] user-invalid:border-[#E5242A] user-invalid:bg-[#E5242A]/5 focus-visible:border-[#1D6CE0] focus-visible:ring-[#1D6CE0]/25"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="current-password" className="text-sm font-medium text-slate-700">
                {LOGIN_CONTENT.passwordLabel}
              </Label>
              <button
                type="button"
                onClick={() => toast.info('Password reset link sent!')}
                className="text-xs font-semibold text-[#1D6CE0] transition-colors hover:text-[#1554B3]"
              >
                {LOGIN_CONTENT.forgotPasswordLabel}
              </button>
            </div>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#8E24E5]/12 text-[#8E24E5]"
              >
                <Lock className="size-4" />
              </span>
              <Input
                id="current-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                enterKeyHint="done"
                required
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={LOGIN_CONTENT.passwordPlaceholder}
                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pr-11 pl-12 text-slate-900 placeholder:text-slate-400 user-valid:border-[#169C46] user-invalid:border-[#E5242A] user-invalid:bg-[#E5242A]/5 focus-visible:border-[#8E24E5] focus-visible:ring-[#8E24E5]/25"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#169C46] transition-colors hover:bg-[#169C46]/10"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-[#1D6CE0] via-[#7C3AED] to-[#E5242A] text-sm font-semibold text-white shadow-md shadow-[#1D6CE0]/20 transition-opacity hover:opacity-95"
          >
            <LogIn className="size-4" aria-hidden="true" />
            <span>{isSubmitting ? LOGIN_CONTENT.submittingLabel : LOGIN_CONTENT.submitLabel}</span>
          </Button>
        </form>
      </div>
    </motion.section>
  );
}
