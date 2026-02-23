/**
 * Ogenti — Brand Logo Component
 * Sleek, minimal black-tone logomark with wordmark.
 */

interface OgentiLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export function OgentiLogo({ size = 32, showText = true, className = '', variant = 'light' }: OgentiLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Ogenti logo"
      >
        {/* Background — rounded square */}
        <rect
          width="48"
          height="48"
          rx="12"
          fill={variant === 'light' ? '#ffffff' : '#0a0a0f'}
        />

        {/* Outer ring — stylized "O" */}
        <circle
          cx="24"
          cy="24"
          r="14"
          stroke={variant === 'light' ? '#0a0a0f' : '#ffffff'}
          strokeWidth="3"
          fill="none"
        />

        {/* Inner diagonal slash — the "agent" mark */}
        <line
          x1="18"
          y1="30"
          x2="30"
          y2="18"
          stroke={variant === 'light' ? '#0a0a0f' : '#ffffff'}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Dot — eye / cursor accent */}
        <circle
          cx="30"
          cy="18"
          r="3"
          fill={variant === 'light' ? '#0a0a0f' : '#ffffff'}
        />
      </svg>
      {showText && (
        <span
          className="font-semibold tracking-tight"
          style={{ fontSize: size * 0.5, color: '#ffffff' }}
        >
          ogenti
        </span>
      )}
    </span>
  );
}

export function OgentiIcon({ size = 20, variant = 'dark' }: { size?: number; variant?: 'light' | 'dark' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ogenti"
    >
      <rect width="48" height="48" rx="12" fill={variant === 'dark' ? '#0a0a0f' : '#ffffff'} />
      <circle cx="24" cy="24" r="14" stroke={variant === 'dark' ? '#ffffff' : '#0a0a0f'} strokeWidth="3" fill="none" />
      <line x1="18" y1="30" x2="30" y2="18" stroke={variant === 'dark' ? '#ffffff' : '#0a0a0f'} strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="18" r="3" fill={variant === 'dark' ? '#ffffff' : '#0a0a0f'} />
    </svg>
  );
}
