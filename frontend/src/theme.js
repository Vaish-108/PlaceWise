import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00E5FF",
      dark: "#00C8E6",
      light: "#4DEEFF",
      contrastText: "#000000",
    },
    secondary: {
      main: "#FFFFFF",
      contrastText: "#000000",
    },
    background: {
      default: "#000000",
      paper: "#171717",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#CFCFCF",
      disabled: "#9A9A9A",
    },
    success: {
      main: "#22C55E",
    },
    warning: {
      main: "#FACC15",
    },
    error: {
      main: "#EF4444",
    },
    divider: "#2C2C2C",
  },
  shape: {
    borderRadius: 16,
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
          transition: "all 0.2s ease",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #2C2C2C",
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
          background: "#111111",
          color: "#FFFFFF",
          "& fieldset": {
            borderColor: "#2C2C2C",
          },
          "&:hover fieldset": {
            borderColor: "#00E5FF",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#00E5FF",
            boxShadow: "0 0 0 3px rgba(0,229,255,0.12)",
          },
        },
        input: {
          color: "#FFFFFF",
          "&::placeholder": {
            color: "#9A9A9A",
            opacity: 1,
          },
        },
      },
    },
  },
});

export default theme;
