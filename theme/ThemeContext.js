import React from "react";

const ThemeContext = React.createContext({
  themeColor: "#3498db", // Default theme color
  setThemeColor: () => {}, // Function to update the theme color
});

export default ThemeContext;
