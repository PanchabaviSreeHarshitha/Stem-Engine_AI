/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: 'var(--brand-dark, #0f172a)',
                    surface: 'var(--brand-surface, #1e293b)',
                    accent: 'var(--brand-accent, #3b82f6)',
                    text: 'var(--brand-text, #f8fafc)',
                    muted: 'var(--brand-muted, #94a3b8)'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
