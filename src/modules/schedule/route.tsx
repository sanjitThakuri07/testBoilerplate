import { PrivateRoute } from "src/constants/variables";

import { IndexHOC } from "src/hoc/indexHOC";
import { permissionList } from "src/constants/permission";
import Schedule from "./Schedule";
import ScheduleInspection from "containers/inspections/ScheduleInspection";

export const routes: any = [
  {
    title: "Schedule",
    path: PrivateRoute.SCHEDULE.CHILD_LINKS.HOME,
    component: IndexHOC({
      component: Schedule,
      permission: [permissionList.InspectionSchedules.view],
    }),
    newPage: false,
  },
  {
    title: "Edit Schedule",
    path: PrivateRoute.SCHEDULE.CHILD_LINKS.EDIT,
    component: IndexHOC({
      component: ScheduleInspection,
      permission: [permissionList.InspectionSchedules.view],
    }),
    newPage: false,
  },
];
