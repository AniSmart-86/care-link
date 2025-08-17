import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTopButton from "@/components/scrollOnTop";
import AuthWatcher from "@/components/authWatcher";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  
});

export const metadata: Metadata = {
  title: "DocLink",
  description: "HeaalthCare Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>

    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
        >
        <ThemeProvider
         attribute="class" 
         defaultTheme="dark"
         enableSystem
         disableTransitionOnChange>
<Header />
        <main className="min-h-screen">
          {children}
  
        </main>
        <Toaster richColors position={"top-center"}/>
        <AuthWatcher/>
     <ScrollToTopButton/>
        <footer className="bg-muted/50 dark:bg-muted/80 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex items-center justify-center p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} DocLink. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
        </ClerkProvider>
  );
}
