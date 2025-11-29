import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ChartRegistry from "@/components/charts/ChartRegistry";

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Guro Researcher Hub",
  description: "Research Hub for Guro Hospital",
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
          "min-h-screen bg-slate-50 font-sans antialiased",
          notoSansKr.variable
        )}
      >
        <ChartRegistry />
        {children}
      </body>
    </html>
  );
}
