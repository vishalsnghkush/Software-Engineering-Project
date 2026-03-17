import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope-thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-extrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "SE Project",
  description: "Software Engineering Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>{children}</body>
    </html>
  );
}
