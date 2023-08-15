import styled from "src/theme/mui/styled";

import { ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Styles = styled("div")<{ customStyle }>`
  ${({ customStyle }) =>
    customStyle
      ? `

      .Toastify__toast {
    padding-right: 15px;
    padding-left: 15px;
    min-width: 300px;
    border: 1px solid gray;
  }

  .Toastify__close-button {
    padding-top: 15px;

    // :hover {
    //   color: green;
    // }
  }

  .Toastify__toast > button > svg {
    /* display: none; */
  }

  .Toastify__toast--success {
    border: 1px solid #3a9ea5;
    border-radius: 70px;
    background: #f0f9fa;
  }

  /* .Toastify__toast--success::before {
    content: url("src/assets/images/svg/successToast.svg"); // Your svg Path
    position: relative;
    z-index: 100000;
    left: 12px;
    top: 6px;
  }

  .Toastify__toast--success::after {
    content: url("./closeToast.svg"); // Your svg Path
    position: absolute;
    color: #333333;
    font-size: 15px;
    font-weight: 700;
    left: 265px;
    padding-top: 14px !important;
  } */

   .Toastify__toast--warning {
    border: 1px solid #e78326 !important;
    border-radius: 70px !important;
    background: #fadfc5 !important;
  }

  .Toastify__toast--error {
    border: 1px solid #eb5757;
    border-radius: 70px !important;
    background: #fae1e2 !important;
  }
  `
      : null}
`;

function Notification({ customStyle = false, ...rest }) {
  return (
    <Styles customStyle={customStyle}>
      <ToastContainer {...rest} />
    </Styles>
  );
}

// facade
function Notify(message: string, options?: ToastOptions) {
  toast(message, options);
}

export default Notification;
export { Notify };
