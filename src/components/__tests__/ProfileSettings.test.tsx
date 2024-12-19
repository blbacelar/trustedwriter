import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileSettings from "../ProfileSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

// Mock dependencies
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "settings.profile.title": "Profile Settings",
        "settings.profile.name": "Full Name",
        "settings.profile.email": "Email",
        "settings.profile.save": "Save Changes",
        "settings.profile.saved": "Profile updated successfully",
        "settings.profile.error": "Error updating profile",
        "settings.profile.loading": "Saving...",
      };
      return translations[key] || key;
    },
  }),
}));

describe("ProfileSettings", () => {
  const mockUser = {
    id: "user_123",
    fullName: "John Doe",
    primaryEmailAddress: { emailAddress: "john@example.com" },
    update: jest.fn(),
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser, isLoaded: true });
    jest.clearAllMocks();
  });

  it("renders profile form with user data", () => {
    render(<ProfileSettings />);

    expect(screen.getByText("Profile Settings")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name")).toHaveValue("John Doe");
    expect(screen.getByLabelText("Email")).toHaveValue("john@example.com");
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
  });

  it("handles successful profile update", async () => {
    mockUser.update.mockResolvedValueOf({});
    render(<ProfileSettings />);

    const nameInput = screen.getByLabelText("Full Name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const saveButton = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUser.update).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Doe",
      });
      expect(toast.success).toHaveBeenCalledWith("Profile updated successfully");
    });
  });

  it("handles profile update error", async () => {
    mockUser.update.mockRejectedValue(new Error("Update failed"));
    render(<ProfileSettings />);

    const saveButton = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error updating profile");
    });
  });

  it("shows loading state during update", async () => {
    mockUser.update.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<ProfileSettings />);

    const saveButton = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(saveButton);

    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText("Save Changes")).toBeInTheDocument();
      expect(saveButton).not.toBeDisabled();
    });
  });

  it("validates required fields", async () => {
    render(<ProfileSettings />);

    const nameInput = screen.getByLabelText("Full Name");
    fireEvent.change(nameInput, { target: { value: "" } });

    const saveButton = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(saveButton);

    expect(mockUser.update).not.toHaveBeenCalled();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("handles name parsing correctly", async () => {
    render(<ProfileSettings />);

    const nameInput = screen.getByLabelText("Full Name");
    fireEvent.change(nameInput, { target: { value: "Jane Marie Doe" } });

    const saveButton = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUser.update).toHaveBeenCalledWith({
        firstName: "Jane Marie",
        lastName: "Doe",
      });
    });
  });

  it("disables form when user is not loaded", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, isLoaded: false });
    render(<ProfileSettings />);

    const nameInput = screen.getByLabelText("Full Name");
    const saveButton = screen.getByRole("button", { name: "Save Changes" });

    expect(nameInput).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });

  it("shows error for invalid name format", async () => {
    render(<ProfileSettings />);

    const nameInput = screen.getByLabelText("Full Name");
    fireEvent.change(nameInput, { target: { value: "123" } });

    const saveButton = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(saveButton);

    expect(screen.getByText("Please enter a valid name")).toBeInTheDocument();
    expect(mockUser.update).not.toHaveBeenCalled();
  });

  it("preserves form state after failed submission", async () => {
    mockUser.update.mockRejectedValue(new Error("Update failed"));
    render(<ProfileSettings />);

    const nameInput = screen.getByLabelText("Full Name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const saveButton = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue("Jane Doe");
    });
  });

  it("handles form reset", () => {
    render(<ProfileSettings />);

    const nameInput = screen.getByLabelText("Full Name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const resetButton = screen.getByRole("button", { name: "Reset" });
    fireEvent.click(resetButton);

    expect(nameInput).toHaveValue("John Doe");
  });
}); 