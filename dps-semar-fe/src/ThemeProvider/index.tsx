import { useMantineTheme } from "@mantine/core";
import React, { ReactNode, useEffect } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useMantineTheme();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--color-gray-border",
      theme.colors.gray[1],
    );
    document.documentElement.style.setProperty(
      "--color-gray-lines",
      theme.colors.gray[2],
    );
    document.documentElement.style.setProperty(
      "--color-gray-dark-lines",
      theme.colors.gray[3],
    );
    document.documentElement.style.setProperty(
      "--color-black",
      theme.colors.black[0],
    );

    document.documentElement.style.setProperty(
      "--color-gray",
      theme.colors.gray[0],
    );
    document.documentElement.style.setProperty(
      "--color-black",
      theme.colors.black[0],
    );
    document.documentElement.style.setProperty(
      "--color-blue",
      theme.colors.brand[0],
    );
    document.documentElement.style.setProperty(
      "--color-light-blue",
      theme.colors.brand[1],
    );
    document.documentElement.style.setProperty(
      "--color-green",
      theme.colors.green[0],
    );
    document.documentElement.style.setProperty(
      "--color-green-light",
      theme.colors.green[1],
    );
    document.documentElement.style.setProperty(
      "--color-white",
      theme.colors.white[0],
    );
    document.documentElement.style.setProperty(
      "--color-white-dim",
      theme.colors.white[1],
    );
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
