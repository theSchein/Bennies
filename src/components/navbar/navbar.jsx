import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import DiamondIcon from "@mui/icons-material/Diamond";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu"; // Import the MenuIcon for the hamburger menu
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem"; // Import MenuItem
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useSession } from "next-auth/react";

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
        <AppBar position="static" style={{ background: '#1E2022' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Move the DiamondIcon outside of the Box to be visible on mobile */}
                    <DiamondIcon sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }} />

                    {/* Hamburger menu icon for mobile */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, marginLeft: 'auto' }}>
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
                        >
                            {allPages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" sx={{
                                        fontFamily: "metropolis",
                                        fontWeight: 700,
                                        letterSpacing: ".1rem",
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}>
                                        <a href={`/${page}`} style={{ textDecoration: 'none', color: 'inherit' }}>{page}</a>
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
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;
