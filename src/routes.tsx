import E404 from "src/modules/errors/E404";

import { Outlet, useRoutes } from "react-router-dom";
import Dashboard from "src/modules/dashboard/index";
// import routes
// import controllerRoutes from "src/modules/configuration/controllers/routes";

// import { Login } from "src/modules/auth";
import Index from "src/modules/dashboard/index";
import ProjectRouter from "src/routers/index";

import app from "src/constants/app";
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
  // const appRouters = useRoutes(routes);
  return <ProjectRouter />;
}

export default AppRoutes;
