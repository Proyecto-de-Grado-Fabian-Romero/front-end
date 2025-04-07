import {
  CalendarToday,
  Notifications,
  Person,
  Search,
  Key,
  MonetizationOn,
  Vrpano,
  Book,
} from "@mui/icons-material";
import { UserType } from "./user-constants";
import { PageRoutes } from "./page-routes";

const NAV_ITEMS = {
  Explora: {
    label: "Explora",
    icon: <Search />,
    to: PageRoutes.Home,
  },
  Reservas: {
    label: "Reservas",
    icon: <Book />,
    to: PageRoutes.Booking,
  },
  Notificaciones: {
    label: "Notificaciones",
    icon: <Notifications />,
    to: PageRoutes.Notifications,
  },
  Perfil: {
    label: "Perfil",
    icon: <Person />,
    to: PageRoutes.Profile,
  },
  Ambientes: {
    label: "Mis Ambientes",
    icon: <Key />,
    to: PageRoutes.Owner_Environments,
  },
  Calendario: {
    label: "Calendario",
    icon: <CalendarToday />,
    to: PageRoutes.Calendar,
  },
  Capturas: {
    label: "Capturas",
    icon: <Vrpano />,
    to: PageRoutes.Shots_360,
  },
  Deudas: {
    label: "Deudas",
    icon: <MonetizationOn />,
    to: PageRoutes.Debts,
  },
};

export const NAV_CONFIGS: Record<
  string,
  {
    label: string;
    icon: React.ReactElement;
    to: PageRoutes;
    showInHeader: boolean;
    showInBottomNav: boolean;
  }[]
> = {
  [UserType.UNLOGGED]: [
    { ...NAV_ITEMS.Explora, showInHeader: false, showInBottomNav: true },
    { ...NAV_ITEMS.Reservas, showInHeader: false, showInBottomNav: true },
    { ...NAV_ITEMS.Notificaciones, showInHeader: false, showInBottomNav: true },
    { ...NAV_ITEMS.Perfil, showInHeader: false, showInBottomNav: true },
  ],
  [UserType.RENTER]: [
    { ...NAV_ITEMS.Explora, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Reservas, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Notificaciones, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Perfil, showInHeader: true, showInBottomNav: true },
  ],
  [UserType.OWNER]: [
    { ...NAV_ITEMS.Reservas, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Ambientes, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Explora, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Calendario, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Notificaciones, showInHeader: true, showInBottomNav: false },
    { ...NAV_ITEMS.Perfil, showInHeader: true, showInBottomNav: true },
  ],
  [UserType.ADMIN]: [
    { ...NAV_ITEMS.Capturas, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Calendario, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Deudas, showInHeader: true, showInBottomNav: true },
    { ...NAV_ITEMS.Notificaciones, showInHeader: true, showInBottomNav: false },
    { ...NAV_ITEMS.Perfil, showInHeader: true, showInBottomNav: true },
  ],
};

export const getHeaderNavItems = (userType: string) => {
  return NAV_CONFIGS[userType]?.filter((item) => item.showInHeader) || [];
};

export const getBottomNavItems = (userType: string) => {
  return NAV_CONFIGS[userType]?.filter((item) => item.showInBottomNav) || [];
};
