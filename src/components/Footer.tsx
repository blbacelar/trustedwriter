"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SupportWidget } from "./SupportWidget";

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  console.log("Translation test:", {
    faq: t("footer.quickLinks.faq"),
    home: t("footer.quickLinks.home"),
    settings: t("footer.quickLinks.settings"),
  });

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Promo Banner */}
        <div className="mb-12 p-6 bg-gray-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t("promo.title")}
          </h3>
          <p className="text-gray-600 mb-4">{t("promo.description")}</p>
          <a
            href="https://www.trustedhousesitters.com/refer/RAF693812/?utm_source=copy-link&utm_medium=refer-a-friend&utm_campaign=refer-a-friend"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
          >
            {t("promo.cta")}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">TrustedWriter</h3>
            <p className="text-gray-600 max-w-xs">
              {t("footer.brand.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("footer.quickLinks.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-800">
                  {t("footer.quickLinks.home")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-800">
                  {t("footer.quickLinks.faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              {t("footer.resources.title")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.trustedhousesitters.com/refer/RAF693812/?utm_source=copy-link&utm_medium=refer-a-friend&utm_campaign=refer-a-friend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t("footer.resources.join")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-12 pt-8">
          <p className="text-center text-gray-500 text-sm">
            {t("footer.copyright.text").replace("{year}", year.toString())}
            <br />
            <span className="text-xs">
              {t("footer.copyright.referral")}{" "}
              <a
                href="https://www.trustedhousesitters.com/refer/RAF693812/?utm_source=copy-link&utm_medium=refer-a-friend&utm_campaign=refer-a-friend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:underline"
              >
                {t("footer.resources.join")}
              </a>
            </span>
          </p>
        </div>
      </div>
      <SupportWidget />
    </footer>
  );
};

export default Footer;
