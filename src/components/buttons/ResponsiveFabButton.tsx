import { useMemo } from "react";
import { Fab, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface ResponsiveFabProps {
  onClick: () => void;
}

const ResponsiveFab: React.FC<ResponsiveFabProps> = ({ onClick }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

  const { bottom, right } = useMemo(() => {
    if (isSmall) {
      return { bottom: 72, right: 16 };
    } else if (isMedium) {
      return { bottom: 52, right: 36 };
    } else if (isLarge) {
      return { bottom: 52, right: "10%" };
    }
    return { bottom: 80, right: 24 };
  }, [isSmall, isMedium, isLarge]);

  return (
    <Fab
      color="primary"
      aria-label="add"
      onClick={onClick}
      size="large"
      sx={{
        position: "fixed",
        bottom: bottom,
        right: right,
      }}
    >
      <AddIcon fontSize="large" />
    </Fab>
  );
};

export default ResponsiveFab;
