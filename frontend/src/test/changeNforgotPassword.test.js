import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import ChangePassword from "../pages/ChangePassword";
import ForgotPassword from "../pages/ForgotPassword";

// mock navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// mock forgotPassword API
jest.mock("../api/auth", () => ({
  forgotPassword: jest.fn(() => Promise.resolve()),
  getMyProfile: jest.fn(() =>
    Promise.resolve({
      data: {
        name: "Test User",
        email: "test@gmail.com"
      }
    })
  ),
}));


/* ============================
   Change Password Tests
============================ */
describe("ChangePassword Component", () => {

  test("renders change password form", () => {
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );

    expect(
      screen.getByPlaceholderText(/enter your current password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/enter your new password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/confirm your new password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /update password/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: /update password/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/current password is required/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/new password is required/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/please confirm your new password/i)
      ).toBeInTheDocument();
    });
  });

});

/* ============================
   Forgot Password Tests
============================ */
describe("ForgotPassword Component", () => {

  test("renders forgot password form", () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    expect(
      screen.getByPlaceholderText(/you@example.com/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).toBeInTheDocument();
  });

  test("shows error when invalid email submitted", async () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    fireEvent.change(
  screen.getByPlaceholderText(/you@example.com/i),
  { target: { value: "invalidemail" } }
);

fireEvent.submit(
  screen.getByRole("button", { name: /send reset link/i }).closest("form")
);

await waitFor(() => {
  expect(
    screen.getByText(/valid email/i)
  ).toBeInTheDocument();
});


  });

  test("submits forgot password successfully", async () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText(/you@example.com/i),
      { target: { value: "test@gmail.com" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /send reset link/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /check your email/i })
      ).toBeInTheDocument();
    });
  });

});
