import { render, screen, fireEvent } from "@testing-library/react";
import Tutorial from "../Tutorial";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "tutorial.welcome.title": "Welcome",
        "tutorial.welcome.description": "Welcome description",
        "tutorial.settings.title": "Settings",
        "tutorial.settings.description": "Settings description",
        "tutorial.ready.title": "Ready",
        "tutorial.ready.description": "Ready description",
        "tutorial.button.next": "Next",
        "tutorial.button.finish": "Finish",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("@/contexts/TutorialContext", () => ({
  useTutorial: jest.fn(),
}));

describe("Tutorial", () => {
  const mockPush = jest.fn();
  const mockMarkTutorialAsSeen = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useTutorial as jest.Mock).mockReturnValue({
      hasSeenTutorial: false,
      markTutorialAsSeen: mockMarkTutorialAsSeen,
    });
    jest.clearAllMocks();
  });

  it("renders first step of tutorial", () => {
    render(<Tutorial />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("Welcome description")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("doesn't render when tutorial has been seen", () => {
    (useTutorial as jest.Mock).mockReturnValue({
      hasSeenTutorial: true,
      markTutorialAsSeen: mockMarkTutorialAsSeen,
    });

    render(<Tutorial />);
    expect(screen.queryByText("Welcome")).not.toBeInTheDocument();
  });

  it("advances to next step when clicking next", () => {
    render(<Tutorial />);
    
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Settings description")).toBeInTheDocument();
  });

  it("shows finish button on last step", () => {
    render(<Tutorial />);
    
    // Click through to last step
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));

    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByText("Finish")).toBeInTheDocument();
  });

  it("completes tutorial and redirects to settings on finish", () => {
    render(<Tutorial />);
    
    // Navigate to last step
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));
    
    // Click finish
    fireEvent.click(screen.getByText("Finish"));

    expect(mockMarkTutorialAsSeen).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/settings");
  });

  it("displays correct icon for each step", () => {
    render(<Tutorial />);

    // First step
    expect(screen.getByTestId("message-square-icon")).toBeInTheDocument();

    // Second step
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByTestId("settings-icon")).toBeInTheDocument();

    // Third step
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByTestId("check-circle-icon")).toBeInTheDocument();
  });

  it("maintains modal visibility until tutorial is completed", () => {
    render(<Tutorial />);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveClass("fixed inset-0");

    fireEvent.click(screen.getByText("Next"));
    expect(modal).toBeInTheDocument();

    fireEvent.click(screen.getByText("Next"));
    expect(modal).toBeInTheDocument();
  });
}); 