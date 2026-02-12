/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // BLOOM Design System Colors
                'bloom-yellow': '#f5c542',
                'bloom-orange': '#e85a3c',
                'bloom-green': '#22c55e',
                'bloom-purple': '#8b5cf6',
                'bloom-black': '#1a1a1a',
                'bloom-white': '#ffffff',
                'bloom-subtle': '#f8f8f8',
                'bloom-gray': '#e5e5e5',
                'bloom-gray-dark': '#999999',
                'bloom-dim': '#888888',

                // Nested bloom object for compatibility
                bloom: {
                    yellow: '#f5c542',
                    orange: '#e85a3c',
                    green: '#22c55e',
                    purple: '#8b5cf6',
                    black: '#1a1a1a',
                    white: '#ffffff',
                    subtle: '#f8f8f8',
                    gray: '#e5e5e5',
                    'gray-dark': '#999999',
                    dim: '#888888',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                // BLOOM Typography Scale
                'bloom-display': ['48px', { lineHeight: '1.2', letterSpacing: '-1.5px', fontWeight: '700' }],
                'bloom-heading': ['28px', { lineHeight: '1.3', letterSpacing: '-0.5px', fontWeight: '700' }],
                'bloom-subheading': ['18px', { lineHeight: '1.5', fontWeight: '600' }],
                'bloom-pill': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
                'bloom-body': ['13px', { lineHeight: '1.6', fontWeight: '400' }],
                'bloom-label': ['11px', { lineHeight: '1.5', letterSpacing: '1.5px', fontWeight: '600' }],
            },
            boxShadow: {
                'bloom-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'bloom-md': '0 4px 12px rgba(0, 0, 0, 0.15)',
                'bloom-lg': '0 6px 24px rgba(0, 0, 0, 0.2)',
            },
            animation: {
                'pulse-gentle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slideUp 0.2s ease-out',
                'fade-in': 'fadeIn 0.15s ease-out',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(8px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
