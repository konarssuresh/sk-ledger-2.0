"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "@/store";
import { themeSelector } from "@/store/userPreferenceSlice";
import { applyDocumentTheme } from "@/lib/applyDocumentTheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemeSync({ children }) {
  const theme = useSelector(themeSelector);

  useEffect(() => {
    applyDocumentTheme(theme);
  }, [theme]);

  return children;
}

function GoogleClientIdDevBanner() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      role="alert"
      className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950"
    >
      Google Sign-In is not configured. Set{" "}
      <code className="font-mono text-xs">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>{" "}
      in <code className="font-mono text-xs">.env.local</code> (same value as{" "}
      <code className="font-mono text-xs">OAUTH_CLIENT</code>), then restart{" "}
      <code className="font-mono text-xs">next dev</code> or run{" "}
      <code className="font-mono text-xs">npm run build</code> before{" "}
      <code className="font-mono text-xs">next start</code>.
    </div>
  );
}

export default function AppProviders({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {!googleClientId ? (
          <>
            <GoogleClientIdDevBanner />
            <ThemeSync>{children}</ThemeSync>
          </>
        ) : (
          <GoogleOAuthProvider clientId={googleClientId}>
            <ThemeSync>{children}</ThemeSync>
          </GoogleOAuthProvider>
        )}
      </QueryClientProvider>
    </Provider>
  );
}
