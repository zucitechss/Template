import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";  // Add this import
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpForm from "@/components/Authentication/SignUpForm"; // Adjust import based on file path
import axios from "axios";
import { useRouter } from "next/navigation";
jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignUpForm Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test("renders the SignUpForm component", () => {
    render(<SignUpForm />);
  // Check for the form heading specifically
  const heading = screen.getByRole('heading', { name: /sign up/i });
  expect(heading).toBeInTheDocument();

  // Check for the sign-up button specifically
  const signUpButton = screen.getByRole('button', { name: /sign up/i });
  expect(signUpButton).toBeInTheDocument();

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test("shows validation errors when form is submitted empty", async () => {
    render(<SignUpForm />);

    fireEvent.submit(screen.getByRole("button", { name: /Sign Up/i }));

    expect(await screen.findByText(/First name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  test("shows error when an invalid email is entered", async () => {
    render(<SignUpForm />);
  
    fireEvent.change(screen.getByRole("textbox", { name: /email/i })
    , {
      target: { value: "invalid-email" }, // Entering an invalid email
    });
  
    fireEvent.submit(screen.getByRole("button", { name: /Sign Up/i }));
  
    expect(await screen.findByText(/Enter a valid email address/i)).toBeInTheDocument();
  });
  
  test("submits form successfully and redirects", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "Registration successful" } });
  
    render(<SignUpForm />);
  
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe"); // Add Last Name
    await userEvent.type(screen.getByRole("textbox", { name: /email/i }), "john@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "Password123");
  
    await userEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
  
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/authentication/sign-in");
    });
  
    expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
  });
  

  test("handles server error on form submission", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: "Email already exists" },
    });

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "john.doe@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    fireEvent.submit(screen.getByRole("button", { name: /Sign Up/i }));

    expect(await screen.findByText(/Email already exists/i)).toBeInTheDocument();
  });

  test("displays validation icons for valid inputs", async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.blur(screen.getByLabelText(/First Name/i));

    expect(await screen.findByTitle(/Valid first name/i)).toBeInTheDocument();
  });
});
