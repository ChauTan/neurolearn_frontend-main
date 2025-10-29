// tailwind.config.js
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['inter', ...fontFamily.sans], // đặt Inter làm mặc định
      },
      colors: {
        background: '#ffffff',
        foreground: '#171717',
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          50: '#eff6ff',
          800: '#1e40af',
        },
        secondary: '#f3f4f6',
        accent: {
          DEFAULT: '#60a5fa',
          900: '#1e3a8a',
          700: '#1d4ed8',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff', // để dùng text-destructive-foreground
        },
        input: '#d1d5db', // để dùng border-input
        ring: '#3b82f6', // để dùng focus:ring-ring
      },
      maskImage: {
        'course-shape': "url('/assets/home/Subtract.svg')",
      },
      clipPath: {
        'course-clip':
          'path("M0,0 h260 q50,0 50,50 v0 q0,35 35,35 h65 q40,0 40,40 v191 q0,40 -40,40 H40 q-40,0 -40,-40 V40 Q0,0 0,0 Z")',
      },
    },
  },
  plugins: [require('tailwindcss-font-inter')],
};
