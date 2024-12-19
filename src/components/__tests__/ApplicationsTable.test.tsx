import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ApplicationsTable from "../ApplicationsTable";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock dependencies
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "table.company": "Company",
        "table.position": "Position",
        "table.status": "Status",
        "table.date": "Date",
        "table.actions": "Actions",
        "table.empty": "No applications found",
        "table.loading": "Loading applications...",
        "status.pending": "Pending",
        "status.applied": "Applied",
        "status.rejected": "Rejected",
        "status.interview": "Interview",
        "actions.edit": "Edit",
        "actions.delete": "Delete",
      };
      return translations[key] || key;
    },
  }),
}));

describe("ApplicationsTable", () => {
  const mockApplications = [
    {
      id: "1",
      company: "Test Corp",
      position: "Developer",
      status: "pending",
      createdAt: new Date("2024-01-01"),
      url: "https://test.com",
    },
    {
      id: "2",
      company: "Tech Inc",
      position: "Engineer",
      status: "applied",
      createdAt: new Date("2024-01-02"),
      url: "https://tech.com",
    },
  ];

  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table headers correctly", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Position")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders application data correctly", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("Test Corp")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("January 1, 2024")).toBeInTheDocument();
  });

  it("handles edit action", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButtons = screen.getAllByTitle("Edit");
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockApplications[0]);
  });

  it("handles delete action", async () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButtons = screen.getAllByTitle("Delete");
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion in dialog
    const confirmButton = screen.getByText("Delete");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockApplications[0].id);
    });
  });

  it("shows empty state when no applications", () => {
    render(
      <ApplicationsTable
        applications={[]}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("No applications found")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        isLoading={true}
      />
    );

    expect(screen.getByText("Loading applications...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies correct status badge styles", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const pendingBadge = screen.getByText("Pending");
    const appliedBadge = screen.getByText("Applied");

    expect(pendingBadge).toHaveClass("bg-yellow-100", "text-yellow-800");
    expect(appliedBadge).toHaveClass("bg-green-100", "text-green-800");
  });

  it("renders clickable company links", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const companyLinks = screen.getAllByRole("link");
    expect(companyLinks[0]).toHaveAttribute("href", "https://test.com");
    expect(companyLinks[1]).toHaveAttribute("href", "https://tech.com");
  });

  it("sorts applications by date", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const dateHeader = screen.getByText("Date");
    fireEvent.click(dateHeader);

    const dates = screen.getAllByText(/January \d, 2024/);
    expect(dates[0]).toHaveTextContent("January 2, 2024");
    expect(dates[1]).toHaveTextContent("January 1, 2024");
  });
}); 