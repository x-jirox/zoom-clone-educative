import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"
import "@stream-io/video-react-sdk/dist/css/styles.css";
import 'react-datepicker/dist/react-datepicker.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YOOM",
  description: "APP DE REUNIONES VIRTUALES",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <ClerkProvider
        appearance={{
          layout: {
            logoImageUrl: '/icons/yoom-logo.svg',
          },
          variables: {
            colorBackground: '#111827',
            colorText: '#ffffff',
            colorPrimary: '#0E78F9',
            colorInputBackground: '#1e293b',
            colorInputText: '#f1f5f9',
            colorBorder: '#f1f5f9',
            fontFamily: geistSans.style.fontFamily,
          },
          elements: {
            // --- USER BUTTON / PROFILE ---
            userButtonPopoverActionButton__manageAccount: {
              color: '#ffffff',
              '&:hover': { color: '#ffffff' },
            },
            userButtonPopoverActionButton__signOut: {
              color: '#ffffff',
              '&:hover': { color: '#ffffff' },
            },
            // --- LOGIN / SIGNIN ---
            socialButtonsBlockButton: {
              color: '#ffffff',
            },
          },
        }}>
        <body className={`${geistSans.variable} ${geistMono.variable} bg-dark-2 `}>
          {children}
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
