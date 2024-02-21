// components/navbar/themeToggle.jsx
// This compoennt handles logic and light styling of the dark and light mode toggle switch

import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import { useTheme } from "@mui/material/styles";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);
    const theme = useTheme();

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
                sx={{
                    '& .MuiSwitch-track': {
                        backgroundColor: darkMode ? theme.palette.dark.secondary : theme.palette.light.secondary, // Custom track color
                    },
                    '& .MuiSwitch-thumb': {
                        backgroundColor: darkMode ? theme.palette.dark.primary : theme.palette.light.tertiary, // Custom thumb color
                    },
                }}
            />
            <WbTwilightIcon
                sx={{
                    color: darkMode ? theme.palette.dark.primary : theme.palette.light.secondary,
                }}
            />
        </div>
    );
};

export default ThemeToggle;
