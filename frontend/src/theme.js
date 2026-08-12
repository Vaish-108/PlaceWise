import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#18C8E8",
      dark: "#10A8C8",
      light: "#5EE8FF",
      contrastText: "#111111",
    },
    secondary: {
      main: "#FFFFFF",
      contrastText: "#111111",
    },
    background: {
      default: "#000000",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#CFCFCF",
      disabled: "#A0A0A0",
    },
    success: {
      main: "#22C55E",
    },
    warning: {
      main: "#F59E0B",
    },
    error: {
      main: "#EF4444",
    },
    divider: "rgba(255,255,255,0.06)",
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 700,
          transition: "all 0.25s ease",
        },
        containedPrimary: {
          backgroundColor: "#18C8E8",
          color: "#111111",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#10A8C8",
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
          },
        },
        outlinedSecondary: {
          borderColor: "#18C8E8",
          color: "#FFFFFF",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(24, 200, 232, 0.14)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          background: "#FFFFFF",
          color: "#111111",
          "& fieldset": {
            borderColor: "rgba(17, 17, 17, 0.12)",
          },
          "&:hover fieldset": {
            borderColor: "#18C8E8",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#18C8E8",
            boxShadow: "0 0 0 3px rgba(24, 200, 232, 0.18)",
          },
        },
        input: {
          color: "#111111",
          "&::placeholder": {
            color: "#6B7280",
            opacity: 1,
          },
        },
      },
    },
  },
});

export default theme;
