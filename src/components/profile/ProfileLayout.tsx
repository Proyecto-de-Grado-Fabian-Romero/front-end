// components/profile/ProfileLayout.tsx
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import MessageIcon from "@mui/icons-material/Message";
import { useRouter } from "next/router";

const drawerWidth = 240;

const menuItems = [
  { text: "Perfil", icon: <AccountCircleIcon />, route: "/profile" },
  { text: "Seguridad", icon: <LockIcon />, route: "/profile/security" },
  { text: "Notificaciones", icon: <MessageIcon />, route: "/profile/messages" },
];

type Props = {
  children: React.ReactNode;
};

export default function ProfileLayout({ children }: Props) {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => router.push(item.route)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Mi Perfil
        </Typography>
        {children}
      </Box>
    </Box>
  );
}
