"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Clock, Trophy } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import SubscribeButton from "@/components/SubscribeButton";
import PricingSection from "@/components/PricingSection";
import { usePathname } from "next/navigation";

export default function LandingContent() {
  const pathname = usePathname();
  const { t, language } = useLanguage();

  console.log("Current language in LandingContent:", language);

  const handleSignUpClick = (e: React.MouseEvent) => {
    // Only handle scroll if we're on the landing page
    if (pathname === "/") {
      e.preventDefault();
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing-hero.jpg"
            alt="Landing Hero"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-20 w-full px-6 md:px-20 py-32">
          <div className="max-w-3xl mx-auto text-center mt-32">
            <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              {t("hero.title")}
            </h1>
            <p className="text-xl mb-8 text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {t("hero.subtitle")}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleSignUpClick}
                className="bg-gray-800 hover:bg-gray-900 text-white font-medium shadow-xl"
              >
                {t("hero.cta")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Sparkles className="h-12 w-12 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t("features.ai.title")}
              </h3>
              <p className="text-gray-600">{t("features.ai.description")}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Clock className="h-12 w-12 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t("features.time.title")}
              </h3>
              <p className="text-gray-600">{t("features.time.description")}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Trophy className="h-12 w-12 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t("features.success.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.success.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <PricingSection />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{t("cta.title")}</h2>
          <Link href="/sign-up">
            <Button size="lg" className="bg-gray-800 hover:bg-gray-900">
              {t("cta.button")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
