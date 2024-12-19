import { render, screen } from "@testing-library/react";
import Footer from "../Footer";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock dependencies
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "footer.rights": "All rights reserved",
        "footer.privacy": "Privacy Policy",
        "footer.terms": "Terms of Service",
        "footer.contact": "Contact",
      };
      return translations[key] || key;
    },
  }),
}));

describe("Footer", () => {
  it("renders copyright notice", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} JobGPT.`)).toBeInTheDocument();
    expect(screen.getByText("All rights reserved")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3); // Privacy, Terms, Contact

    expect(screen.getByText("Privacy Policy")).toHaveAttribute("href", "/privacy");
    expect(screen.getByText("Terms of Service")).toHaveAttribute("href", "/terms");
    expect(screen.getByText("Contact")).toHaveAttribute("href", "/contact");
  });

  it("applies correct styling to container", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("border-t", "bg-white");
  });

  it("renders with responsive layout", () => {
    render(<Footer />);
    
    const container = screen.getByTestId("footer-container");
    expect(container).toHaveClass(
      "container",
      "mx-auto",
      "px-6",
      "py-8",
      "md:flex",
      "md:items-center",
      "md:justify-between"
    );
  });

  it("groups navigation links correctly", () => {
    render(<Footer />);
    
    const navContainer = screen.getByTestId("footer-nav");
    expect(navContainer).toHaveClass("flex", "space-x-6");
  });
}); 