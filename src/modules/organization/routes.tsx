import { permissionList } from "src/constants/permission";
import { PrivateRoute } from "src/constants/variables";
import Organization from "containers/organization";
import NoDataOrganizations from "containers/organization/NoData";

import { IndexHOC } from "src/hoc/indexHOC";

export default [
  {
    title: "Organization",
    path: PrivateRoute.ORGANIZATION.HOME,
    component: IndexHOC({
      component: Organization,
      permission: [permissionList.Organization.view],
    }),
    newPage: false,
  },
  {
    title: "No Data Organization",
    path: PrivateRoute.ORGANIZATION.noData,
    component: IndexHOC({ component: NoDataOrganizations, permission: [] }),
    newPage: false,
  },
];
