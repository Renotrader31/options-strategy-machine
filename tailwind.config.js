/** @type {import('tailwindcss').Config} */
     2	module.exports = {
     3	  content: [
     4	    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
     5	    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
     6	    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
     7	  ],
     8	  darkMode: 'class',
     9	  theme: {
    10	    extend: {
    11	      colors: {
    12	        primary: {
    13	          50: '#f0f9ff',
    14	          500: '#3b82f6',
    15	          600: '#2563eb',
    16	          700: '#1d4ed8',
    17	        },
    18	        success: '#22c55e',
    19	        warning: '#f59e0b',
    20	        error: '#ef4444',
    21	      },
    22	      animation: {
    23	        'fade-in': 'fadeIn 0.5s ease-in-out',
    24	        'slide-up': 'slideUp 0.3s ease-out',
    25	      },
    26	      keyframes: {
    27	        fadeIn: {
    28	          '0%': { opacity: '0' },
    29	          '100%': { opacity: '1' },
    30	        },
    31	        slideUp: {
    32	          '0%': { transform: 'translateY(10px)', opacity: '0' },
    33	          '100%': { transform: 'translateY(0)', opacity: '1' },
    34	        },
    35	      },
    36	    },
    37	  },
    38	  plugins: [],
    39	}
