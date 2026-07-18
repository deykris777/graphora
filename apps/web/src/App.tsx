import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./app/providers";
import { router } from "./app/router";
import { env } from "./lib/env";

export const App = () => {
  const content = (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );

  if (!env.clerkPublishableKey) {
    return content;
  }

  return <ClerkProvider publishableKey={env.clerkPublishableKey}>{content}</ClerkProvider>;
};
