import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default size", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("w-4", "h-4");
  });

  it("renders with small size", () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-3", "h-3");
  });

  it("renders with large size", () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-6", "h-6");
  });

  it("applies custom className", () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("custom-class");
  });

  it("renders with correct ARIA attributes", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });
}); 