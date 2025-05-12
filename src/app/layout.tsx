import type { Metadata } from "next";
import "./globals.css";
import TRPCProvider from "@/components/layouts/trpcProvider";
import { URL_LOGO } from "@/constants";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Vazzuniverse - Top up terpercaya se-universe",
  description: " %s | Vazzuniverse - Top up terpercaya se-universe",
  icons: {
    icon: URL_LOGO,
  },
  twitter: {
    site: "Top Up Terpecaya se-Universe",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href={URL_LOGO || "/favicon.ico"} sizes="any" />
      <TRPCProvider>
        <body className={``}>
          {children}
          <Toaster />
        </body>
      </TRPCProvider>
    </html>
  );
}
