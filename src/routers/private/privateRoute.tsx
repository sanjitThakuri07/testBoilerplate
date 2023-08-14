/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "src/store/zustand/globalStates/auth";
import jwt_decode from "jwt-decode";
import React, { useEffect } from "react";
import Layout from "src/modules/layout";
import FullPageOutlet from "./fullPageOutlet";
import ExpiryPopup from "./tokenExpDia";
import { userDataStore } from "src/store/zustand/globalStates/userData";

interface ReactNodeProps {
  children: React.ReactNode;
  newPage?: boolean;
  className?: string;
}
export interface DecodedTokenProps {
  client_id: String;
  exp: number;
  id: number;
  role: String;
  sub: String;
  two_factor_authentication: boolean;
  user_name: String;
}

const PrivateRoute: React.FC<any> = ({ children, newPage = false, className }: ReactNodeProps) => {
  const location = useLocation();
  const authenticated = useAuthStore((state) => state.authenticated);
  const token = userDataStore((state) => state.token);
  const type = userDataStore((state) => state.userType);
  let returnRoute = "";
  let decodedToken: DecodedTokenProps;
  let exp = 0;
  if (token) {
    decodedToken = jwt_decode(token);
    exp = decodedToken?.exp;
    exp = exp * 1000;
  } else {
    if (sessionStorage.getItem("return-path") !== "reset") {
      returnRoute = location?.pathname + location?.search;
      sessionStorage.setItem("return-path", returnRoute);
    } else {
      console.log("here");
      sessionStorage.removeItem("return-path");
    }
  }

  return authenticated ? (
    <>
      <>
        {newPage ? (
          <FullPageOutlet
            className={`${className}`}
            containerClassName={` ${newPage ? "full__page-grid" : ""}`}
          >
            <>
              {exp > Date.now() ? (
                <>{children}</>
              ) : (
                <>
                  <ExpiryPopup />
                </>
              )}
            </>
          </FullPageOutlet>
        ) : (
          <Layout className={newPage ? "full__page-grid" : ""}>
            {
              <>
                {exp > Date.now() ? (
                  <>
                    {children} <Outlet />
                  </>
                ) : (
                  <>
                    <ExpiryPopup />
                  </>
                )}
              </>
            }
          </Layout>
        )}
      </>
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
