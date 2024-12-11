import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster as SonnerToaster } from 'sonner';
import { CreditsProvider } from "@/contexts/CreditsContext";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TrustedWriter - AI-Powered House Sitting Applications",
  description: "Generate personalized house-sitting applications with AI",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <LanguageProvider>
        <CreditsProvider>
          <html lang="en">
            <body className={inter.className}>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
                <Toaster />
                <SonnerToaster position="top-center" />
              </div>
            </body>
          </html>
        </CreditsProvider>
      </LanguageProvider>
    </ClerkProvider>
  );
}
