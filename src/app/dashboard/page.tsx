"use client";

import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Searchbar from "@/components/Searchbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import RichTextEditor from "@/components/RichTextEditor";
import ApplicationsTable from "@/components/ApplicationsTable";
import { scrapeAndGetApplication } from "@/lib/actions";
import ErrorState from "@/components/ErrorState";
import { checkOpenAIStatus } from "@/utils/gpt";
import { useOpenAIStatus } from "@/contexts/OpenAIStatusContext";
import LoadingPage from "@/components/LoadingPage";
import { useCredits } from "@/contexts/CreditsContext";
import ServiceUnavailable from "@/components/ServiceUnavailable";
import { logger } from "@/utils/logger";
import { serverLogger } from "@/utils/serverLogger";

interface Application {
  id: string;
  content: string;
  listingUrl: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { refreshCredits } = useCredits();
  const [applicationData, setApplicationData] = useState<string | null>(
    (initialValue) => {
      serverLogger.debug("Initializing applicationData state", {
        value: initialValue,
      });
      return initialValue;
    }
  );
  const [isGenerating, setIsGenerating] = useState((initialValue) => {
    serverLogger.debug("Initializing isGenerating state", {
      value: initialValue,
    });
    return initialValue;
  });
  const [applications, setApplications] = useState<Application[]>(
    (initialValue) => {
      serverLogger.debug("Initializing applications state", {
        value: initialValue,
      });
      return initialValue;
    }
  );
  const [isLoading, setIsLoading] = useState((initialValue) => {
    serverLogger.debug("Initializing isLoading state", { value: initialValue });
    return initialValue;
  });
  const {
    isOperational,
    status,
    isLoading: openAIStatusLoading,
  } = useOpenAIStatus();
  const applicationRef = useRef<HTMLDivElement>(null);
  const [currentListingUrl, setCurrentListingUrl] = useState<string>(
    (initialValue) => {
      serverLogger.debug("Initializing currentListingUrl state", {
        value: initialValue,
      });
      return initialValue;
    }
  );
  const [currentApplicationId, setCurrentApplicationId] = useState<
    string | null
  >((initialValue) => {
    serverLogger.debug("Initializing currentApplicationId state", {
      value: initialValue,
    });
    return initialValue;
  });

  useEffect(() => {
    serverLogger.debug("Loading state changed", {
      isLoading,
      previousValue: !isLoading,
      openAIStatusLoading,
      isGenerating,
      timestamp: new Date().toISOString(),
    });
  }, [isLoading, openAIStatusLoading, isGenerating]);

  useEffect(() => {
    serverLogger.debug("Application data changed", {
      hasData: !!applicationData,
      currentListingUrl,
      currentApplicationId,
      timestamp: new Date().toISOString(),
    });
  }, [applicationData, currentListingUrl, currentApplicationId]);

  useEffect(() => {
    serverLogger.debug("Generation state changed", {
      isGenerating,
      applicationData: !!applicationData,
      currentListingUrl: !!currentListingUrl,
      timestamp: new Date().toISOString(),
    });
  }, [isGenerating, applicationData, currentListingUrl]);

  useEffect(() => {
    serverLogger.debug("Dashboard component mounted", {
      pathname: window.location.pathname,
      search: window.location.search,
      timestamp: new Date().toISOString(),
    });

    return () => {
      serverLogger.debug("Dashboard component unmounting", {
        timestamp: new Date().toISOString(),
      });
    };
  }, []);

