import React from "react";
import { ThemeProvider } from "./theme-provider";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ThemeProvider
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
        attribute={"class"}>
        {children}
      </ThemeProvider>
    </div>
  );
};
