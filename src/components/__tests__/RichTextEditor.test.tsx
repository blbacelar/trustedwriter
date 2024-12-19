import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RichTextEditor from "../RichTextEditor";
import { useEditor } from "@tiptap/react";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock TipTap
jest.mock("@tiptap/react", () => ({
  useEditor: jest.fn(),
  EditorContent: ({ editor }: { editor: any }) => (
    <div data-testid="editor-content">{editor?.getHTML()}</div>
  ),
}));

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "editor.placeholder": "Start typing...",
        "editor.bold": "Bold",
        "editor.italic": "Italic",
        "editor.bullet": "Bullet list",
        "editor.number": "Numbered list",
        "editor.save": "Save",
        "editor.cancel": "Cancel",
        "editor.copy": "Copy",
        "editor.saving": "Saving...",
      };
      return translations[key] || key;
    },
  }),
}));

describe("RichTextEditor", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnCopy = jest.fn();
  const mockGetHTML = jest.fn();
  const mockChain = {
    focus: jest.fn().mockReturnThis(),
    toggleBold: jest.fn().mockReturnThis(),
    toggleItalic: jest.fn().mockReturnThis(),
    toggleBulletList: jest.fn().mockReturnThis(),
    toggleOrderedList: jest.fn().mockReturnThis(),
    run: jest.fn(),
  };
  const mockEditor = {
    getHTML: mockGetHTML,
    chain: () => mockChain,
    can: () => true,
  };

  beforeEach(() => {
    (useEditor as jest.Mock).mockReturnValue(mockEditor);
    mockGetHTML.mockReturnValue("<p>Test content</p>");
    jest.clearAllMocks();
  });

  it("renders editor with toolbar", () => {
    render(
      <RichTextEditor
        initialContent="Test content"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onCopy={mockOnCopy}
      />
    );
    
    expect(screen.getByTestId("editor-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("editor-content")).toBeInTheDocument();
  });

  it("formats toolbar buttons correctly", () => {
    render(
      <RichTextEditor
        initialContent="Test content"
        onSave={mockOnSave}
        onCopy={mockOnCopy}
      />
    );
    
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toHaveClass(
        "p-2",
        "rounded",
        "hover:bg-gray-100",
        "transition-colors"
      );
    });
  });

  it("applies formatting when toolbar buttons are clicked", () => {
    render(
      <RichTextEditor
        initialContent="Test content"
        onSave={mockOnSave}
        onCopy={mockOnCopy}
      />
    );

    // Test bold
    fireEvent.click(screen.getByTitle("Bold"));
    expect(mockChain.toggleBold).toHaveBeenCalled();

    // Test italic
    fireEvent.click(screen.getByTitle("Italic"));
    expect(mockChain.toggleItalic).toHaveBeenCalled();

    // Test bullet list
    fireEvent.click(screen.getByTitle("Bullet list"));
    expect(mockChain.toggleBulletList).toHaveBeenCalled();

    // Test numbered list
    fireEvent.click(screen.getByTitle("Numbered list"));
    expect(mockChain.toggleOrderedList).toHaveBeenCalled();
  });

  it("handles save button click", async () => {
    mockGetHTML.mockReturnValue("<p>Updated content</p>");

    render(
      <RichTextEditor
        initialContent="Initial content"
        onSave={mockOnSave}
        onCopy={mockOnCopy}
      />
    );

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith("Updated content");
    });
  });

  it("handles copy button click", () => {
    mockGetHTML.mockReturnValue("<p>Content to copy</p>");

    render(
      <RichTextEditor
        initialContent="Initial content"
        onSave={mockOnSave}
        onCopy={mockOnCopy}
      />
    );

    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);

    expect(mockOnCopy).toHaveBeenCalledWith("Content to copy");
  });

  it("shows cancel button when onCancel prop is provided", () => {
    render(
      <RichTextEditor
        initialContent="Test content"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onCopy={mockOnCopy}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();
    
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("shows loading state while saving", async () => {
    mockOnSave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <RichTextEditor
        initialContent="Test content"
        onSave={mockOnSave}
        onCopy={mockOnCopy}
      />
    );

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument(); // Loading spinner

    await waitFor(() => {
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });

  it("disables buttons while saving", async () => {
    mockOnSave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <RichTextEditor
        initialContent="Test content"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onCopy={mockOnCopy}
      />
    );

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });

    await waitFor(() => {
      const enabledButtons = screen.getAllByRole("button");
      enabledButtons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  it("cleans HTML content properly", () => {
    mockGetHTML.mockReturnValue("<p>First paragraph</p><p>Second paragraph</p>");

    render(
      <RichTextEditor
        initialContent="Test content"
        onSave={mockOnSave}
        onCopy={mockOnCopy}
      />
    );

    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);

    expect(mockOnCopy).toHaveBeenCalledWith("First paragraph\n\nSecond paragraph");
  });

  it("renders formatting buttons", () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />);
    
    expect(screen.getByTitle("Bold")).toBeInTheDocument();
    expect(screen.getByTitle("Italic")).toBeInTheDocument();
    expect(screen.getByTitle("Bullet list")).toBeInTheDocument();
    expect(screen.getByTitle("Numbered list")).toBeInTheDocument();
  });

  it("handles text input", () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />);
    
    const editor = screen.getByRole("textbox");
    fireEvent.change(editor, { target: { value: "Test content" } });
    
    expect(mockOnChange).toHaveBeenCalledWith("Test content");
  });

  it("applies bold formatting", () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />);
    
    const boldButton = screen.getByTitle("Bold");
    fireEvent.click(boldButton);
    
    expect(boldButton).toHaveClass("bg-gray-200");
  });

  it("applies italic formatting", () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />);
    
    const italicButton = screen.getByTitle("Italic");
    fireEvent.click(italicButton);
    
    expect(italicButton).toHaveClass("bg-gray-200");
  });

  it("creates bullet list", () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />);
    
    const bulletButton = screen.getByTitle("Bullet list");
    fireEvent.click(bulletButton);
    
    const editor = screen.getByRole("textbox");
    expect(editor.innerHTML).toContain("<ul>");
  });

  it("creates numbered list", () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />);
    
    const numberButton = screen.getByTitle("Numbered list");
    fireEvent.click(numberButton);
    
    const editor = screen.getByRole("textbox");
    expect(editor.innerHTML).toContain("<ol>");
  });

  it("displays initial value", () => {
    const initialValue = "Initial content";
    render(<RichTextEditor value={initialValue} onChange={mockOnChange} />);
    
    const editor = screen.getByRole("textbox");
    expect(editor).toHaveValue(initialValue);
  });

  it("handles keyboard shortcuts", () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />);
    
    const editor = screen.getByRole("textbox");
    
    // Bold shortcut (Ctrl+B)
    fireEvent.keyDown(editor, { key: "b", ctrlKey: true });
    expect(screen.getByTitle("Bold")).toHaveClass("bg-gray-200");
    
    // Italic shortcut (Ctrl+I)
    fireEvent.keyDown(editor, { key: "i", ctrlKey: true });
    expect(screen.getByTitle("Italic")).toHaveClass("bg-gray-200");
  });

  it("maintains editor state between renders", () => {
    const { rerender } = render(<RichTextEditor value="Test" onChange={mockOnChange} />);
    
    const editor = screen.getByRole("textbox");
    fireEvent.change(editor, { target: { value: "Updated content" } });
    
    rerender(<RichTextEditor value="Updated content" onChange={mockOnChange} />);
    expect(editor).toHaveValue("Updated content");
  });

  it("applies correct styling to toolbar buttons", () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />);
    
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toHaveClass(
        "p-2",
        "rounded",
        "hover:bg-gray-100",
        "transition-colors"
      );
    });
  });
}); 