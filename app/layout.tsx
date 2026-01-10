import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "600"],
});

export const metadata: Metadata = {
  title: "De Helen's Taste - Restaurant",
  description:
    "Experience exceptional culinary delights at De Helen's Taste. Order delicious shawarma, protein dishes, drinks, and more. Fast delivery within Lokoja city. Quality food crafted with passion and culinary mastery.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "De Helen's Taste - Restaurant",
    description:
      "Experience exceptional culinary delights at De Helen's Taste. Order delicious shawarma, protein dishes, drinks, and more. Fast delivery within Lokoja city.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "De Helen's Taste Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "De Helen's Taste - Restaurant",
    description:
      "Experience exceptional culinary delights at De Helen's Taste. Order delicious shawarma, protein dishes, drinks, and more.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
