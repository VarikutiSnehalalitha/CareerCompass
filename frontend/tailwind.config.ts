import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)'
        },
        foreground: 'var(--text)',
        'foreground-muted': 'var(--text-muted)',
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)'
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem'
      },
      boxShadow: {
        soft: '0 4px 20px -2px var(--shadow-color)',
        elevated: '0 10px 30px -4px var(--shadow-color)',
        glow: '0 0 25px -3px var(--glow-color)'
      }
    },
  },
  plugins: [],
}
export default config
