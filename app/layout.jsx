import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../redux/Providers";
import AuthInitializer from "@/components/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Study Bazaar",
  description: "Study Bazaar is your one-stop platform for buying, selling, and sharing study resources with students.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          <AuthInitializer>
          {children}
          </AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}
