import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#ffffff',
          secondary: '#f5f5f7',
          tertiary: '#e8e8ed',
          elevated: '#ffffff',
          hover: '#f0f0f2',
          active: '#e8e8ed',
        },
        border: {
          primary: 'rgba(0, 0, 0, 0.08)',
          secondary: 'rgba(0, 0, 0, 0.12)',
          focus: 'rgba(0, 113, 227, 0.4)',
        },
        text: {
          primary: '#1d1d1f',
          secondary: '#6e6e73',
          tertiary: '#86868b',
          inverse: '#ffffff',
        },
        accent: {
          DEFAULT: '#0071e3',
          hover: '#0077ED',
          muted: 'rgba(0, 113, 227, 0.1)',
          light: '#2997ff',
          subtle: 'rgba(0, 113, 227, 0.05)',
          border: 'rgba(0, 113, 227, 0.25)',
        },
        success: '#34c759',
        warning: '#ff9f0a',
        error: '#ff3b30',
        info: '#86868b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontWeight: {
        thin: '300',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '500',
        bold: '500',
        extrabold: '500',
        black: '500',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
