import { render, screen, fireEvent } from "@testing-library/react";
import CustomUserButton from "../CustomUserButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
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
        "nav.signIn": "Sign In",
      };
      return translations[key] || key;
    },
  }),
}));

describe("CustomUserButton", () => {
  const mockUser = {
    id: "user_123",
    fullName: "John Doe",
    imageUrl: "https://example.com/avatar.jpg",
    primaryEmailAddress: { emailAddress: "john@example.com" },
  };

  const mockRouter = {
    push: jest.fn(),
  };

  const mockClerk = {
    signOut: jest.fn(),
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser, isLoaded: true });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useClerk as jest.Mock).mockReturnValue(mockClerk);
    jest.clearAllMocks();
  });

  it("renders user avatar and name when signed in", () => {
    render(<CustomUserButton />);

    const avatar = screen.getByRole("img", { name: "John Doe" });
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("shows dropdown menu on click", () => {
    render(<CustomUserButton />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("navigates to settings page", () => {
    render(<CustomUserButton />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    const settingsItem = screen.getByText("Settings");
    fireEvent.click(settingsItem);

    expect(mockRouter.push).toHaveBeenCalledWith("/settings");
  });

  it("handles sign out", () => {
    render(<CustomUserButton />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    const signOutItem = screen.getByText("Sign Out");
    fireEvent.click(signOutItem);

    expect(mockClerk.signOut).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("shows sign in button when not authenticated", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, isLoaded: true });
    render(<CustomUserButton />);

    const signInButton = screen.getByRole("button", { name: "Sign In" });
    expect(signInButton).toBeInTheDocument();
  });

  it("handles loading state", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, isLoaded: false });
    render(<CustomUserButton />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses email as fallback when no name", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { ...mockUser, fullName: null },
      isLoaded: true,
    });
    render(<CustomUserButton />);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("shows initials when no avatar", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { ...mockUser, imageUrl: null },
      isLoaded: true,
    });
    render(<CustomUserButton />);

    const avatar = screen.getByTestId("user-initials");
    expect(avatar).toHaveTextContent("JD");
  });

  it("applies hover effect to menu items", () => {
    render(<CustomUserButton />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const menuItems = screen.getAllByRole("menuitem");
    menuItems.forEach(item => {
      expect(item).toHaveClass("hover:bg-gray-100");
    });
  });

  it("handles keyboard navigation", () => {
    render(<CustomUserButton />);

    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key: "Enter" });

    expect(screen.getByText("Account")).toBeInTheDocument();

    const menuItems = screen.getAllByRole("menuitem");
    expect(document.activeElement).toBe(menuItems[0]);

    fireEvent.keyDown(menuItems[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(menuItems[1]);
  });
}); 