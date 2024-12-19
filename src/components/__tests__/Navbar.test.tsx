import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

// Mock the hooks and components
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "nav.login": "Sign In",
        "nav.signup": "Get Started",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock the CreditsIndicator component
jest.mock("../CreditsIndicator", () => ({
  __esModule: true,
  default: () => <div data-testid="credits-indicator">Credits</div>,
}));

// Mock the CustomUserButton component
jest.mock("../CustomUserButton", () => ({
  __esModule: true,
  default: () => <div data-testid="user-button">User</div>,
}));

describe("Navbar", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
    });
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  it("renders logo", () => {
    render(<Navbar />);
    expect(screen.getByText("TrustedWriter")).toBeInTheDocument();
  });

  it("shows sign in and get started buttons when not signed in", () => {
    render(<Navbar />);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("shows credits indicator and user button when signed in", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
    });
    render(<Navbar />);
    expect(screen.getByTestId("credits-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });

  it("doesn't render on auth pages", () => {
    (usePathname as jest.Mock).mockReturnValue("/sign-in");
    render(<Navbar />);
    expect(screen.queryByText("TrustedWriter")).not.toBeInTheDocument();
  });

  it("scrolls to pricing section when clicking get started on home page", () => {
    const mockScrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
    
    document.body.innerHTML = `
      <div>
        <div id="pricing"></div>
      </div>
    `;

    render(<Navbar />);
    const getStartedButton = screen.getByText("Get Started");
    fireEvent.click(getStartedButton);
    
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("navigates normally when clicking get started on other pages", () => {
    (usePathname as jest.Mock).mockReturnValue("/other-page");
    render(<Navbar />);
    
    const getStartedButton = screen.getByText("Get Started");
    fireEvent.click(getStartedButton);
    
    // Should not call scrollIntoView
    expect(getStartedButton.closest("a")).toHaveAttribute("href", "/sign-up");
  });
}); 