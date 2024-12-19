import { render, screen } from "@testing-library/react";
import ServiceUnavailable from "../ServiceUnavailable";
import { useLanguage } from "@/contexts/LanguageContext";

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "error.service.title": "Service Unavailable",
        "error.service.description": "Service is currently unavailable",
        "error.service.retry": "Try again later",
      };
      return translations[key] || key;
    },
  }),
}));

describe("ServiceUnavailable", () => {
  it("renders service unavailable message", () => {
    render(<ServiceUnavailable />);
    expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    expect(screen.getByText("Service is currently unavailable")).toBeInTheDocument();
    expect(screen.getByText("Try again later")).toBeInTheDocument();
  });

  it("renders custom message when provided", () => {
    render(<ServiceUnavailable message="Custom error message" />);
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("renders error icon", () => {
    render(<ServiceUnavailable />);
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });
}); 