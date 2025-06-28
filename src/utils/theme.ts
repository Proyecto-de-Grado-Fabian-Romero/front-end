"use client";
import { createTheme } from "@mui/material/styles";
import { ColorPalette, FONT_FAMILY } from "./constants/ui-constants";

// This is the theme global styles configuration for Material UI components
const theme = createTheme({
  palette: {
    primary: {
      main: ColorPalette.PRIMARY_DEFAULT,
      light: ColorPalette.PRIMARY_ACTION,
      dark: ColorPalette.PRIMARY_HOVER,
    },
    secondary: {
      main: ColorPalette.SECONDARY_DEFAULT,
      light: ColorPalette.SECONDARY_ACTION,
      dark: ColorPalette.SECONDARY_HOVER,
      contrastText: ColorPalette.NEUTRAL_WHITE,
    },
    background: {
      default: ColorPalette.BACKGROUND,
    },
    success: {
      main: ColorPalette.SUCCESS_DEFAULT,
      light: ColorPalette.SECONDARY_ACTION,
      dark: ColorPalette.SECONDARY_HOVER,
    },
    warning: {
      main: ColorPalette.WARNING_DEFAULT,
      light: ColorPalette.WARNING_ACTION,
      dark: ColorPalette.WARNING_HOVER,
    },
    error: {
      main: ColorPalette.ERROR_DEFAULT,
      light: ColorPalette.ERROR_ACTION,
      dark: ColorPalette.ERROR_HOVER,
    },
    info: {
      main: ColorPalette.PRIMARY_DEFAULT,
      light: ColorPalette.PRIMARY_ACTION,
      dark: ColorPalette.PRIMARY_HOVER,
    },
  },
  typography: {
    allVariants: {
      color: ColorPalette.NEUTRAL_BLACK,
      wordWrap: "break-word",
      wordBreak: "break-word",
    },
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    h1: {
      fontFamily: FONT_FAMILY,
      fontSize: "24px",
      fontWeight: 600,
    },
    h2: {
      fontFamily: FONT_FAMILY,
      fontSize: "16px",
      fontWeight: 600,
    },
    h3: {
      fontFamily: FONT_FAMILY,
      fontWeight: 600,
    },
    h4: { fontFamily: FONT_FAMILY, fontWeight: 600 },
    h5: { fontFamily: FONT_FAMILY, fontWeight: 600 },
    h6: { fontFamily: FONT_FAMILY, fontWeight: 600 },
    body1: {
      fontFamily: FONT_FAMILY,
      fontSize: "16px",
      fontWeight: 400,
    },
    body2: {
      fontFamily: FONT_FAMILY,
      fontSize: "14px",
      fontWeight: 300,
    },
    subtitle1: {
      fontFamily: FONT_FAMILY,
      fontSize: "18px",
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: FONT_FAMILY,
      fontSize: "18px",
      fontWeight: 500,
    },
    caption: {
      fontFamily: FONT_FAMILY,
      fontSize: "10.4px",
      fontWeight: 300,
    },
    button: {
      fontFamily: FONT_FAMILY,
      fontSize: "18px",
      fontWeight: 500,
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        disableGutters: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          margin: 0,
          padding: "16px 4%",
          paddingTop: "24px",
          [theme.breakpoints.down("sm")]: {
            padding: "16px 2%",
          },
          [theme.breakpoints.up("md")]: {
            marginTop: 0,
            padding: "16px 5%",
          },
          [theme.breakpoints.up("lg")]: {
            marginTop: 0,
            padding: "24px 5%",
          },
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }),
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "15px",
          boxShadow: "0 0 6px rgba(0, 0, 0, 0.15)",
          background: ColorPalette.NEUTRAL_WHITE,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          maxWidth: "800px",
          paddingLeft: "60px",
          paddingRight: "60px",
          borderRadius: "8px",
          fontWeight: 500,
          [theme.breakpoints.up("xs")]: {
            fontSize: 14,
          },
          [theme.breakpoints.up("md")]: {
            fontSize: 16,
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: 16,
          },
          textTransform: "capitalize",
          "&.MuiButton-contained": {
            backgroundColor: ColorPalette.SECONDARY_DEFAULT,
            color: ColorPalette.NEUTRAL_WHITE,
            "&:hover": {
              backgroundColor: ColorPalette.SECONDARY_HOVER,
            },
          },
          "&.MuiButton-outlined": {
            borderColor: ColorPalette.SECONDARY_DEFAULT,
            color: ColorPalette.SECONDARY_DEFAULT,
            "&:hover": {
              color: ColorPalette.PRIMARY_DEFAULT,
              borderColor: ColorPalette.PRIMARY_DEFAULT,
            },
          },
          "&.MuiButton-text": {
            color: ColorPalette.NEUTRAL_BLACK,
            "&:hover": {
              color: ColorPalette.PRIMARY_DEFAULT,
              textTransform: "underline",
            },
          },
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover": {
            backgroundColor: ColorPalette.SECONDARY_HOVER,
            color: ColorPalette.NEUTRAL_WHITE,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          maxWidth: "800px",
          backgroundColor: ColorPalette.NEUTRAL_WHITE,
          "& .MuiInputLabel-root": {
            backgroundColor: ColorPalette.NEUTRAL_WHITE,
            color: ColorPalette.GREY_DEFAULT,
            fontSize: "16px",
          },
          "& .MuiInputBase-input": {
            backgroundColor: ColorPalette.NEUTRAL_WHITE,
            color: ColorPalette.NEUTRAL_BLACK,
            fontSize: "16px",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: ColorPalette.NEUTRAL_WHITE,
            "& fieldset": {
              borderColor: "none",
            },
            "&:hover fieldset": {
              borderColor: "none",
            },
            "&.Mui-focused fieldset": {
              borderColor: "none",
            },
            "& .MuiInputAdornment-root": {
              paddingLeft: "10px",
              paddingRight: "10px",
            },
          },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: ColorPalette.NEUTRAL_BLACK,
          fontSize: "14px",
          "&.Mui-focused": {
            color: ColorPalette.PRIMARY_HOVER,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: ColorPalette.NEUTRAL_BLACK,
          borderRadius: "15px",
          borderColor: ColorPalette.SECONDARY_DEFAULT,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: ColorPalette.PRIMARY_HOVER,
            },
            "&:hover fieldset": {
              borderColor: ColorPalette.PRIMARY_HOVER,
            },
            "&.Mui-focused fieldset": {
              borderColor: ColorPalette.PRIMARY_HOVER,
              backgroundColor: ColorPalette.BACKGROUND,
            },
            "& .MuiInputBase-input": {
              color: ColorPalette.NEUTRAL_BLACK,
            },
          },
        },
        icon: {
          color: ColorPalette.PRIMARY_DEFAULT,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: ColorPalette.NEUTRAL_BLACK,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: ColorPalette.PRIMARY_HOVER,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: ColorPalette.PRIMARY_HOVER,
          },
          "& .MuiInputBase-input": {
            color: ColorPalette.NEUTRAL_BLACK,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: ColorPalette.BACKGROUND,
          color: ColorPalette.NEUTRAL_BLACK,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        },
        head: {
          fontWeight: 600,
          backgroundColor: ColorPalette.BACKGROUND,
          color: ColorPalette.NEUTRAL_BLACK,
        },
        body: {
          color: ColorPalette.NEUTRAL_BLACK,
          fontSize: 18,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
        toolbar: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
        actions: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
        selectIcon: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
        select: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
        input: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: ColorPalette.BACKGROUND,
          color: ColorPalette.PRIMARY_DEFAULT,
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: ColorPalette.BACKGROUND,
          color: ColorPalette.NEUTRAL_BLACK,
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          backgroundColor: ColorPalette.BACKGROUND,
          color: ColorPalette.NEUTRAL_BLACK,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: ColorPalette.PRIMARY_DEFAULT,
          color: ColorPalette.NEUTRAL_WHITE,
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            backgroundColor: ColorPalette.BACKGROUND,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: ColorPalette.PRIMARY_DEFAULT,
          color: ColorPalette.NEUTRAL_WHITE,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: ColorPalette.BACKGROUND,
          color: ColorPalette.NEUTRAL_BLACK,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          color: ColorPalette.NEUTRAL_BLACK,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: ColorPalette.NEUTRAL_BLACK,
          backgroundColor: ColorPalette.BACKGROUND,
          borderRadius: 16,
          "&.Mui-selected": {
            backgroundColor: ColorPalette.SECONDARY_DEFAULT,
            color: ColorPalette.NEUTRAL_WHITE,
          },
          "&:hover": {
            backgroundColor: ColorPalette.PRIMARY_ACTION,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: ColorPalette.PRIMARY_HOVER + " !important",
          textDecoration: "none",
          cursor: "pointer",
          "&:hover": {
            color: ColorPalette.PRIMARY_ACTION,
            textDecoration: "underline",
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          "& .Mui-selected": {
            color: ColorPalette.SECONDARY_DEFAULT,
          },
          "& .MuiBottomNavigationAction-root": {
            color: ColorPalette.GREY_DEFAULT,
          },
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: ColorPalette.PRIMARY_DEFAULT,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "16px",
          paddingRight: "6px",
          paddingLeft: "6px",
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.25)",
          background: ColorPalette.NEUTRAL_WHITE,
        },
      },
    },
  },
});

export default theme;
