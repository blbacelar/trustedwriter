import { render, screen, fireEvent } from "@testing-library/react";
import UserButton from "../UserButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("@clerk/nextjs", () => ({
  useClerk: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "nav.account": "Account",
        "nav.settings": "Settings",
        "nav.signOut": "Sign Out",
      };
      return translations[key] || key;
    },
  }),
}));

describe("UserButton", () => {
  const mockSignOut = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useClerk as jest.Mock).mockReturnValue({
      signOut: mockSignOut,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it("renders user button with menu trigger", () => {
    render(<UserButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("user-avatar")).toBeInTheDocument();
  });

  it("shows dropdown menu on click", () => {
    render(<UserButton />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("navigates to settings page", () => {
    render(<UserButton />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const settingsItem = screen.getByText("Settings");
    fireEvent.click(settingsItem);

    expect(mockPush).toHaveBeenCalledWith("/settings");
  });

  it("handles sign out", async () => {
    render(<UserButton />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const signOutItem = screen.getByText("Sign Out");
    fireEvent.click(signOutItem);

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("closes menu when clicking outside", () => {
    render(<UserButton />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Account")).toBeInTheDocument();

    // Click outside
    fireEvent.click(document.body);

    expect(screen.queryByText("Account")).not.toBeInTheDocument();
  });

  it("handles keyboard navigation", () => {
    render(<UserButton />);
    
    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key: "Enter" });

    expect(screen.getByText("Account")).toBeInTheDocument();

    const menuItems = screen.getAllByRole("menuitem");
    expect(document.activeElement).toBe(menuItems[0]);

    fireEvent.keyDown(menuItems[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(menuItems[1]);
  });

  it("applies correct styling to menu items", () => {
    render(<UserButton />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const menuItems = screen.getAllByRole("menuitem");
    menuItems.forEach(item => {
      expect(item).toHaveClass(
        "relative",
        "flex",
        "cursor-pointer",
        "select-none",
        "items-center",
        "rounded-sm",
        "px-2",
        "py-1.5",
        "outline-none",
        "transition-colors",
        "hover:bg-gray-100",
        "focus:bg-gray-100"
      );
    });
  });

  it("renders user avatar with correct size", () => {
    render(<UserButton />);
    
    const avatar = screen.getByTestId("user-avatar");
    expect(avatar).toHaveClass("h-8", "w-8");
  });
}); 