/**
 * SENTIPAE DESIGN TOKENS
 * Valores semânticos compartilhados pela interface e pelos componentes de dados.
 * As variáveis CSS em src/index.css são a fonte de verdade para os temas.
 */
export const designTokens = {
  colors: {
    brand: {
      indigo: {
        light: "#7C83D8",
        DEFAULT: "#5865A8",
        dark: "#394477",
      },
      green: {
        light: "#5BD2B9",
        DEFAULT: "#0F766E",
        dark: "#115E59",
      },
      red: {
        light: "#FB7185",
        DEFAULT: "#DC5252",
        dark: "#B91C1C",
      },
      violet: {
        light: "#A78BFA",
        DEFAULT: "#7C3AED",
        dark: "#5B21B6",
      },
      cyan: {
        light: "#67E8F9",
        DEFAULT: "#0891B2",
        dark: "#155E75",
      },
      amber: {
        light: "#FCD34D",
        DEFAULT: "#D97706",
        dark: "#92400E",
      },
    },
    light: {
      bg: "#F4F7F6",
      dark: "#EAF1EE",
      slate: "#FFFFFF",
      text: "#172B27",
      textSecondary: "#52645F",
      textTertiary: "#71827D",
      border: "#E4ECE9",
    },
    dark: {
      bg: "#0B1514",
      dark: "#142321",
      slate: "#111F1D",
      text: "#E8F3EF",
      textSecondary: "#B7C7C1",
      textTertiary: "#9AACA6",
      border: "rgba(226, 245, 239, 0.10)",
    },
  },
  typography: {
    fonts: {
      sans: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
      serif: '"Poppins", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      xxl: "1.5rem",
      display: "2rem",
      hero: "3rem",
    },
    weights: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      black: "900",
    },
  },
  spacing: {
    safe: {
      top: "env(safe-area-inset-top)",
      bottom: "env(safe-area-inset-bottom)",
    },
    container: {
      paddingMobile: "1rem",
      paddingDesktop: "2rem",
      maxWidth: "1280px",
    },
    radius: {
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      xxl: "2.5rem",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    },
  },
} as const;

export function getBrandColor(colorKey: "indigo" | "green" | "red", mode: "light" | "dark" = "light") {
  const palette = designTokens.colors.brand[colorKey];
  return mode === "light" ? palette.light : palette.dark;
}
