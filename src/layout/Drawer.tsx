import { useState } from "react";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { routes, type AppRoute } from "../routes";

export const DRAWER_WIDTH = 260;

interface DrawerProps {
  isOpen: boolean;
}

function groupRoutes(allRoutes: AppRoute[]) {
  const ungrouped: AppRoute[] = [];
  const groups = new Map<string, AppRoute[]>();

  for (const route of allRoutes) {
    if (!route.group) {
      ungrouped.push(route);
      continue;
    }
    const existing = groups.get(route.group);
    if (existing) {
      existing.push(route);
    } else {
      groups.set(route.group, [route]);
    }
  }

  return { ungrouped, groups };
}

function RouteItem({ route, indent = false }: { route: AppRoute; indent?: boolean }) {
  const resolvedPath = useResolvedPath(route.path);
  const isActive = useMatch({ path: resolvedPath.pathname, end: route.path === "/" });

  return (
    <ListItemButton
      component={NavLink}
      to={route.path}
      className={isActive ? "Mui-selected" : undefined}
      sx={{ mx: 1, pl: indent ? 3 : 2, borderRadius: 1.5 }}
    >
      <ListItemText primary={route.label} />
    </ListItemButton>
  );
}

function DrawerGroup({ name, groupRoutesList }: { name: string; groupRoutesList: AppRoute[] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <ListItemButton
        onClick={() => setIsExpanded((expanded) => !expanded)}
        sx={{ mx: 1, mt: 1.5, borderRadius: 1.5 }}
      >
        <ListItemText
          primary={name}
          slotProps={{
            primary: {
              sx: {
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "text.primary",
              },
            },
          }}
        />
        {isExpanded ? (
          <ExpandLessIcon fontSize="small" color="action" />
        ) : (
          <ExpandMoreIcon fontSize="small" color="action" />
        )}
      </ListItemButton>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {groupRoutesList.map((route) => (
            <RouteItem key={route.path} route={route} indent />
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default function Drawer({ isOpen }: DrawerProps) {
  const { ungrouped, groups } = groupRoutes(routes);

  return (
    <MuiDrawer
      variant="persistent"
      open={isOpen}
      sx={{
        width: isOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List component="nav" sx={{ px: 0.5, py: 1.5 }}>
        {ungrouped.map((route) => (
          <RouteItem key={route.path} route={route} />
        ))}

        {[...groups.entries()].map(([groupName, groupRoutesList]) => (
          <DrawerGroup key={groupName} name={groupName} groupRoutesList={groupRoutesList} />
        ))}
      </List>
    </MuiDrawer>
  );
}
