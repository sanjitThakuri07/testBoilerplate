import { PrivateRoute } from "src/constants/variables";
import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthRouter from "src/routers/auth/authRoute";

import PrivateRouter from "src/routers/private/privateRoute";

import FullPageOutlet from "src/routers/private/fullPageOutlet";

import OTP from "src/modules/twofactor/otp";

import PageNotFound from "src/modules/pages/message/PageNotFound";
import { authRoutes, privateRoutes, publicRoutes } from "src/routers/mainRoutes";

const AppRouter: React.FC = () => {
  return (
    <React.Fragment>
      <Routes>
        {authRoutes.map((route) => (
          <Route element={<AuthRouter>{route.component}</AuthRouter>} path={route.path} />
        ))}

        {publicRoutes.map((route) => (
          <Route
            element={
              <FullPageOutlet
                showTopbar={route?.showTopbar}
                containerClassName={route?.className || ""}
              >
                {route.component}
              </FullPageOutlet>
            }
            path={route.path}
          />
        ))}
        {privateRoutes.map((route: any) => (
          <Route
            element={
              <PrivateRouter
                newPage={route?.newPage}
                className={route?.className ? route?.className : ""}
              >
                {route.component}
              </PrivateRouter>
            }
            path={route.path}
          />
        ))}

        <Route
          element={
            <FullPageOutlet publicPage hideeBackButton>
              <OTP />
            </FullPageOutlet>
          }
          path={PrivateRoute.OTP}
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </React.Fragment>
  );
};
export default AppRouter;
