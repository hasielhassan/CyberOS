/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cyber: {
                    green: '#00ff41',
                    dark: '#050a05',
                    dim: '#00441b',
                }
            },
            fontFamily: {
                hacker: ['"Share Tech Mono"', 'monospace'],
                code: ['"JetBrains Mono"', 'monospace'],
            },
            animation: {
                'scanline': 'scanline 10s linear infinite',
            },
            keyframes: {
                scanline: {
                    '0%': { bottom: '100%' },
                    '100%': { bottom: '-100%' },
                }
            }
        },
    },
    plugins: [],
}
