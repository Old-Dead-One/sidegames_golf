/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#66d3fa",
          light: "#b2d12e",
          dark: "#b2d12e",
        },
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      const tooltip = {
        ".tooltip": {
          position: "relative",
          display: "inline-block",
          cursor: "pointer",
        },
        ".tooltip::after": {
          content: "attr(data-tooltip)",
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#1f61f7",
          color: "#fff",
          padding: "0.5rem",
          borderRadius: "0.25rem",
          whiteSpace: "nowrap",
          zIndex: "999",
          opacity: "0",
          transition: "opacity 0.2s ease-in-out",
        },
        ".tooltip:hover::after": {
          opacity: "1",
          PointerEvents: "Auto",
        },
      };

      addComponents(tooltip);
    },
    require("@tailwindcss/forms"),
  ],
};
