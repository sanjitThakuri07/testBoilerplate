import E404 from "src/modules/errors/E404";

import { Outlet, useRoutes } from "react-router-dom";
import Dashboard from "src/modules/dashboard__test/index";
// import routes
// import controllerRoutes from "src/modules/configuration/controllers/routes";

// import { Login } from "src/modules/auth";
import Index from "src/modules/dashboard__test/index";
import ProjectRouter from "src/routers/index";

import app from "src/constants/app";
import { useEffect } from "react";
import { fetchApI } from "./modules/apiRequest/apiRequest";
import { useLayoutStore } from "./store/zustand/globalStates/layout";
import { usePermissionStore } from "./store/zustand/permission";
import { userDataStore } from "./store/zustand/globalStates/userData";
import { loggedUserDataStore } from "./store/zustand/globalStates/loggedUserData";
import useAppStore from "./store/zustand/app/index";
// import Layout from "src/containers/Layout";

// import withAuth from "src/hoc/withAuth";
// import withProtectedSidebar from "src/hoc/withProtectedSidebar";
// import E400 from "src/modules/errors/E400";
// import E401 from "src/modules/errors/E401";
// import E403 from "src/modules/errors/E403";
// import E500 from "src/modules/errors/E500";
// import E503 from "src/modules/errors/E503";
// import ReactError from "src/modules/errors/ReactError";
// import UnderConstruction from "src/modules/errors/under-construction";

// const OutletWithAuth = withAuth(Outlet);
// const OutletWithSidebar = withProtectedSidebar(Outlet);
// // const LayoutWithSidebar = withProtectedSidebar(Layout);
// const IndexWithAuthAndSidebar = withProtectedSidebar(withAuth(Index));
// const LayoutWithProtectedSidebar = withProtectedSidebar(Layout);

// Non-Layout Routes: Pages which are rendered outside Layout components
// const authRoutes = [
//   // { path: app.auth.login, element: <Login /> },
//   { path: app.auth.register, element: <div>Register</div> },
//   { path: app.auth.forgotPassword, element: <div>Forgot Password</div> },
//   { path: app.auth.resetPassword, element: <div>Reset Password</div> },
// ];

// Layout routes: Pages which are rendered inside Layout components

// const indexRoutes = [
//   {
//     path: "/",
//     element: <IndexWithAuthAndSidebar />,
//   },
// ];

// const errorRoutes = [
//   {
//     element: <OutletWithSidebar />,
//     children: [
//       { path: "/bad-request", element: <E400 /> },
//       { path: "/unauthorized", element: <E401 /> },
//       { path: "/forbidden", element: <E403 /> },
//       { path: "/server-error", element: <E500 /> },
//       { path: "/service-unavailable", element: <E503 /> },
//       { path: "/under-construction", element: <UnderConstruction /> },
//       { path: "/react-error", element: <ReactError /> },
//       { path: "*", element: <E404 /> },
//     ],
//   },
// ];

// const routes = [
//   ...authRoutes,
//   {
//     element: (
//       <LayoutWithProtectedSidebar>
//         <OutletWithAuth redirectTo="/login" />
//       </LayoutWithProtectedSidebar>
//     ),
//     errorElement: () => <div>Encountered route error</div>,
//     children: [
//       ...indexRoutes,

//     ],
//   },
// ];

// const routes = [
//   {
//     path: "/",
//     element: <Dashboard />,
//   },
// ];

function AppRoutes() {
  const layoutStore = useLayoutStore((state) => state);
  const { systemParameters, fetchSystemParameters, fetchSystemSecurity }: any = useAppStore();
  const { getPermissions } = usePermissionStore();
  const { userType } = userDataStore();
  const { setOrgData } = loggedUserDataStore();
  const { fetchProfile }: any = useAppStore();

  const fetchDetails = async ({ url }: any) => {
    await fetchApI({
      url: url,
      getAll: true,
      setterFunction: (data: any) => {
        setOrgData({
          org_name: data?.org_name,
          logo: data?.profilePicture,
          country_code: data?.country,
        });
      },
    });
  };

  useEffect(() => {
    if (localStorage.getItem("access")) {
      getPermissions();
      fetchProfile({});
    }
    if (userType === "Organization" || userType === "Customer") {
      fetchSystemParameters({});
    }
  }, [localStorage.getItem("access")]);

  useEffect(() => {
    if (userType === "Organization") {
      fetchDetails({ url: "organization-global-settings/details" });
      fetchSystemSecurity({});
    } else if (userType === "Customer") {
      fetchDetails({ url: "organization-global-settings/organization_details" });
    }
  }, [userType]);
  // const appRouters = useRoutes(routes);
  return <ProjectRouter />;
}

export default AppRoutes;
