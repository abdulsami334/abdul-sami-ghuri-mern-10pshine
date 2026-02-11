import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NoteForm from "../pages/NoteForm";
import { BrowserRouter } from "react-router-dom";
import * as notesApi from "../api/notes";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({})
}));

jest.mock("../api/notes");

let alertMock;
let confirmMock;

beforeEach(() => {
  alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
  confirmMock = jest.spyOn(window, "confirm").mockImplementation(() => true);
  jest.clearAllMocks();
});

afterEach(() => {
  alertMock.mockRestore();
  confirmMock.mockRestore();
});

describe("NoteForm Component", () => {

  test("renders title input with correct placeholder", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText(/untitled document/i);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("");
  });

  test("shows validation message when title is empty", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  test("save button is disabled when title is empty", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const saveButtons = screen.getAllByRole("button");
    const headerSaveButton = saveButtons.find(btn => 
      btn.textContent.includes("Save Note")
    );
    
    expect(headerSaveButton).toBeDisabled();
  });

  test("enables save button when title is provided", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText(/untitled document/i);
    fireEvent.change(titleInput, { target: { value: "My Note" } });

    const saveButtons = screen.getAllByRole("button");
    const headerSaveButton = saveButtons.find(btn => 
      btn.textContent.includes("Save Note")
    );
    
    expect(headerSaveButton).not.toBeDisabled();
  });

  test("hides validation message when title is provided", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText(/untitled document/i);
    
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    
    fireEvent.change(titleInput, { target: { value: "My Note" } });

    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
  });

  test("renders rich text editor", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveAttribute('placeholder', 'Start writing your thoughts here... ✍️');
  });

  test("updates word and character count", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const editor = document.querySelector('[contenteditable="true"]');
    
    // Initially word count aur char count 0 hona chahiye
    // Check specific text instead of just "0"
    expect(screen.getByText(/0 words/i)).toBeInTheDocument();
    expect(screen.getByText(/0 chars/i)).toBeInTheDocument();

    if (editor) {
      editor.innerHTML = "Hello World Test";
      fireEvent.input(editor);
    }

    // 3 words hone chahiye
    expect(screen.getByText(/3 words/i)).toBeInTheDocument();
    
    // 16 characters hone chahiye
    expect(screen.getByText(/16 chars/i)).toBeInTheDocument();
  });

  test("creates note successfully", async () => {
    notesApi.createNote.mockResolvedValue({
      data: { id: "123" }
    });

    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText(/untitled document/i);
    fireEvent.change(titleInput, { target: { value: "Test Note" } });

    const editor = document.querySelector('[contenteditable="true"]');
    if (editor) {
      editor.innerHTML = "Test content";
      fireEvent.input(editor);
    }

    const saveButtons = screen.getAllByRole("button");
    const headerSaveButton = saveButtons.find(btn => 
      btn.textContent.includes("Save Note")
    );
    
    fireEvent.click(headerSaveButton);

    await waitFor(() => {
      expect(notesApi.createNote).toHaveBeenCalledWith({
        title: "Test Note",
        content: "Test content"
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    }, { timeout: 10000 });
  });

  test("prevents multiple submissions", async () => {
    notesApi.createNote.mockResolvedValue({
      data: { id: "123" }
    });

    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText(/untitled document/i);
    fireEvent.change(titleInput, { target: { value: "Test Note" } });

    const saveButtons = screen.getAllByRole("button");
    const headerSaveButton = saveButtons.find(btn => 
      btn.textContent.includes("Save Note")
    );
    
    fireEvent.click(headerSaveButton);
    fireEvent.click(headerSaveButton);
    fireEvent.click(headerSaveButton);

    await waitFor(() => {
      expect(notesApi.createNote).toHaveBeenCalledTimes(1);
    }, { timeout: 5000 });
  });

  test("shows loading state while saving", async () => {
    notesApi.createNote.mockImplementation(
      () => new Promise(resolve => 
        setTimeout(() => resolve({ data: { id: "123" } }), 50)
      )
    );

    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText(/untitled document/i);
    fireEvent.change(titleInput, { target: { value: "Test Note" } });

    const saveButtons = screen.getAllByRole("button");
    const headerSaveButton = saveButtons.find(btn => 
      btn.textContent.includes("Save Note")
    );
    
    fireEvent.click(headerSaveButton);

    expect(screen.getByText(/saving/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    }, { timeout: 5000 });
  });

  test("handles API error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    notesApi.createNote.mockRejectedValue(new Error("API Error"));

    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText(/untitled document/i);
    fireEvent.change(titleInput, { target: { value: "Test Note" } });

    const saveButtons = screen.getAllByRole("button");
    const headerSaveButton = saveButtons.find(btn => 
      btn.textContent.includes("Save Note")
    );
    
    fireEvent.click(headerSaveButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to save note. Please try again.");
    }, { timeout: 5000 });

    consoleErrorSpy.mockRestore();
  });

  test("shows confirmation when leaving with unsaved changes", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText(/untitled document/i);
    fireEvent.change(titleInput, { target: { value: "Unsaved Note" } });

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(confirmMock).toHaveBeenCalledWith(
      "You have unsaved changes. Are you sure you want to leave?"
    );
  });

  test("navigates back without confirmation when no changes", () => {
    confirmMock.mockRestore();
    const newConfirmMock = jest.spyOn(window, "confirm").mockImplementation(() => true);

    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(newConfirmMock).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");

    newConfirmMock.mockRestore();
  });

  test("displays word count in status bar", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const editor = document.querySelector('[contenteditable="true"]');
    
    if (editor) {
      editor.innerHTML = "One Two Three Four";
      fireEvent.input(editor);
    }

    expect(screen.getByText(/4 words/i)).toBeInTheDocument();
  });

  test("displays character count in status bar", () => {
    render(
      <BrowserRouter>
        <NoteForm />
      </BrowserRouter>
    );

    const editor = document.querySelector('[contenteditable="true"]');
    
    if (editor) {
      editor.innerHTML = "Hello";
      fireEvent.input(editor);
    }

    expect(screen.getByText(/5 chars/i)).toBeInTheDocument();
  });

});