import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DogIcon, HomeIcon, WrenchIcon } from "lucide-react";

interface ServiceUnavailableProps {
  status?: string;
}

export default function ServiceUnavailable({
  status,
}: ServiceUnavailableProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated House and Pet Icons */}
        <div className="relative h-32 mb-8">
          <div className="absolute left-1/2 -translate-x-1/2 animate-bounce">
            <HomeIcon className="w-16 h-16 text-blue-500" />
          </div>
          <div className="absolute left-1/4 top-12 animate-pulse">
            <DogIcon className="w-12 h-12 text-yellow-500" />
          </div>
          <div className="absolute right-1/4 top-16">
            <WrenchIcon className="w-10 h-10 text-red-500 animate-spin-slow" />
          </div>
        </div>

        {/* Message Content */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {t("errors.serviceUnavailable.title")}
          </h1>
          <p className="text-gray-600 mb-6">
            {status || t("errors.serviceUnavailable.defaultMessage")}
          </p>

          {/* Fun Message */}
          <div className="text-sm text-gray-500 italic">
            <p>{t("errors.serviceUnavailable.funMessage.line1")}</p>
            <p>{t("errors.serviceUnavailable.funMessage.line2")}</p>
          </div>
        </div>

        {/* Paw Print Trail */}
        <div className="flex justify-center space-x-4 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-gray-400 rounded-full transform rotate-45"
              style={{
                animation: `fadeInOut 2s infinite ${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
