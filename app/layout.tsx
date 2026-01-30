import React from "react";
import type { Metadata } from "next";
import Layout from "./page";

export const metadata: Metadata = {
  title: "goMeal",
  description: "Discover & Cook",
  icons: {
    icon: "/gomeal.ico",
    shortcut: "/gomeal.ico",
  },
  openGraph: {
    title: "Discover & Cook",
  },
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <React.StrictMode>
          <Layout />
        </React.StrictMode>
      </body>
    </html>
  );
}
