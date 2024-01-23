// components/navbar/themeToggle.jsx
// This compoennt handles logic and light styling of the dark and light mode toggle switch

import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";

const ThemeToggle = () => {

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check for theme preference in localStorage or system preference
        const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
        const prefersDark = savedTheme 
            ? savedTheme === 'dark' 
            : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        setDarkMode(prefersDark);

        // Update the localStorage and document class
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', prefersDark);
    }, []);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', !darkMode);
    };

    return (
        <div>
            <Switch
                checked={!darkMode}
                onChange={toggleTheme}
                classes={{
                    track: "custom-track",
                    thumb: "custom-thumb",
                }}
            />
            <WbTwilightIcon
                classname={`text-light-quaternary dark:text-dark-quaternary `}
            />
        </div>
    );
};

export default ThemeToggle;
