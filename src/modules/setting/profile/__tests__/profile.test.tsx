/** D */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { SnackbarProvider } from "notistack"
import Profile from "..";
import userEvent from '@testing-library/user-event'
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();
afterEach(cleanup);
describe('Profile renders correctly', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const fakeUsers = [
    { id: 1, name: 'Joe' },
    { id: 2, name: 'Tony' },
  ]
  fetchMock.mockResponse(JSON.stringify(fakeUsers));
    // render(
    //   <SnackbarProvider>
    //      <Profile />
    // </SnackbarProvider>)

  // test('renders users when API call succeeds', async () => {
    
   
    
  // })

  test('renders error when API call fails', async () => {})
})

// test("Profile page renders correctly.", async () => {
//   // const fetchProfile = jest.fn()
  //   render(
  //     <SnackbarProvider>
  //        <Profile />
  //   </SnackbarProvider>
  //  )
   
//   //  const title = screen.getByText(/Personal Details/i);
//   //  expect(title).toBeInTheDocument();
//   //  const subTitle = screen.getByText(/Update your personal photo and details here./i);
//   //  expect(subTitle).toBeInTheDocument();
//   });

  // test('rendering and submitting profile form', async () => {
  //   // const handleSubmit = jest.fn()
  //   render(<SnackbarProvider>
  //       <Profile />
  //  </SnackbarProvider>)
  //   // const user = userEvent;
  
  //   //  user.type(screen.getByPlaceholderText(/Kristy Craker/i), 'John');
  // //Update Details not found in the screen
  //   //  user.click(screen.getByText(/Update Details/i));
  
  //   // await waitFor(() =>
  //   //   expect(handleSubmit).toHaveBeenCalledWith({
  //   //     email: 'john.dee@someemail.com',
  //   //     firstName: 'John',
  //   //     lastName: 'Dee',
  //   //   }),
  //   // )
  // })