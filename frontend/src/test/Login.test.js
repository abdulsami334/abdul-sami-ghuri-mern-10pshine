import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/login";
import { loginUser } from "../api/auth";
import { BrowserRouter } from "react-router-dom";
import React from "react";
jest.mock("../api/auth");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {

  test("renders login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
  });

  test("submits login form successfully", async () => {

    loginUser.mockResolvedValue({
      data: {
        token: "fake-token",
        user: { name: "Sami", email: "test@gmail.com" }
      }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@gmail.com" }
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();
      expect(localStorage.getItem("token")).toBe("fake-token");
    });
  });

});