  useEffect(() => {
    serverLogger.debug("Fetch dependencies changed", {
      applicationData: !!applicationData,
      openAIStatusLoading,
      isOperational,
      status,
      timestamp: new Date().toISOString(),
    });

    const fetchApplications = async () => {
      await serverLogger.debug("Starting applications fetch", {
        openAIStatusLoading,
        isOperational,
        status,
      });

      try {
        const response = await fetch("/api/applications");
        await serverLogger.debug("Applications API response", {
          status: response.status,
        });

        if (response.ok) {
          const data = await response.json();
          await serverLogger.debug("Applications data received", {
            count: data.length,
          });
          setApplications(data);
        } else {
          await serverLogger.error("Failed to fetch applications", {
            status: response.status,
          });
        }
      } catch (error) {
        await serverLogger.error("Applications fetch error", { error });
      } finally {
        await serverLogger.debug("Setting isLoading to false");
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [applicationData, openAIStatusLoading, isOperational, status]);

  const handleApplicationData = async (data: string | null) => {
    serverLogger.debug("handleApplicationData called", {
      hasData: !!data,
      timestamp: new Date().toISOString(),
    });
    console.log("[Dashboard] handleApplicationData called with data:", !!data);
    if (!data) return;

    setCurrentListingUrl(data);

    console.log("[Dashboard] Checking OpenAI status");
    const currentStatus = await checkOpenAIStatus();
    console.log("[Dashboard] OpenAI status check result:", currentStatus);

    if (!currentStatus.operational) {
      console.log("[Dashboard] OpenAI service not operational");
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
      console.log("[DEBUG] Scrape result:", result); // Add debug log

      if (result && "error" in result) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to generate application",
          duration: 5000,
        });
        return;
      }

      if (result && "content" in result && "id" in result) {
        console.log("[DEBUG] Setting application data:", {
          content: result.content,
          id: result.id,
        });

        setApplicationData(result.content as string);
        setCurrentApplicationId(result.id as string);
        await refreshCredits();

        setTimeout(() => {
          applicationRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        console.error("[DEBUG] Invalid result format:", result);
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Application generation error:", error);
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
    // Strip HTML tags but preserve line breaks
    const stripHtml = (html: string) => {
      // Replace paragraph breaks with double newlines
      const withLineBreaks = html.replace(/<\/p><p>/g, "\n\n");
      // Create DOM parser
      const doc = new DOMParser().parseFromString(withLineBreaks, "text/html");
      // Get text content
      const textContent = doc.body.textContent || "";
      // Clean up extra whitespace but preserve intentional line breaks
      return textContent.replace(/\n{3,}/g, "\n\n").trim();
    };

    const cleanText = stripHtml(text);
    navigator.clipboard.writeText(cleanText);

    toast({
      title: t("dashboard.copied.title"),
      description: t("dashboard.copied.description"),
      duration: 3000,
    });
  };

  const handleApplicationUpdate = (updatedApplication: Application) => {
    serverLogger.debug("handleApplicationUpdate called", {
      applicationId: updatedApplication.id,
      timestamp: new Date().toISOString(),
    });
    console.log(
      "[DEBUG] handleApplicationUpdate called with:",
      updatedApplication
    );

    setApplications((prevApplications) => {
      console.log("[DEBUG] Previous applications:", prevApplications);

      const newApplications = prevApplications.map((app) =>
        app.id === updatedApplication.id ? updatedApplication : app
      );

      console.log("[DEBUG] Updated applications:", newApplications);
      return newApplications;
    });
  };

  const handleNewApplicationSave = async (content: string) => {
    if (!currentApplicationId) {
      console.error("[DEBUG] No application ID available");
      toast({
        variant: "destructive",
        title: t("dashboard.table.editError"),
        description: "Application ID not found",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/applications/${currentApplicationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            listingUrl: currentListingUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      const { data: updatedApplication } = await response.json();
      handleApplicationUpdate(updatedApplication);

      // Clear all related state to dismiss the editor
      setApplicationData(null);
      setCurrentApplicationId(null);
      setCurrentListingUrl("");

      // Scroll back to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });

      toast({
        title: t("dashboard.table.editSuccess"),
        duration: 3000,
      });
    } catch (error) {
      console.error("[DEBUG] Save error:", error);
      toast({
        variant: "destructive",
        title: t("dashboard.table.editError"),
        duration: 3000,
      });
    }
  };

  if (openAIStatusLoading) {
    serverLogger.debug("Rendering LoadingPage", {
      openAIStatusLoading,
      isLoading,
      isGenerating,
      timestamp: new Date().toISOString(),
    });
    return <LoadingPage />;
  }

  if (!isOperational) {
    serverLogger.debug("Rendering ServiceUnavailable", {
      status,
      isLoading,
      isGenerating,
      timestamp: new Date().toISOString(),
    });
    return <ServiceUnavailable status={status} />;
  }

  serverLogger.debug("Rendering main dashboard content", {
    isLoading,
    isGenerating,
    applicationsCount: applications.length,
    hasApplicationData: !!applicationData,
    hasCurrentListingUrl: !!currentListingUrl,
    hasCurrentApplicationId: !!currentApplicationId,
    timestamp: new Date().toISOString(),
  });

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
        <section ref={applicationRef} className="px-6 md:px-20 py-12 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-[#1B1B1B]">
                {t("dashboard.generatedTitle")}
              </h2>
              <RichTextEditor
                initialContent={applicationData}
                onSave={handleNewApplicationSave}
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
            <ApplicationsTable
              applications={applications}
              onCopy={handleCopy}
              onUpdate={handleApplicationUpdate}
            />
          )}
        </div>
      </section>
    </>
  );
}
