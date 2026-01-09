import type { Metadata } from "next";
import { Poppins} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "600"],
});



export const metadata: Metadata = {
  title: "De Helen's Taste - Restaurant",
  description: "Delicious meals and drinks at De Helen's Taste",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
