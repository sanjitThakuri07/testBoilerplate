import { PrivateRoute } from "src/constants/variables";

import FinanceSettings from "src/modules/finance/Finance";
import FinanceForm from "src/modules/finance/tariffs/index";
import InvoiceForm from "src/modules/finance/invoices/indexstack";
import InvoicesForm from "src/modules/finance/invoices/index";

import { IndexHOC } from "src/hoc/indexHOC";
import InvoiceGenerate from "./invoices/invoiceGenerate/invoiceGenerate";
import { SendInvoice } from "./invoices/invoiceGenerate/SendInvoice";
import AddServiceConfig from "./services/AddService";
import { permissionList } from "src/constants/permission";

export default [
  {
    title: "Tarrifs",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.TARIFFS.HOME,
    component: IndexHOC({
      component: FinanceSettings,
      permission: [permissionList.Tariffs.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Create Tarrif",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.TARIFFS.ADD,
    component: IndexHOC({
      component: FinanceForm,
      permission: [permissionList.Tariffs.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Update Tarrif",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.TARIFFS.EDIT,
    component: IndexHOC({
      component: FinanceForm,
      permission: [permissionList.Tariffs.edit],
      role: [],
    }),
    newPage: false,
  },

  {
    title: "Invoice",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.HOME,
    component: IndexHOC({
      component: InvoiceForm,
      permission: [permissionList.Invoice.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Invoices",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.INVOICES.HOME,
    component: IndexHOC({
      component: InvoicesForm,
      permission: [permissionList.Invoice.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "To be invoiced",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.TOBEINVOICED.HOME,
    component: IndexHOC({
      component: InvoicesForm,
      permission: [permissionList.Invoice.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Invoice",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.INVOICES.HOME,
    component: IndexHOC({
      component: InvoiceForm,
      permission: [permissionList.Invoice.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Invoice",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.TOBEINVOICED.HOME,
    component: IndexHOC({ component: InvoiceForm, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "Generate Invoice",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.GENERATE_INVOICE.HOME,
    component: IndexHOC({
      component: InvoiceGenerate,
      permission: [permissionList.Invoice.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Send Invoice",
    path: PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.SEND_INVOICE.HOME,
    component: IndexHOC({
      component: SendInvoice,
      permission: [permissionList.Invoice.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Create service config",
    path: PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.ADD,
    component: IndexHOC({
      component: AddServiceConfig,
      permission: [permissionList.Service.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Update service config",
    path: PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.EDIT,
    component: IndexHOC({
      component: AddServiceConfig,
      permission: [permissionList.Service.edit],
      role: [],
    }),
    newPage: false,
  },
];
