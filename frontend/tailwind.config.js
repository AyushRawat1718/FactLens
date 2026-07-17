/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E14",
        surface: "#12161F",
        surface2: "#171C27",
        line: "#1E2430",
        cream: "#F3F1EA",
        muted: "#8B93A3",
        teal: "#4FD1C5",
        coral: "#E0645A",
        amber: "#E3A23C",
        slate: "#6C8CB0",
        grey: "#4A5162",
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        flFloat: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        flPulse: { "0%,100%": { opacity: 0.45 }, "50%": { opacity: 1 } },
        flSpin: { to: { transform: "rotate(360deg)" } },
        flSpinRev: { to: { transform: "rotate(-360deg)" } },
        flMarquee: { to: { transform: "translateX(-50%)" } },
        flFlow: {
          "0%": { transform: "translateY(-10%)", opacity: 0 },
          "15%": { opacity: 1 },
          "90%": { opacity: 1 },
          "100%": { transform: "translateY(110%)", opacity: 0 },
        },
      },
      animation: {
        float: "flFloat 4.5s ease-in-out infinite",
        "pulse-slow": "flPulse 3s ease-in-out infinite",
        "spin-slow": "flSpin 20s linear infinite",
        "spin-slow-rev": "flSpinRev 28s linear infinite",
        marquee: "flMarquee 26s linear infinite",
        flow: "flFlow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
