import { render, screen } from "@testing-library/react";
import PricingSection from "../PricingSection";
import { useLanguage } from "@/contexts/LanguageContext";

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string | string[]> = {
        "pricing.free.title": "Free Plan",
        "pricing.perMonth": "/month",
        "pricing.free.features": ["Feature 1", "Feature 2", "Feature 3"],
        "pricing.free.cta": "Get Started",
        "pricing.credits.unit": "Credits",
        "pricing.credits.perCredit": "per credit",
        "pricing.credits.title": "Credit Packages",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("@/components/SubscribeButton", () => ({
  __esModule: true,
  default: ({ priceId, credits }: { priceId: string; credits: number }) => (
    <button data-testid={`subscribe-${credits}`}>
      Subscribe to {credits} credits
    </button>
  ),
}));

describe("PricingSection", () => {
  it("renders free plan when hideFreePlan is false", () => {
    render(<PricingSection hideFreePlan={false} />);

    expect(screen.getByText("Free Plan")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("Feature 3")).toBeInTheDocument();
  });

  it("hides free plan when hideFreePlan is true", () => {
    render(<PricingSection hideFreePlan={true} />);

    expect(screen.queryByText("Free Plan")).not.toBeInTheDocument();
  });

  it("renders all credit packages", () => {
    render(<PricingSection />);

    // Check credit amounts
    expect(screen.getByText("10 Credits")).toBeInTheDocument();
    expect(screen.getByText("30 Credits")).toBeInTheDocument();
    expect(screen.getByText("75 Credits")).toBeInTheDocument();

    // Check prices
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("$25")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  it("calculates and displays correct price per credit", () => {
    render(<PricingSection />);

    // 10 credits for $10 = $1.00 per credit
    expect(screen.getByText("$1.00 per credit")).toBeInTheDocument();
    // 30 credits for $25 = $0.83 per credit
    expect(screen.getByText("$0.83 per credit")).toBeInTheDocument();
    // 75 credits for $50 = $0.67 per credit
    expect(screen.getByText("$0.67 per credit")).toBeInTheDocument();
  });

  it("renders subscribe buttons for each credit package", () => {
    render(<PricingSection />);

    expect(screen.getByTestId("subscribe-10")).toBeInTheDocument();
    expect(screen.getByTestId("subscribe-30")).toBeInTheDocument();
    expect(screen.getByTestId("subscribe-75")).toBeInTheDocument();
  });

  it("applies correct layout classes", () => {
    render(<PricingSection />);

    expect(screen.getByTestId("pricing-grid")).toHaveClass(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-4",
      "gap-4"
    );
  });

  it("renders package icons", () => {
    const hideFreePlan = false;
    render(<PricingSection />);

    const packageIcons = screen.getAllByTestId("package-icon");
    expect(packageIcons).toHaveLength(hideFreePlan ? 3 : 4);
    packageIcons.forEach((icon) => {
      expect(icon).toHaveClass("h-10", "w-10", "text-gray-800");
    });
  });

  it("renders free plan sign up link correctly", () => {
    render(<PricingSection hideFreePlan={false} />);

    const signUpLink = screen.getByRole("link", { name: "Get Started" });
    expect(signUpLink).toHaveAttribute("href", "/sign-up");
  });

  it("passes correct priceIds to SubscribeButtons", () => {
    render(<PricingSection />);

    const expectedPriceIds = [
      "price_1QV5Mr04BafnFvRo949kW8y5",
      "price_1QV5Pl04BafnFvRoKHf3V4mu",
      "price_1QV5Qb04BafnFvRoiLl17ZP3",
    ];

    expectedPriceIds.forEach((priceId, index) => {
      const credits = [10, 30, 75][index];
      const button = screen.getByTestId(`subscribe-${credits}`);
      expect(button).toHaveAttribute("data-price-id", priceId);
    });
  });
});
