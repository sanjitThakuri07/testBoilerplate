/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "src/store/zustand/globalStates/auth";
import React from "react";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { tr } from "date-fns/locale";
interface Props {
  children: React.ReactNode;
}

const GuestRoute: React.FC<any> = ({ children }: Props) => {
  const authenticated = useAuthStore((state) => state.authenticated);
  const { userType } = userDataStore();

  // const navigationHandler = () => {
  //   if (userType === 'Platform_owner') {
  //     return <Navigate to="/dashboard" replace />;
  //   } else if (userType === 'Tenant') {
  //     return <Navigate to="/dashboard" replace />;
  //   } else if (userType === 'Organization') {
  //     return <Navigate to="/organization/no-data" replace />;
  //   }
  // };
  // return !authenticated ? <>{children}</> || <Outlet /> : <Navigate to="/dashboard" replace />;
  let returnRoute = "";
  if (userType) {
    returnRoute = sessionStorage.getItem("return-path") || "";
  }
  return !authenticated ? (
    <>{children}</> || <Outlet />
  ) : (
    <Navigate
      to={
        localStorage.getItem("two_factor_authentication") === "true"
          ? "/otp"
          : userType === "Platform_owner"
          ? "/dashboard"
          : userType === "Tenant"
          ? "/dashboard"
          : userType === "Organization"
          ? returnRoute || "/organization/no-data"
          : userType === "Customer"
          ? returnRoute || "/organization/no-data"
          : returnRoute || "/"
      }
      replace
    />
  );
};

export default GuestRoute;
