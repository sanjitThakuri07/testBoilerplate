import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Notification from "src/components/Notification/Notification";
import ReactError from "src/modules/errors/ReactError";
import { initializeStore } from "src/store/redux";
import "src/styles/main.scss";
import ReactThemeProvider from "src/theme/custom/ReactThemeProvider";
import { MuiThemeProvider } from "src/theme/mui/MuiThemeProvider";
// import "src/theme_old/sass/index.scss";
import Routes from "./App";
import StyledThemeProvider from "./theme/styled-component/StyledThemeProvider";
// import ReactThemeProvider from  "src/modules/ReactThemeProvider/ReactThemeProvider";

const store = initializeStore();
const errorHandler = (error: any, errorInfo: any) => {
  console.error("Logging error", errorInfo, error);
};

// on every referesh, Index.tsx-->App.tsx --> Layout.tsx --> HOC --> HOCComponent is the execution order.

function AppIndex() {
  return (
    <ErrorBoundary FallbackComponent={ReactError} onError={errorHandler}>
      <ReduxProvider store={store}>
        {/* <ReactThemeProvider> */}
        {/* <StyledThemeProvider> */}
        {/* <Notification
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            /> */}
        {/* <MuiThemeProvider> */}
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
        {/* </MuiThemeProvider> */}
        {/* </StyledThemeProvider> */}
        {/* </ReactThemeProvider> */}
      </ReduxProvider>
    </ErrorBoundary>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  <AppIndex />,
  // </React.StrictMode>,
);

// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
