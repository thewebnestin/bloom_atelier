import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bloom Atelier | Luxury Floral Design",
  description: "Exquisite floral arrangements and bespoke event design for life's most precious moments.",
};

import { ShopProvider } from "@/core/shop/ShopContext";
import SmoothScroll from "@/core/scroll/SmoothScroll";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ShopProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ShopProvider>
      </body>
    </html>
  );
}
