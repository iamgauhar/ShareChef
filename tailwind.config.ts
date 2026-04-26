import type { Config } from "tailwindcss";

const config: Config = {
    // This is the magic line that makes our custom Light/Dark toggle work!
    darkMode: "class",

    content: [
        // These paths tell Tailwind where to look for your class names.
        // If you are using the 'src' directory:
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

        // If you are NOT using the 'src' directory:
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // You can add custom ShareChef branding colors or fonts here later if you want!
        },
    },
    plugins: [],
};

export default config;