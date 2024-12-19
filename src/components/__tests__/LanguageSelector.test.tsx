import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSelector from "../LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock the language context
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: jest.fn(),
}));

describe("LanguageSelector", () => {
  const mockSetLanguage = jest.fn();

  beforeEach(() => {
    (useLanguage as jest.Mock).mockReturnValue({
      language: "en",
      setLanguage: mockSetLanguage,
      t: (key: string) => key,
    });
    jest.clearAllMocks();
  });

  it("renders language options", () => {
    render(<LanguageSelector />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  it("shows current selected language", () => {
    (useLanguage as jest.Mock).mockReturnValue({
      language: "es",
      setLanguage: mockSetLanguage,
      t: (key: string) => key,
    });

    render(<LanguageSelector />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("es");
  });

  it("calls setLanguage when selection changes", () => {
    render(<LanguageSelector />);
    const select = screen.getByRole("combobox");
    
    fireEvent.change(select, { target: { value: "es" } });
    expect(mockSetLanguage).toHaveBeenCalledWith("es");
  });

  it("persists selection in localStorage", () => {
    render(<LanguageSelector />);
    const select = screen.getByRole("combobox");
    
    fireEvent.change(select, { target: { value: "es" } });
    expect(localStorage.getItem("language")).toBe("es");
  });

  it("handles invalid language selection gracefully", () => {
    render(<LanguageSelector />);
    const select = screen.getByRole("combobox");
    
    // @ts-ignore - Testing invalid input
    fireEvent.change(select, { target: { value: "invalid" } });
    expect(mockSetLanguage).not.toHaveBeenCalled();
  });
}); 