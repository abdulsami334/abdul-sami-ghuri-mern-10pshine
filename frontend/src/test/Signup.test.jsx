import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../pages/signup";
import { BrowserRouter } from "react-router-dom";
import { signupUser } from "../api/auth";

jest.mock("../api/auth");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Signup Component", () => {

  test("renders signup form", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("Enter your full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Create a strong password")).toBeInTheDocument();
  });

  test("shows validation errors when empty submit", async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // force empty values
    fireEvent.change(screen.getByPlaceholderText("Enter your full name"), {
      target: { value: "" }
    });

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "" }
    });

    fireEvent.change(screen.getByPlaceholderText("Create a strong password"), {
      target: { value: "" }
    });

    fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form"));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test("submits signup successfully", async () => {
    signupUser.mockResolvedValue({
      data: {
        user: { name: "Sami", email: "test@gmail.com" }
      }
    });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your full name"), {
      target: { value: "Sami" }
    });

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@gmail.com" }
    });

    fireEvent.change(screen.getByPlaceholderText("Create a strong password"), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(signupUser).toHaveBeenCalled();
    });
  });

});
