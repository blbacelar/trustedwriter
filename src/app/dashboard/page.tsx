"use client";

import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Searchbar from "@/components/Searchbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import RichTextEditor from "@/components/RichTextEditor";
import ApplicationsTable from "@/components/ApplicationsTable";
import { scrapeAndGetApplication } from "@/lib/actions";
import ErrorState from "@/components/ErrorState";
import { checkOpenAIStatus } from "@/utils/gpt";

interface Application {
  id: string;
  content: string;
  listingUrl: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [applicationData, setApplicationData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceStatus, setServiceStatus] = useState<{
    operational: boolean;
    status: string;
  } | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/applications");
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [applicationData]); // Refresh when new application is generated

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkOpenAIStatus();
      setServiceStatus(status);
    };
    checkStatus();
  }, []);

  const handleApplicationData = async (data: string | null) => {
    if (!data) return;

    // Check OpenAI status before proceeding
    const currentStatus = await checkOpenAIStatus();
    setServiceStatus(currentStatus);
    
    if (!currentStatus.operational) {
      toast({
        variant: "destructive",
        title: "Service Unavailable",
        description: currentStatus.status || "OpenAI service is currently down",
        duration: 5000,
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await scrapeAndGetApplication(data);
      
      if (result && "error" in result) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to generate application",
          duration: 5000,
        });
        return;
      }

      setApplicationData(result?.content || "");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t("dashboard.copied.title"),
      description: t("dashboard.copied.description"),
      duration: 3000,
    });
  };

  if (!serviceStatus?.operational) {
    return (
      <ErrorState 
        title="Our AI Pet is Taking a Nap!" 
        message="OpenAI services are currently unavailable. Please try again later."
        status={serviceStatus?.status}
      />
    );
  }

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
                {t("dashboard.title")}
              </h1>
              <p className="text-xl text-gray-200 mb-12">
                {t("dashboard.subtitle")}
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
                {t("dashboard.generatedTitle")}
              </h2>
              <RichTextEditor
                initialContent={applicationData}
                onCopy={handleCopy}
              />
            </div>
          </div>
        </section>
      )}

      <section className="px-6 md:px-20 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-[#1B1B1B]">
            {t("dashboard.table.title")}
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-[#00B5B4] border-t-transparent rounded-full" />
            </div>
          ) : (
            <ApplicationsTable applications={applications} />
          )}
        </div>
      </section>
    </>
  );
}
