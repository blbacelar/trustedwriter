import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SubscriptionManagement from "../SubscriptionManagement";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

// Mock dependencies
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "subscription.title": "Subscription",
        "subscription.status": "Status",
        "subscription.active": "Active",
        "subscription.inactive": "Inactive",
        "subscription.cancel": "Cancel Subscription",
        "subscription.reactivate": "Reactivate Subscription",
        "subscription.period": "Billing Period",
        "subscription.credits": "Credits",
        "subscription.loading": "Loading...",
        "subscription.error": "Error loading subscription",
      };
      return translations[key] || key;
    },
  }),
}));

describe("SubscriptionManagement", () => {
  const mockSubscription = {
    id: "sub_123",
    status: "active",
    currentPeriodEnd: new Date("2024-12-31").toISOString(),
    cancelAtPeriodEnd: false,
    credits: 100,
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: { id: "user_123" },
      isLoaded: true,
    });
    jest.clearAllMocks();
  });

  it("renders subscription details", async () => {
    render(<SubscriptionManagement subscription={mockSubscription} />);

    expect(screen.getByText("Subscription")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("December 31, 2024")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<SubscriptionManagement isLoading={true} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("handles subscription cancellation", async () => {
    const mockCancelFn = jest.fn().mockResolvedValue({});
    render(
      <SubscriptionManagement
        subscription={mockSubscription}
        onCancel={mockCancelFn}
      />
    );

    const cancelButton = screen.getByText("Cancel Subscription");
    fireEvent.click(cancelButton);

    // Confirm in dialog
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockCancelFn).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Subscription cancelled");
    });
  });

  it("handles subscription reactivation", async () => {
    const mockReactivateFn = jest.fn().mockResolvedValue({});
    render(
      <SubscriptionManagement
        subscription={{ ...mockSubscription, cancelAtPeriodEnd: true }}
        onReactivate={mockReactivateFn}
      />
    );

    const reactivateButton = screen.getByText("Reactivate Subscription");
    fireEvent.click(reactivateButton);

    await waitFor(() => {
      expect(mockReactivateFn).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Subscription reactivated");
    });
  });

  it("displays error state", () => {
    render(<SubscriptionManagement error="Failed to load subscription" />);

    expect(screen.getByText("Error loading subscription")).toBeInTheDocument();
  });

  it("shows inactive status for cancelled subscription", () => {
    render(
      <SubscriptionManagement
        subscription={{ ...mockSubscription, status: "canceled" }}
      />
    );

    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("handles cancellation error", async () => {
    const mockCancelFn = jest.fn().mockRejectedValue(new Error("Cancel failed"));
    render(
      <SubscriptionManagement
        subscription={mockSubscription}
        onCancel={mockCancelFn}
      />
    );

    const cancelButton = screen.getByText("Cancel Subscription");
    fireEvent.click(cancelButton);
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to cancel subscription");
    });
  });

  it("handles reactivation error", async () => {
    const mockReactivateFn = jest.fn().mockRejectedValue(new Error("Reactivate failed"));
    render(
      <SubscriptionManagement
        subscription={{ ...mockSubscription, cancelAtPeriodEnd: true }}
        onReactivate={mockReactivateFn}
      />
    );

    const reactivateButton = screen.getByText("Reactivate Subscription");
    fireEvent.click(reactivateButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to reactivate subscription");
    });
  });

  it("displays correct billing period format", () => {
    const dates = [
      "2024-01-01",
      "2024-06-15",
      "2024-12-31",
    ];

    dates.forEach(date => {
      render(
        <SubscriptionManagement
          subscription={{ ...mockSubscription, currentPeriodEnd: new Date(date).toISOString() }}
        />
      );
      expect(screen.getByText(new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))).toBeInTheDocument();
    });
  });

  it("disables buttons during loading states", async () => {
    const mockCancelFn = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(
      <SubscriptionManagement
        subscription={mockSubscription}
        onCancel={mockCancelFn}
      />
    );

    const cancelButton = screen.getByText("Cancel Subscription");
    fireEvent.click(cancelButton);
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    expect(confirmButton).toBeDisabled();
    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });
}); 