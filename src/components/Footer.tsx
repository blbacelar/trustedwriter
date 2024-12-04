"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Promo Banner */}
        <div className="mb-12 p-6 bg-[#00B5B4]/10 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-[#00B5B4] mb-2">
            {t("promo.title")}
          </h3>
          <p className="text-gray-600 mb-4">{t("promo.description")}</p>
          <a
            href="https://www.trustedhousesitters.com/refer/RAF693812/?utm_source=copy-link&utm_medium=refer-a-friend&utm_campaign=refer-a-friend"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#00B5B4] text-white rounded-full hover:bg-[#00A3A2] transition-colors"
          >
            {t("promo.cta")}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#00B5B4]">TrustedWriter</h3>
            <p className="text-gray-600 max-w-xs">{t("footer.brand.description")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">{t("footer.quickLinks.title")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/settings" className="text-gray-600 hover:text-[#00B5B4] transition-colors">
                  {t("footer.quickLinks.settings")}
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-[#00B5B4] transition-colors">
                  {t("footer.quickLinks.home")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">{t("footer.resources.title")}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.trustedhousesitters.com/refer/RAF693812/?utm_source=copy-link&utm_medium=refer-a-friend&utm_campaign=refer-a-friend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#00B5B4] transition-colors"
                >
                  {t("footer.resources.join")}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/blbacelar/trustedwriter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#00B5B4] transition-colors"
                >
                  {t("footer.resources.github")}
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
                className="text-[#00B5B4] hover:underline"
              >
                {t("footer.resources.join")}
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
