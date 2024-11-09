import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import "./globals.css";
import classNames from "classnames";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Какое-то приложение",
  description: "Don't be so shy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={classNames(
          inter.className,
          "dark:bg-gray-800 dark:text-white",
        )}
      >
        {children}
        <ToastContainer position="top-center" />
      </body>
    </html>
  );
}
