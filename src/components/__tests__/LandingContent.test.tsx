import { render, screen, fireEvent } from "@testing-library/react";
import LandingContent from "../LandingContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "hero.title": "Welcome Title",
        "hero.subtitle": "Welcome Subtitle",
        "hero.cta": "Get Started",
        "features.ai.title": "AI Features",
        "features.ai.description": "AI Description",
        "features.time.title": "Save Time",
        "features.time.description": "Time Description",
        "features.success.title": "Success",
        "features.success.description": "Success Description",
        "cta.title": "Ready to Start?",
        "cta.button": "Get Started Now",
        "features.title": "Features",
        "features.subtitle": "What we offer",
      };
      return translations[key] || key;
    },
    language: "en",
  }),
}));

describe("LandingContent", () => {
  const mockScrollIntoView = jest.fn();
  const mockGetElementById = jest.fn();

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
    document.getElementById = mockGetElementById;
    jest.clearAllMocks();
  });

  it("handles CTA click when pricing section exists", () => {
    mockGetElementById.mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    });
    render(<LandingContent />);

    const ctaButton = screen.getByRole("button", { name: "Get Started" });
    fireEvent.click(ctaButton);

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("handles CTA click when pricing section doesn't exist", () => {
    mockGetElementById.mockReturnValue(null);
    render(<LandingContent />);

    const ctaButton = screen.getByRole("button", { name: "Get Started" });
    fireEvent.click(ctaButton);

    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it("handles CTA click on non-home pages", () => {
    (usePathname as jest.Mock).mockReturnValue("/other");
    render(<LandingContent />);

    const ctaButton = screen.getByRole("button", { name: "Get Started" });
    fireEvent.click(ctaButton);

    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it("renders all feature sections with icons", () => {
    render(<LandingContent />);

    expect(screen.getByTestId("sparkles-icon")).toBeInTheDocument();
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
    expect(screen.getByTestId("trophy-icon")).toBeInTheDocument();

    expect(screen.getByText("AI Features")).toBeInTheDocument();
    expect(screen.getByText("AI Description")).toBeInTheDocument();
    expect(screen.getByText("Save Time")).toBeInTheDocument();
    expect(screen.getByText("Time Description")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Success Description")).toBeInTheDocument();
  });

  it("renders hero section with correct styling", () => {
    render(<LandingContent />);

    const heroTitle = screen.getByRole("heading", { name: "Welcome Title" });
    const heroSubtitle = screen.getByText("Welcome Subtitle");

    expect(heroTitle).toHaveClass("text-5xl", "font-bold", "text-white");
    expect(heroSubtitle).toHaveClass("text-xl", "text-white/90");
  });

  it("renders final CTA section with correct link", () => {
    render(<LandingContent />);

    const finalCTA = screen.getByTestId("final-cta");
    const signUpLink = finalCTA.querySelector("a");
    expect(signUpLink).toHaveAttribute("href", "/sign-up");
  });

  it("renders hero image with correct attributes", () => {
    render(<LandingContent />);

    const heroImage = screen.getByRole("img", { name: "Landing Hero" });
    expect(heroImage).toHaveAttribute("src", "/landing-hero.jpg");
    expect(heroImage).toHaveAttribute("priority", "");
    expect(heroImage).toHaveClass("object-cover");
  });

  it("applies correct background overlay", () => {
    render(<LandingContent />);

    const overlay = screen.getByTestId("hero-overlay");
    expect(overlay).toHaveClass("absolute", "inset-0", "bg-black/40");
  });

  it("renders pricing section with correct id", () => {
    render(<LandingContent />);

    const pricingSection = screen.getByTestId("pricing-section");
    expect(pricingSection).toHaveAttribute("id", "pricing");
    expect(pricingSection).toHaveClass("py-24", "bg-gray-50");
  });

  it("logs current language on mount", () => {
    const consoleSpy = jest.spyOn(console, "log");
    render(<LandingContent />);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Current language in LandingContent:",
      "en"
    );
  });
});
