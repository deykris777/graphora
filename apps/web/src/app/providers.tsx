import { PropsWithChildren, useEffect } from "react";
import { ThemeProvider } from "./theme";
import { ToastProvider } from "../components/ToastProvider";

export const AppProviders = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    document.body.classList.add("min-h-screen");
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
};
