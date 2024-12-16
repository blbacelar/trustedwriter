import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster as SonnerToaster } from 'sonner';
import { CreditsProvider } from "@/contexts/CreditsContext";
import { TutorialProvider } from "@/contexts/TutorialContext";
import Tutorial from "@/components/Tutorial";
import { OpenAIStatusProvider } from "@/contexts/OpenAIStatusContext";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <OpenAIStatusProvider>
          <ClerkProvider dynamic>
            <LanguageProvider>
              <TutorialProvider>
                <CreditsProvider>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Tutorial />
                      {children}
                    </main>
                    <Footer />
                    <Toaster />
                    <SonnerToaster position="top-center" />
                  </div>
                </CreditsProvider>
              </TutorialProvider>
            </LanguageProvider>
          </ClerkProvider>
        </OpenAIStatusProvider>
      </body>
    </html>
  );
}
