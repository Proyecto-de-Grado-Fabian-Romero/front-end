import ChairIcon from "@mui/icons-material/Chair";
import WeekendIcon from "@mui/icons-material/Weekend";
import BedIcon from "@mui/icons-material/Bed";
import DiningIcon from "@mui/icons-material/Restaurant";
import ToiletIcon from "@mui/icons-material/Wc";
import TvIcon from "@mui/icons-material/Tv";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import SinkIcon from "@mui/icons-material/Wash";
import FridgeIcon from "@mui/icons-material/Kitchen";
import BreakfastDiningIcon from "@mui/icons-material/BreakfastDining";
import { JSX } from "react";
import { Cookie } from "@mui/icons-material";

export const OBJECT_ICONS: Record<string, JSX.Element> = {
  "56": <ChairIcon />,
  "57": <WeekendIcon />,
  "59": <BedIcon />,
  "60": <DiningIcon />,
  "61": <ToiletIcon />,
  "62": <TvIcon />,
  "68": <MicrowaveIcon />,
  "69": <Cookie />,
  "70": <BreakfastDiningIcon />,
  "71": <SinkIcon />,
  "72": <FridgeIcon />,
};

export const CLASS_ID_TO_NAME: Record<string, string> = {
  "56": "Silla",
  "57": "Sillón",
  "59": "Cama",
  "60": "Mesa Comedor",
  "61": "Inodoro",
  "62": "TV",
  "68": "Microondas",
  "69": "Horno",
  "70": "Tostadora",
  "71": "Lavaplatos",
  "72": "Refrigerador",
};
