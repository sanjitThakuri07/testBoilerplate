import { PrivateRoute } from "src/constants/variables";
import InspectionStarter from "containers/template/inspection";
import Inspections from "containers/inspections";
import InspectionCreateUpdate from "containers/inspections/createUpdate";
import Report from "containers/inspections/Report/Index";

import { IndexHOC } from "src/hoc/indexHOC";
import { permissionList } from "src/constants/permission";
import ScheduleInspection from "./ScheduleInspection";

export default [
  {
    title: "Inspection",
    path: PrivateRoute.INSPECTION.ROOT,
    component: IndexHOC({
      component: Inspections,
      permission: [permissionList.Inspection.view],
    }),
    newPage: false,
  },
  {
    title: "Start Inspection",
    path: PrivateRoute.TEMPLATE.TEMPLATE_CREATION.CHILD_LINKS.INSPECTION,
    component: IndexHOC({
      component: InspectionStarter,
      permission: [permissionList.Inspection.view],
    }),
    newPage: true,
  },
  {
    title: "Start Inspection",
    path: PrivateRoute.TEMPLATE.TEMPLATE_CREATION.CHILD_LINKS.INSPECTIONExternal,
    component: IndexHOC({
      component: InspectionStarter,
      permission: [permissionList.Inspection.view],
    }),
    newPage: true,
  },
  {
    title: "Schedule Inspection",
    // path: PrivateRoute.INSPECTION.,
    path: PrivateRoute.TEMPLATE.SCHEDULE_INSPECTION.CHILD_LINKS.INSPECTION,
    component: IndexHOC({
      component: ScheduleInspection,
      permission: [permissionList.Inspection.view],
    }),
    newPage: false,
  },
  {
    title: "Create Update Inspection",
    path: PrivateRoute.INSPECTION.EDIT,
    component: IndexHOC({
      component: InspectionStarter,
      permission: [permissionList.Inspection.edit],
    }),
    newPage: true,
  },
  {
    title: "View Inspection",
    path: PrivateRoute.INSPECTION.VIEW,
    component: IndexHOC({
      component: InspectionStarter,
      permission: [permissionList.Inspection.view],
    }),
    newPage: true,
  },
  {
    title: "Report Setup and Preview",
    path: PrivateRoute.INSPECTION.REPORT,
    component: IndexHOC({ component: Report, permission: [permissionList.InspectionReport.view] }),
    newPage: true,
  },
];
