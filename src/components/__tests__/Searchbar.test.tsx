import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Searchbar from "../Searchbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { logError } from "@/lib/errorLogging";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("@/lib/errorLogging", () => ({
  logError: jest.fn(),
}));

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "dashboard.searchbar.placeholder": "Enter job URL",
        "dashboard.searchbar.button": "Search",
        "dashboard.searchbar.noProfile": "Please complete your profile first",
        "dashboard.searchbar.failed": "Failed to check profile",
      };
      return translations[key] || key;
    },
  }),
}));

describe("Searchbar", () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockOnApplicationData = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("renders search form with input and button", () => {
    render(<Searchbar onApplicationData={mockOnApplicationData} />);
    
    expect(screen.getByPlaceholderText("Enter job URL")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("handles successful submission with profile", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { profile: true } }),
    });

    render(<Searchbar onApplicationData={mockOnApplicationData} />);
    
    const input = screen.getByPlaceholderText("Enter job URL");
    fireEvent.change(input, { target: { value: "https://example.com/job" } });
    
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnApplicationData).toHaveBeenCalledWith("https://example.com/job");
      expect(input).toHaveValue("");
    });
  });

  it("redirects to settings when no profile exists", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { profile: null } }),
    });

    render(<Searchbar onApplicationData={mockOnApplicationData} />);
    
    const input = screen.getByPlaceholderText("Enter job URL");
    fireEvent.change(input, { target: { value: "https://example.com/job" } });
    
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please complete your profile first");
      expect(mockRouter.push).toHaveBeenCalledWith("/settings");
    });
  });

  it("handles API error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(<Searchbar onApplicationData={mockOnApplicationData} />);
    
    const input = screen.getByPlaceholderText("Enter job URL");
    fireEvent.change(input, { target: { value: "https://example.com/job" } });
    
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to check profile");
      expect(logError).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: "SUBMIT_SEARCH_CLIENT",
        additionalData: {
          component: "Searchbar"
        }
      });
    });
  });

  it("doesn't submit empty URL", async () => {
    render(<Searchbar onApplicationData={mockOnApplicationData} />);
    
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockOnApplicationData).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalled(); // Still checks profile
  });

  it("updates input value on change", () => {
    render(<Searchbar onApplicationData={mockOnApplicationData} />);
    
    const input = screen.getByPlaceholderText("Enter job URL");
    fireEvent.change(input, { target: { value: "https://example.com/job" } });

    expect(input).toHaveValue("https://example.com/job");
  });

  it("applies correct styling to form elements", () => {
    render(<Searchbar onApplicationData={mockOnApplicationData} />);
    
    const form = screen.getByRole("form");
    expect(form).toHaveClass("w-full");

    const input = screen.getByPlaceholderText("Enter job URL");
    expect(input).toHaveClass(
      "flex-1",
      "px-4",
      "py-3",
      "bg-white/90",
      "rounded-lg"
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "px-6",
      "py-3",
      "bg-gray-800",
      "hover:bg-gray-900",
      "text-white",
      "rounded-lg"
    );
  });
}); 