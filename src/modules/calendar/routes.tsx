import { PrivateRoute } from "constants/variables";

import { IndexHOC } from "HOC/indexHOC";
import Calendar from "./Calendar";
import { permissionList } from "src/constants/permission";

export default [
  {
    title: "Calendar",
    path: PrivateRoute.CALENDAR.root,
    component: IndexHOC({ component: Calendar, permission: [permissionList.Event.view] }),
    newPage: false,
  },
];
