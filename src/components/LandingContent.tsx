"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Clock, Trophy } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LandingContent() {
  const { t } = useLanguage();

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
          <div className="absolute inset-0 bg-white/10" />
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
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="bg-[#00B5B4] hover:bg-[#00A3A2] text-white font-medium shadow-xl"
              >
                {t("hero.cta")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Sparkles className="h-12 w-12 text-[#00B5B4]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("features.ai.title")}</h3>
              <p className="text-gray-600">{t("features.ai.description")}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Clock className="h-12 w-12 text-[#00B5B4]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("features.time.title")}</h3>
              <p className="text-gray-600">{t("features.time.description")}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Trophy className="h-12 w-12 text-[#00B5B4]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("features.success.title")}</h3>
              <p className="text-gray-600">{t("features.success.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("pricing.title")}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">{t("pricing.free.title")}</h3>
              <p className="text-4xl font-bold mb-6">
                $0<span className="text-lg text-gray-600">/month</span>
              </p>
              <ul className="space-y-4 mb-8">
                {(t("pricing.free.features") as unknown as string[]).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-[#00B5B4] mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="w-full" variant="outline">
                  {t("pricing.free.cta")}
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#00B5B4] relative">
              <div className="absolute top-0 right-0 bg-[#00B5B4] text-white px-3 py-1 text-sm rounded-bl-lg">
                {t("pricing.pro.popular")}
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("pricing.pro.title")}</h3>
              <p className="text-4xl font-bold mb-6">
                $9<span className="text-lg text-gray-600">/month</span>
              </p>
              <ul className="space-y-4 mb-8">
                {(t("pricing.pro.features") as unknown as string[]).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-[#00B5B4] mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="w-full bg-[#00B5B4] hover:bg-[#00A3A2]">
                  {t("pricing.pro.cta")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{t("cta.title")}</h2>
          <Link href="/sign-up">
            <Button size="lg" className="bg-[#00B5B4] hover:bg-[#00A3A2]">
              {t("cta.button")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 