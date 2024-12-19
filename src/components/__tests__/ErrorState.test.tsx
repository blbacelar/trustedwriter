import { render, screen } from "@testing-library/react";
import ErrorState from "../ErrorState";
import { useLanguage } from "@/contexts/LanguageContext";

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "error.title": "Error Title",
        "error.description": "Error Description",
      };
      return translations[key] || key;
    },
  }),
}));

describe("ErrorState", () => {
  it("renders error message with default props", () => {
    render(<ErrorState />);
    expect(screen.getByText("Error Title")).toBeInTheDocument();
    expect(screen.getByText("Error Description")).toBeInTheDocument();
  });

  it("renders custom error message", () => {
    render(<ErrorState message="Custom Error" />);
    expect(screen.getByText("Custom Error")).toBeInTheDocument();
  });

  it("renders error icon", () => {
    render(<ErrorState />);
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });
}); 