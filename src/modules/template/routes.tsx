import { PrivateRoute } from "src/constants/variables";
import { Template, TemplateIndex } from "containers/template";

import { IndexHOC } from "src/hoc/indexHOC";
import { permissionList } from "src/constants/permission";
import AccessControl from "./access";
import ScheduleInspection from "./inspection/ScheduleInspection";
import ReportLayout from "./ReportLayout/Index";

export default [
  {
    title: "Template",
    path: PrivateRoute.TEMPLATE.TEMPLATE_CREATION.LINK,
    component: IndexHOC({
      component: TemplateIndex,
      permission: [permissionList.Form.view],
    }),
    newPage: false,
  },
  {
    title: "Create Template",
    path: PrivateRoute.TEMPLATE.TEMPLATE_CREATION.CHILD_LINKS.EDIT,
    component: IndexHOC({
      component: Template,
      permission: [permissionList.Form.add],
    }),
    newPage: true,
    className: "template__creation",
  },
  {
    title: "Update Template",
    path: PrivateRoute.TEMPLATE.TEMPLATE_CREATION.CHILD_LINKS.CREATE,
    component: IndexHOC({ component: Template, permission: [permissionList.Form.edit] }),
    newPage: true,
    className: "template__creation",
  },
  {
    title: "Access Control",
    path: PrivateRoute.TEMPLATE.ACCESS_CONTROL.ROOT,
    component: IndexHOC({ component: AccessControl, permission: [permissionList.Form.edit] }),
    newPage: false,
  },

  {
    title: "Template Layout",
    path: PrivateRoute.TEMPLATE.TEMPLATE_LAYOUT.CHILD_LINKS.CREATE_LAYOUT,
    component: IndexHOC({
      component: ReportLayout,
      permission: [permissionList.Form.edit],
    }),
    newPage: true,
  },
];
