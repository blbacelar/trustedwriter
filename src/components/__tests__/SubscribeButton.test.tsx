import { render, screen, fireEvent } from "@testing-library/react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SubscribeButton from "../SubscribeButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// Mock dependencies
jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "pricing.loading": "Loading...",
        "pricing.credits.buy": "Buy Credits",
        "pricing.pro.cta": "Subscribe",
      };
      return translations[key] || key;
    },
  }),
}));

describe("SubscribeButton", () => {
  const mockPush = jest.fn();
  const mockFetch = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    global.fetch = mockFetch as any;
    jest.clearAllMocks();
  });

  it("renders subscribe button for non-credit purchase", () => {
    render(<SubscribeButton priceId="price_123" />);
    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });

  it("renders buy credits button for credit purchase", () => {
    render(<SubscribeButton priceId="price_123" isCredit={true} credits={10} />);
    expect(screen.getByText("Buy Credits")).toBeInTheDocument();
  });

  it("shows loading state when processing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: "checkout-url" }),
    });

    render(<SubscribeButton priceId="price_123" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to sign in when not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
    });

    render(<SubscribeButton priceId="price_123" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith(
      `/sign-up?subscribe=true&priceId=price_123&period=monthly`
    );
  });

  it("handles successful checkout creation", async () => {
    const checkoutUrl = "https://checkout.stripe.com/123";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: checkoutUrl }),
    });

    render(<SubscribeButton priceId="price_123" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockFetch).toHaveBeenCalledWith("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: "price_123",
        period: "monthly",
      }),
    });
  });

  it("handles checkout creation error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Checkout failed" }),
    });

    render(<SubscribeButton priceId="price_123" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(toast.error).toHaveBeenCalledWith("Checkout failed");
  });

  it("disables button while loading", () => {
    render(<SubscribeButton priceId="price_123" loading={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
}); 