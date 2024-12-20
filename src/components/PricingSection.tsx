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
      priceId: "price_1QYAEo04BafnFvRo9f1l5Xuw",
    },
    {
      credits: 30,
      price: 25,
      priceId: "price_1QYAEj04BafnFvRoQuxw3lHk",
    },
    {
      credits: 75,
      price: 50,
      priceId: "price_1QYAEe04BafnFvRoY1Na59aK",
    },
  ];

  return (
    <section className="py-4 px-2 sm:py-8 sm:px-4">
      <div className="container mx-auto">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            hideFreePlan ? "lg:grid-cols-3" : "lg:grid-cols-4"
          } gap-4 max-w-6xl mx-auto`}
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
                {Array.isArray(t("pricing.free.features"))
                  ? (t("pricing.free.features") as unknown as string[]).map(
                      (feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-gray-800 mr-2" />
                          <span>{feature}</span>
                        </li>
                      )
                    )
                  : null}
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
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 h-full flex items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <Package className="h-10 w-10 text-gray-800 mb-3" />
                <h3 className="text-xl font-bold mb-3">
                  {pkg.credits} {t("pricing.credits.unit")}
                </h3>
                <p className="text-3xl font-bold mb-4">${pkg.price}</p>
                <p className="text-gray-600 text-sm mb-6">
                  ${(pkg.price / pkg.credits).toFixed(2)}{" "}
                  {t("pricing.credits.perCredit")}
                </p>
                <SubscribeButton
                  priceId={pkg.priceId}
                  isCredit={true}
                  credits={pkg.credits}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
