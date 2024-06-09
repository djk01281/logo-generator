import "~/styles/globals.css";
import { Montserrat } from "next/font/google";

import {
  Inter,
  Just_Another_Hand,
  Bricolage_Grotesque,
  Paytone_One,
  Modak,
} from "next/font/google";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "../trpc/react";
import { NextAuthProvider } from "./providers";
import Navbar from "./_components/Navbar";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

const paytone = Paytone_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-paytone_one",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const modak = Modak({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-modak",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage_grotesque",
});

const just = Just_Another_Hand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-just_another_hand",
});

export const metadata = {
  title: "LogoAI",
  description: "logo-ai",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={` ${GeistMono.className} ${GeistSans.className} ${GeistSans.className} ${montserrat.className} ${GeistMono.className} ${paytone.variable} ${inter.variable} ${bricolage.variable} ${just.variable}  ${montserrat.variable}`}
    >
      <body className={`font-mono`}>
        <TRPCReactProvider>
          <NextAuthProvider>
            <main>{children}</main>
          </NextAuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
