import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#10243E",
        ink: "#1E293B",
        steel: "#496579",
        mist: "#EEF3F7",
        line: "#D9E2EA"
      },
      boxShadow: {
        workbench: "0 18px 50px rgba(16, 36, 62, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
