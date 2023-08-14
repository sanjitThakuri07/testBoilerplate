import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { SnackbarProvider } from "notistack"
import ChangePassword from "../ChangePassword";

afterEach(cleanup);
test("Password Change page renders correctly.", async () => {
  // const fetchProfile = jest.fn()
    render(<SnackbarProvider><ChangePassword /></SnackbarProvider>)
   
  //  const title = screen.getByText(/Personal Details/i);
});