"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function SubscriptionManagement() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/cancel", {
        method: "POST",
      });

      if (!response.ok) throw new Error();
      toast.success(t("settings.subscription.cancelSuccess"));
      fetchSubscription();
      setShowCancelDialog(false);
    } catch (error) {
      toast.error(t("settings.subscription.cancelError"));
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/reactivate", {
        method: "POST",
      });

      if (!response.ok) throw new Error();
      toast.success(t("settings.subscription.reactivateSuccess"));
      fetchSubscription();
    } catch (error) {
      toast.error(t("settings.subscription.reactivateError"));
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/subscription");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  if (!subscription) return null;

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-medium">
              {t("settings.subscription.status")}:{" "}
              <span className={subscription.status === "active" ? "text-green-600" : "text-red-600"}>
                {t(`settings.subscription.${subscription.status}`)}
              </span>
            </p>
            {subscription.cancelAt && (
              <p className="text-sm text-gray-500">
                {t("settings.subscription.endsAt")}:{" "}
                {new Date(subscription.cancelAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {subscription.status === "active" && (
            <>
              {subscription.cancelAt ? (
                <button
                  onClick={handleReactivateSubscription}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? t("settings.subscription.reactivating") : t("settings.subscription.reactivate")}
                </button>
              ) : (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {t("settings.subscription.cancelButton")}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.subscription.cancelDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("settings.subscription.cancelDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setShowCancelDialog(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              {t("settings.subscription.cancelDialog.cancel")}
            </button>
            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {loading ? t("settings.subscription.canceling") : t("settings.subscription.cancelDialog.confirm")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
