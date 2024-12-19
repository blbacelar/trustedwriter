import { render, screen, fireEvent } from "@testing-library/react";
import CreditsIndicator from "../CreditsIndicator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCredits } from "@/contexts/CreditsContext";
import { useAuth } from "@clerk/nextjs";

// Mock dependencies
jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "credits.remaining": "Credits Remaining",
        "credits.buyMore": "Buy More Credits",
        "credits.buyTitle": "Buy Credits",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("@/contexts/CreditsContext", () => ({
  useCredits: jest.fn(),
}));

describe("CreditsIndicator", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: true });
    jest.clearAllMocks();
  });

  it("renders credits display for free plan users", () => {
    (useCredits as jest.Mock).mockReturnValue({
      credits: 10,
      isFreePlan: true,
      hasUnlimitedCredits: false,
    });

    render(<CreditsIndicator />);
    expect(screen.getByTestId("credits-container")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("doesn't render for non-signed in users", () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: false });
    (useCredits as jest.Mock).mockReturnValue({
      credits: 10,
      isFreePlan: true,
      hasUnlimitedCredits: false,
    });

    render(<CreditsIndicator />);
    expect(screen.queryByTestId("credits-container")).not.toBeInTheDocument();
  });

  it("doesn't render for non-free plan users", () => {
    (useCredits as jest.Mock).mockReturnValue({
      credits: 10,
      isFreePlan: false,
      hasUnlimitedCredits: false,
    });

    render(<CreditsIndicator />);
    expect(screen.queryByTestId("credits-container")).not.toBeInTheDocument();
  });

  it("doesn't render for unlimited credits users", () => {
    (useCredits as jest.Mock).mockReturnValue({
      credits: -1,
      isFreePlan: true,
      hasUnlimitedCredits: true,
    });

    render(<CreditsIndicator />);
    expect(screen.queryByTestId("credits-container")).not.toBeInTheDocument();
  });

  it("shows buy credits dialog when clicking plus button", () => {
    (useCredits as jest.Mock).mockReturnValue({
      credits: 10,
      isFreePlan: true,
      hasUnlimitedCredits: false,
    });

    render(<CreditsIndicator />);
    
    const buyButton = screen.getByRole("button", { name: "Buy More Credits" });
    fireEvent.click(buyButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Buy Credits")).toBeInTheDocument();
  });

  it("applies warning styles for low credits", () => {
    (useCredits as jest.Mock).mockReturnValue({
      credits: 3,
      isFreePlan: true,
      hasUnlimitedCredits: false,
    });

    render(<CreditsIndicator />);
    expect(screen.getByTestId("credits-warning")).toHaveClass("text-yellow-500");
  });

  it("applies danger styles for zero credits", () => {
    (useCredits as jest.Mock).mockReturnValue({
      credits: 0,
      isFreePlan: true,
      hasUnlimitedCredits: false,
    });

    render(<CreditsIndicator />);
    expect(screen.getByTestId("credits-warning")).toHaveClass("text-red-500");
  });

  it("shows tooltip on buy credits button hover", async () => {
    (useCredits as jest.Mock).mockReturnValue({
      credits: 10,
      isFreePlan: true,
      hasUnlimitedCredits: false,
    });

    render(<CreditsIndicator />);
    
    const buyButton = screen.getByRole("button", { name: "Buy More Credits" });
    fireEvent.mouseEnter(buyButton);

    expect(await screen.findByText("Buy More Credits")).toBeInTheDocument();
  });

  it("closes buy credits dialog", () => {
    (useCredits as jest.Mock).mockReturnValue({
      credits: 10,
      isFreePlan: true,
      hasUnlimitedCredits: false,
    });

    render(<CreditsIndicator />);
    
    const buyButton = screen.getByRole("button", { name: "Buy More Credits" });
    fireEvent.click(buyButton);
    
    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
}); 