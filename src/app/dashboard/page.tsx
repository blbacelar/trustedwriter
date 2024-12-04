"use client";

import Searchbar from "@/components/Searchbar";
import RichTextEditor from "@/components/RichTextEditor";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const DashboardPage = () => {
  const { toast } = useToast();
  const [applicationData, setApplicationData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleApplicationData = async (data: string | null) => {
    setIsGenerating(true);
    try {
      setApplicationData(data);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Application copied to clipboard",
      duration: 3000,
    });
  };

  return (
    <>
      {isGenerating && <LoadingSpinner />}
      <section className="relative min-h-[600px] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/dashboard-hero.jpg"
            alt="Dashboard Hero"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-20 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Generate Your Perfect House Sitting Application
              </h1>
              <p className="text-xl text-gray-200 mb-12">
                Simply paste the TrustedHousesitters listing URL and let AI
                create a personalized application based on your profile.
              </p>
              <Searchbar onApplicationData={handleApplicationData} />
            </div>
          </div>
        </div>
      </section>

      {applicationData && (
        <section className="px-6 md:px-20 py-12 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-[#1B1B1B]">
                Your Generated Application
              </h2>
              <RichTextEditor
                initialContent={applicationData}
                onCopy={handleCopy}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default DashboardPage;
