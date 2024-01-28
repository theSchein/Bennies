// components/navbar/navbar.jsx
// This component handles the logic and presentation for the navbar.
// Most of this was ripped form mui docs and modified to fit our needs.

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import DiamondIcon from "@mui/icons-material/Diamond";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu"; 
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem"; 
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useSession } from "next-auth/react";
import ThemeToggle from "./themeToggle";
import Link from "next/link";

const pages = ["pitchdeck", "search"];

function Navbar() {
    const { data: session } = useSession();
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const authPage = session ? "profile" : "signin";
    const allPages = [...pages, authPage];

    return (
        <AppBar
            position="static"
            className=" font-heading bg-light-quaternary dark:bg-dark-quaternary text-light-tertiary dark:text-dark-primary  !important bg-opacity-80"
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link href="/">
                        <DiamondIcon
                            sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }}
                        />
                    </Link>

                    {/* Hamburger menu icon for mobile */}
                    <Box
                        sx={{
                            display: { xs: "flex", md: "none" },
                            marginLeft: "auto",
                        }}
            
                    >
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            className="opacity-70 hover:opacity-100"

                        >
                            {allPages.map((page) => (
                                <MenuItem
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                >
                                    <Typography
                                        className="uppercase text-light-quaternary dark:text-dark-quaternary"
                                        textAlign="center"
                                        sx={{
                                            fontWeight: 700,
                                            letterSpacing: ".1rem",
                                            textDecoration: "inherit",
                                        }}
                                    >
                                        <a
                                            href={`/${page}`}
                                            style={{
                                                textDecoration: "inherit",
                                                color: "inherit",
                                            }}
                                        >
                                            {page}
                                        </a>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Desktop menu items */}
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {allPages.map((page) => (
                            <Button
                                href={`/${page}`}
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: "inherit",
                                    fontWeight: 700,}}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <ThemeToggle />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;
