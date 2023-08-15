import TenantRegister from ''src/modules/auth/TenantDashboard/TenantRegister/TenantRegister';
import { permissionList } from 'src/constants/permission';
import { AuthRoute, PrivateRoute } from 'src/constants/variables';
import CustomerDashboard from 'containers/customers/Customer';
import CustomerAdd from 'containers/customers/customer/index';

import { IndexHOC } from 'HOC/indexHOC';
import CustomersTable from './customer/CustomersTable/CustomersTable';
import ViewUsers from './customer/Form/ViewUsers';

export default [
  {
    title: 'Customer Dashboard',
    path: PrivateRoute.ORGANIZATION.CUSTOMERS?.LINK,
    component: IndexHOC({
      component: CustomerDashboard,
      permission: [permissionList.Customer.view],
      role: [],
    }),
    newPage: false,
  },

  {
    title: 'Create Customer',
    path: PrivateRoute.ORGANIZATION?.CUSTOMERS.ADD,
    component: IndexHOC({
      component: CustomerAdd,
      permission: [permissionList.Customer.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: 'Update Customer',
    path: PrivateRoute.ORGANIZATION?.CUSTOMERS.EDIT,
    component: IndexHOC({
      component: CustomerAdd,
      permission: [permissionList.Customer.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: 'View Customer',
    path: PrivateRoute.ORGANIZATION?.CUSTOMERS.VIEW_CUSTOMER_USER,
    component: IndexHOC({
      component: CustomersTable,
      permission: [permissionList.Customer.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: 'View Customer Profile',
    path: PrivateRoute.ORGANIZATION?.CUSTOMERS.VIEW_CUSTOMER,
    component: IndexHOC({
      component: CustomerAdd,
      permission: [permissionList.Customer.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: 'View Customer User',
    path: PrivateRoute.ORGANIZATION?.CUSTOMERS.VIEW,
    component: IndexHOC({
      component: ViewUsers,
      permission: [permissionList.Customer.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: 'Edit Customer User',
    path: PrivateRoute.ORGANIZATION?.CUSTOMERS.EDIT_CUSTOMER_USER,
    component: IndexHOC({
      component: ViewUsers,
      permission: [permissionList.Customer.edit],
      role: [],
    }),
    newPage: false,
  },
];
