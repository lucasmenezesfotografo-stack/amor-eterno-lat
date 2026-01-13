import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '1.5rem',
  		screens: {
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: [
  				'Montserrat',
  				'ui-sans-serif',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'Noto Sans',
  				'sans-serif'
  			],
  			serif: [
  				'Cormorant Garamond',
  				'ui-serif',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			script: [
  				'Great Vibes',
  				'cursive'
  			],
  			display: [
  				'Cormorant Garamond',
  				'Georgia',
  				'serif'
  			],
  			romantic: [
  				'Great Vibes',
  				'cursive'
  			],
  			'playfair': [
  				'Playfair Display',
  				'Georgia',
  				'serif'
  			],
  			'dancing': [
  				'Dancing Script',
  				'cursive'
  			],
  			'pinyon': [
  				'Pinyon Script',
  				'cursive'
  			],
  			'tangerine': [
  				'Tangerine',
  				'cursive'
  			],
  			'alex-brush': [
  				'Alex Brush',
  				'cursive'
  			],
  			'parisienne': [
  				'Parisienne',
  				'cursive'
  			],
  			'sacramento': [
  				'Sacramento',
  				'cursive'
  			],
  			'allura': [
  				'Allura',
  				'cursive'
  			],
  			mono: [
  				'IBM Plex Mono',
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			paper: {
  				DEFAULT: 'hsl(var(--paper))',
  				warm: 'hsl(var(--paper-warm))',
  				cream: 'hsl(var(--paper-cream))'
  			},
  			romantic: {
  				rose: 'hsl(var(--romantic-rose))',
  				blush: 'hsl(var(--romantic-blush))',
  				soft: 'hsl(var(--romantic-soft))'
  			},
  			gold: {
  				DEFAULT: 'hsl(var(--gold))',
  				soft: 'hsl(var(--gold-soft))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			cherry: {
  				DEFAULT: 'hsl(var(--cherry))',
  				light: 'hsl(var(--cherry-light))',
  				dark: 'hsl(var(--cherry-dark))'
  			},
  			midnight: {
  				DEFAULT: 'hsl(var(--midnight))',
  				card: 'hsl(var(--midnight-card))',
  				elevated: 'hsl(var(--midnight-elevated))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'2xl': '1rem',
  			'3xl': '1.5rem'
  		},
  		boxShadow: {
  			soft: 'var(--shadow-soft)',
  			cherry: 'var(--shadow-cherry)',
  			elevated: 'var(--shadow-elevated)',
  			glass: 'var(--shadow-glass)',
  			glow: 'var(--shadow-glow)',
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-in-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(30px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.95)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-20px)'
  				}
  			},
  			heartbeat: {
  				'0%, 100%': {
  					transform: 'scale(1)'
  				},
  				'50%': {
  					transform: 'scale(1.15)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			'slide-in-right': {
  				'0%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			'card-entrance': {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.9) translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1) translateY(0)'
  				}
  			},
  			'card-entrance-stagger': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(30px) rotate(-2deg)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0) rotate(0deg)'
  				}
  			},
  			'float-gentle': {
  				'0%, 100%': {
  					transform: 'translateY(0px) rotate(0deg)'
  				},
  				'50%': {
  					transform: 'translateY(-8px) rotate(1deg)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
  			'fade-in': 'fade-in 0.5s ease-out forwards',
  			'scale-in': 'scale-in 0.4s ease-out forwards',
  			float: 'float 6s ease-in-out infinite',
  			heartbeat: 'heartbeat 1.5s ease-in-out infinite',
  			shimmer: 'shimmer 2s linear infinite',
  			'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
  			'card-entrance': 'card-entrance 0.6s ease-out forwards',
  			'card-entrance-stagger': 'card-entrance-stagger 0.7s ease-out forwards',
  			'float-gentle': 'float-gentle 4s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;