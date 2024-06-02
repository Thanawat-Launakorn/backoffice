import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "red",
    secondary: "#6c757d",
    // ... other colors
  },
  fonts: {
    heading: "Inter",
    body: "Roboto",
    // ... other fonts
  },
  // ... other theme customizations
});

export default theme;
