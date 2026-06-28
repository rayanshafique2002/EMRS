import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./login";

describe("Login registration form", () => {
  it("shows a role selector when switching to register mode", () => {
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /register with email/i }));

    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });
});
