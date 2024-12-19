import { render, screen } from "@testing-library/react";
import LoadingPage from "../LoadingPage";

describe("LoadingPage", () => {
  it("renders loading spinner centered on page", () => {
    render(<LoadingPage />);
    
    const container = screen.getByTestId("loading-page");
    expect(container).toHaveClass(
      "min-h-screen",
      "flex",
      "items-center",
      "justify-center"
    );
    
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("renders with large spinner size", () => {
    render(<LoadingPage />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-6", "h-6");
  });

  it("applies dark background color", () => {
    render(<LoadingPage />);
    const container = screen.getByTestId("loading-page");
    expect(container).toHaveClass("bg-gray-900");
  });

  it("renders spinner with correct color", () => {
    render(<LoadingPage />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("border-white", "border-t-transparent");
  });
}); 