// components/navbar/themeToggle.jsx
// This compoennt handles logic and light styling of the dark and light mode toggle switch

import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, [darkMode]);


    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            localStorage.theme = "dark";
            document.documentElement.classList.add("dark");
        } else {
            localStorage.theme = "light";
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <div>
            <Switch
                checked={!darkMode}
                onChange={toggleTheme}
                classes={{
                    track: 'custom-track',
                    thumb: 'custom-thumb',
                }}
            />
            <WbTwilightIcon classname={`text-light-quaternary dark:text-dark-quaternary `} />
        </div>
    );
};

export default ThemeToggle;
