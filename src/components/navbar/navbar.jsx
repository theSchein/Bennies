// components/navbar/navbar.jsx
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
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
import Notifications from "../notifications/notifications";
import Image from "next/image";
import logo from "../../../public/logo.png"; 

const pages = [
    { label: "About", path: "about" },
    { label: "Search NFTs", path: "search" }, // Updated label
];

function Navbar() {
    const { data: session, status } = useSession();
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const authPage = session ? { label: "Profile", path: "profile" } : { label: "Sign In", path: "signin" };
    const allPages = [...pages, authPage];

    return (
        <div className="font-heading bg-light-quaternary dark:bg-dark-quaternary text-light-tertiary dark:text-dark-primary bg-opacity-80">
            <AppBar
                position="static"
                sx={{
                    fontFamily: "font-heading",
                    backgroundColor: "inherit",
                    color: "inherit",
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Link href="/" passHref legacyBehavior>
                            <a>
                                <Box sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }}>
                                    <Image
                                        src={logo}
                                        alt="Bennies Logo"
                                        width={40}
                                        height={40}
                                    />
                                </Box>
                            </a>
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
                                        key={page.label}
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
                                            <Link href={`/${page.path}`} passHref legacyBehavior>
                                                <a style={{ textDecoration: "inherit", color: "inherit" }}>
                                                    {page.label}
                                                </a>
                                            </Link>
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        {/* Desktop menu items */}
                        <Box
                            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
                        >
                            {allPages.map((page) => (
                                <Button
                                    key={page.label}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: "inherit", fontWeight: 700 }}
                                >
                                    <Link href={`/${page.path}`} passHref legacyBehavior>
                                        <a style={{ textDecoration: "none", color: "inherit" }}>
                                            {page.label}
                                        </a>
                                    </Link>
                                </Button>
                            ))}
                        </Box>

                        {/* Notifications Icon */}
                        {status === "authenticated" && <Notifications />}

                        <ThemeToggle />
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}
export default Navbar;