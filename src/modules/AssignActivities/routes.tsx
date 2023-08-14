import { PrivateRoute } from "constants/variables";

import { IndexHOC } from "HOC/indexHOC";
import AssignActivities from "./AssignActivities";
import AddAssignActivity from "./AddAssignActivity";
import EditAssignActivity from "./EditAssignActivity";
import ViewAssignActivity from "./ViewAssignActivity";
import { permissionList } from "src/constants/permission";

export default [
  {
    title: "Assign Activities",
    path: PrivateRoute.ASSIGN_ACTIVITIES?.HOME,
    component: IndexHOC({
      component: AssignActivities,
      permission: [permissionList.Activity.view],
    }),
    newPage: false,
  },
  {
    title: "Add Assign Activities",
    path: PrivateRoute.ASSIGN_ACTIVITIES?.ADD,
    component: IndexHOC({
      component: AddAssignActivity,
      permission: [permissionList.Activity.add],
    }),
    newPage: false,
  },
  {
    title: "Update Assign Activities",
    path: PrivateRoute.ASSIGN_ACTIVITIES?.EDIT,
    component: IndexHOC({
      component: EditAssignActivity,
      permission: [permissionList.Activity.edit],
    }),
    newPage: false,
  },
  {
    title: "View Assign Activities",
    path: PrivateRoute.ASSIGN_ACTIVITIES?.VIEW,
    component: IndexHOC({
      component: ViewAssignActivity,
      permission: [permissionList.Activity.view],
    }),
    newPage: false,
  },
];
