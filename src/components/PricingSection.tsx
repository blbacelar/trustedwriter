"use client";

import Link from "next/link";
import { Check, Package, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import SubscribeButton from "@/components/SubscribeButton";
import { useState } from "react";

interface CreditPackage {
  credits: number;
  price: number;
  priceId: string;
}

interface PricingSectionProps {
  hideFreePlan?: boolean;
}

export default function PricingSection({
  hideFreePlan = false,
}: PricingSectionProps) {
  const { t } = useLanguage();

  const creditPackages: CreditPackage[] = [
    {
      credits: 10,
      price: 10,
      priceId: "price_1QV5Mr04BafnFvRo949kW8y5",
    },
    {
      credits: 30,
      price: 25,
      priceId: "price_1QV5Pl04BafnFvRoKHf3V4mu",
    },
    {
      credits: 75,
      price: 50,
      priceId: "price_1QV5Qb04BafnFvRoiLl17ZP3",
    },
  ];

  return (
    <section className="py-4 px-2 sm:py-8 sm:px-4">
      <div className="container mx-auto">
        <div
          data-testid="pricing-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
        >
          {/* Free Plan */}
          {!hideFreePlan && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-center mb-4">
                <Package className="h-12 w-12 text-gray-800" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">
                {t("pricing.free.title")}
              </h3>
              <p className="text-4xl font-bold text-center mb-6">
                $0
                <span className="text-lg text-gray-600">
                  {t("pricing.perMonth")}
                </span>
              </p>
              <ul className="space-y-4 mb-8">
                {(t("pricing.free.features") as unknown as string[]).map(
                  (feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-gray-800 mr-2" />
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>
              <Link href="/sign-up">
                <Button className="w-full" variant="outline">
                  {t("pricing.free.cta")}
                </Button>
              </Link>
            </div>
          )}

          {/* Credit Packages */}
          {creditPackages.map((pkg) => (
            <div
              key={pkg.credits}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
            >
              <div className="flex justify-center mb-3">
                <Package
                  className="h-10 w-10 text-gray-800"
                  data-testid="package-icon"
                />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">
                {pkg.credits} {t("pricing.credits.unit")}
              </h3>
              <p className="text-3xl font-bold text-center mb-4">
                ${pkg.price}
              </p>
              <p className="text-gray-600 text-center text-sm mb-6">
                ${(pkg.price / pkg.credits).toFixed(2)}{" "}
                {t("pricing.credits.perCredit")}
              </p>
              <SubscribeButton
                data-price-id={pkg.priceId}
                priceId={pkg.priceId}
                isCredit={true}
                credits={pkg.credits}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
