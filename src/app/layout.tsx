import type {Metadata} from "next";
import "./globals.css";
import {cn} from "@/lib/utils";
import Header from "@/components/common/header";
import Aside from "@/components/common/aside";
import {inter} from "./fonts";


export const metadata: Metadata = {
  title: "App ",
  description: "Bộ trò chơi & công cụ",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={cn(
        "min-h-screen overflow-y-auto overflow-x-hidden bg-background overflow-hidden font-sans antialiased",
        inter.variable,
      )}
    >
    <Header/>
    <Aside/>
    {children}
    </body>
    </html>
  );
}
