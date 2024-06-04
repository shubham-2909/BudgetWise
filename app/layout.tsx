import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs";;
import "./globals.css";
import { RootProviders } from "@/components/RootProviders";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BudgetWise",
  description: "Created by Gandhi Shubham,",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Toaster richColors position="bottom-right" />
          <RootProviders
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
