// ThemeProvider.js
import React, { useState } from "react";
import ThemeContext from "./ThemeContext";

const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#3498db"); // Default theme color

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
