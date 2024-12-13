"use client";

import Link from "next/link";
import { Check, Package, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import SubscribeButton from "@/components/SubscribeButton";
import { useState } from "react";

type ViewMode = 'subscriptions' | 'credits';

interface CreditPackage {
  credits: number;
  price: number;
  priceId: string;
}

export default function PricingSection() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('subscriptions');

  const proPricing = {
    monthly: {
      price: 9,
      priceId: 'price_1QSQRc04BafnFvRoRYz7KNbx'
    },
    annual: {
      price: 90,
      priceId: 'price_1QV5Ga04BafnFvRooTjkoZun'
    }
  };

  const creditPackages: CreditPackage[] = [
    {
      credits: 10,
      price: 10,
      priceId: 'price_1QV5Mr04BafnFvRo949kW8y5'
    },
    {
      credits: 30,
      price: 25,
      priceId: 'price_1QV5Pl04BafnFvRoKHf3V4mu'
    },
    {
      credits: 75,
      price: 50,
      priceId: 'price_1QV5Qb04BafnFvRoiLl17ZP3'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">{t("pricing.title")}</h2>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('subscriptions')}
            className={`px-6 py-2 rounded-full transition-all ${
              viewMode === 'subscriptions' 
                ? 'bg-[#00B5B4] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t("pricing.subscriptions")}
          </button>
          <button
            onClick={() => setViewMode('credits')}
            className={`px-6 py-2 rounded-full transition-all ${
              viewMode === 'credits' 
                ? 'bg-[#00B5B4] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t("pricing.credits.title")}
          </button>
        </div>

        {viewMode === 'subscriptions' && (
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-center mb-4">
                <Package className="h-12 w-12 text-[#00B5B4]" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">{t("pricing.free.title")}</h3>
              <p className="text-4xl font-bold text-center mb-6">
                $0<span className="text-lg text-gray-600">{t("pricing.perMonth")}</span>
              </p>
              <ul className="space-y-4 mb-8">
                {(t("pricing.free.features") as unknown as string[]).map((feature, index) => (
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

            {/* Annual Pro Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#00B5B4] relative transform scale-105">
              <div className="absolute top-0 right-0 bg-[#00B5B4] text-white px-3 py-1 text-sm rounded-bl-lg">
                {t("pricing.pro.popular")}
              </div>
              <div className="flex justify-center mb-4">
                <Infinity className="h-12 w-12 text-[#00B5B4]" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">{t("pricing.pro.title")}</h3>
              <div className="text-center mb-2">
                <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                  {t("pricing.saveUpTo")} 17%
                </span>
              </div>
              <p className="text-4xl font-bold text-center mb-6">
                ${proPricing.annual.price}
                <span className="text-lg text-gray-600">{t("pricing.perYear")}</span>
              </p>
              <ul className="space-y-4 mb-8">
                {(t("pricing.pro.features") as unknown as string[]).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-[#00B5B4] mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <SubscribeButton 
                period="annual"
                priceId={proPricing.annual.priceId}
              />
            </div>

            {/* Monthly Pro Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-center mb-4">
                <Infinity className="h-12 w-12 text-[#00B5B4]" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">{t("pricing.pro.title")}</h3>
              <p className="text-4xl font-bold text-center mb-6">
                ${proPricing.monthly.price}
                <span className="text-lg text-gray-600">{t("pricing.perMonth")}</span>
              </p>
              <ul className="space-y-4 mb-8">
                {(t("pricing.pro.features") as unknown as string[]).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-[#00B5B4] mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <SubscribeButton 
                period="monthly"
                priceId={proPricing.monthly.priceId}
              />
            </div>
          </div>
        )}

        {viewMode === 'credits' && (
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {creditPackages.map((pkg) => (
              <div key={pkg.credits} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-center mb-4">
                  <Package className="h-12 w-12 text-[#00B5B4]" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  {pkg.credits} {t("pricing.credits.unit")}
                </h3>
                <p className="text-4xl font-bold text-center mb-6">
                  ${pkg.price}
                </p>
                <p className="text-gray-600 text-center mb-8">
                  ${(pkg.price / pkg.credits).toFixed(2)} {t("pricing.credits.perCredit")}
                </p>
                <SubscribeButton 
                  priceId={pkg.priceId}
                  isCredit
                  credits={pkg.credits}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 