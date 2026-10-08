import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer, { DRAWER_WIDTH } from "./Drawer";

export default function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          width: isDrawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
          ml: isDrawerOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setIsDrawerOpen((open) => !open)}
            aria-label={isDrawerOpen ? "Close navigation" : "Open navigation"}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            React AI Practice Playground
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer isOpen={isDrawerOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          minWidth: 0,
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
