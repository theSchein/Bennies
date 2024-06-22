// src/styles/muiTheme.js
import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
    palette: {
        mode: "light", // Default to light mode
        light: {
            primary: '#E1F0DA',
            secondary: '#D4E7C5',
            tertiary: '#BFD8AF',
            quaternary: '#99BC85',
            background: '#99BC85',
            text: {
                primary: '#E1F0DA',
                secondary: '#D4E7C5',
                tertiary: '#BFD8AF',
                quaternary: '#99BC85',
                background: '#99BC85',
                font: '#294B29',
            },
        },
        dark: {
            primary: "#E6E6E6",
            secondary: "#C5A880",
            tertiary: "#532E1C",
            quaternary: "#0F0F0F",
            background: "#0F0F0F",
        },
        text: {
            primary: '#DBE7C9',
            secondary: '#789461',
            tertiary: '#50623A',
            quaternary: '#294B29',
            background: '#294B29',
            font: '#F0E5CF',
        },
    },
    typography: {
        fontFamily: {
            heading: ["Gasoek One", "sans-serif"],
            body: ["Lato", "sans-serif"],
            subheading: ["Comfortaa", "sans-serif"],
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: "12px", // Equivalent to p-3
                    fontWeight: "bold",
                    borderRadius: "9999px", // Equivalent to rounded-full
                    transition: "all 0.3s ease-in-out",
                    // Conditional styles based on theme mode
                    backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                            ? theme.palette.light.primary
                            : theme.palette.dark.primary,
                    color: (theme) =>
                        theme.palette.mode === "light"
                            ? theme.palette.light.quaternary
                            : theme.palette.dark.quaternary,
                    "&:hover": {
                        backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.light.tertiary
                                : theme.palette.dark.tertiary,
                        color: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.light.primary
                                : theme.palette.dark.primary,
                    },
                },
            },
        },
    },
    // Add more theme customization here as needed
});

export default muiTheme;
