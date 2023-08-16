import React, { useState, useEffect } from "react";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { Breadcrumbs, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import BackButton from "src/components/buttons/back";
import UploadCsv from "src/modules/config/generalSettings/upload/UploadCsv";
import { useLocation, useParams, Link as Href, useNavigate } from "react-router-dom";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { deleteAPI, getAPI, postAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { Box } from "@mui/system";
import { usePathUrlSettor } from "src/store/zustand/globalStates/config";
import { contractorsUrl } from "src/routers/routingsUrl";
import MultiStepProgressBar from "./FormProgress";
import PageOne from "./Form/CustomerForm";
import PageTwo from "./Form/CustomerAddress";
import PageThree from "./Form/CustomerAdd";
import { fetchInitialValues } from "./Form/apiRequest";
import { customerProps } from "src/src/interfaces/configs";
import EditView from "src/components/ViewEdit";
import { permissionList } from "src/constants/permission";

interface ProgressStep {
  id: string;
  page: string;
  title?: string;
  subText?: string;
  start?: number;
}

type CasesType = {
  [key: string]: string;
};

const ProgressDataSets: ProgressStep[] = [
  {
    id: "1",
    page: "pageone",
    title: "Customer Details",
    subText: "Please provide customer details",
  },
  {
    id: "2",
    page: "pagetwo",
    title: "Customer Address",
    subText: "A few details about your address",
  },
  {
    id: "3",
    page: "pagethree",
    title: "Add User",
    subText: "Fill the form to add users",
  },
];

const Index = () => {
  const [page, setPage] = useState("pageone");
  const [ProgressDataSet, setProgressDataSet] = useState(ProgressDataSets);
  const [loading, setLoading] = useState(false);
  const [getCustomerAddress, setCustomerAddress] = useState([{}]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [customerData, setCustomerData] = useState<customerProps>({});
  const [configName, setConfigName] = useState({
    singular: "",
    plural: "",
    pathname: "",
    parent_path: "",
  });

  const { customerId } = useParams();
  const location = useLocation();
  const readOnly = location.pathname?.includes("view");

  const navigate = useNavigate();
  const { routes, setCustomRoutes } = usePathUrlSettor();
  const isFromAdd: any = window.location.search.split("&").pop() || "hh";
  const customer = new URLSearchParams(location.search).get("customer");
  //   breadcrums
  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/src/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href to={`/${configName.parent_path}`}>{configName.singular}</Href>
    </Link>,
    <Typography key="3" color="text.primary">
      {customerId && !window.location.search.includes("add_address") ? "Edit" : "Add"}{" "}
      {configName.singular}
    </Typography>,
  ];

  //   changing page
  const nextPage = (page: string) => {
    setPage(page);
  };

  const cases: CasesType = {};
  for (let i = 0; i < ProgressDataSet.length; i++) {
    const progress = ProgressDataSet[i];
    cases[`${i + 1}`] = `setPage("${progress.page}");`;
  }

  // creating dynamic switch cases
  const nextPageNumber = (pageNumber: string) => {
    if (customerId || customer) {
      let switchStatement = "switch(pageNumber) {\n";
      for (const [key, value] of Object.entries(cases)) {
        switchStatement += `  case "${key}":\n`;
        switchStatement += `    ${value}\n`;
        switchStatement += "    break;\n";
      }
      switchStatement += `  default:\n`;
      switchStatement += `    setPage("${ProgressDataSet[0].page}");\n`;
      switchStatement += "}";
      // eslint-disable-next-line no-eval
      eval(switchStatement);
    } else {
      alert("Looks like you have not fill up the form");
    }
  };

  const getIndividualDetails = async () => {
    setIsFormLoading(true);
    await fetchInitialValues({
      id: Number(customerId),
      setInitialValues: (data: any) => {
        setCustomerAddress(data?.customer_address);
        let transformedData = { ...data };
        if (data?.credit_limit) {
          transformedData.credit_limit = [
            { code: data?.credit_limit?.currency, data: data?.credit_limit?.amount },
          ];
        }
        if (data?.balance_amount) {
          transformedData.balance_amount = [
            { code: data?.balance_amount?.currency, data: data?.balance_amount?.amount },
          ];
        }
        if (data?.documents?.length) {
          transformedData.documents = [{ documents: data?.documents, title: "" }];
        }

        setCustomerData(transformedData);
      },
    });
    setIsFormLoading(false);
  };

  useEffect(() => {
    if (location.pathname.includes("customer")) {
      setConfigName({
        singular: "Customer",
        plural: "Customers",
        pathname: "customer",
        parent_path: "customer",
      });
    }
  }, [configName?.pathname]);

  useEffect(() => {
    customerId && getIndividualDetails();
  }, [customerId]);

  const permissionObj: any = {
    ["customers"]: permissionList.Customer.edit,
  };

  return (
    <div className="add-region-config-holder  position-relative">
      <div className="header-block">
        <BackButton />
        <div className="breadcrumbs-holder">
          <Breadcrumbs
            separator={<img src="/src/assets/icons/chevron-right.svg" alt="right" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </div>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div className="left">
            <Typography variant="h3" color="primary">
              {customerId ? "Edit" : "Add"} {configName.singular}
            </Typography>
            <Typography variant="body1" component="p">
              {customerId ? "Edit" : "Add"} all the details of your{" "}
              {configName.plural.toLowerCase()} here.
            </Typography>
          </div>
        </Stack>
      </div>
      <EditView permission={permissionObj?.[configName?.pathname]} />

      <div className="body-wrapper">
        <MultiStepProgressBar
          page={page}
          onPageNumberClick={nextPageNumber}
          // ProgressDataSet={ProgressDataSet.filter((id: any) => id.id !== '3')}
          ProgressDataSet={
            !customerId
              ? ProgressDataSet
              : window.location.href?.includes("add_address")
              ? ProgressDataSet
              : ProgressDataSet.slice(0, 2)
          }
        />
        {
          {
            pageone: (
              <PageOne
                proceedToNextPage={nextPageNumber}
                data={customerData}
                isFormLoading={isFormLoading}
                setIsFormLoading={setIsFormLoading}
                disabled={readOnly}
              />
            ),
            pagetwo: (
              <PageTwo
                address={
                  customerData?.customer_address?.length
                    ? customerData?.customer_address
                    : [
                        {
                          address_type: "",
                          address_line: "",
                          city: "",
                          state: "",
                          territory: null,
                          country: "",
                          zip_code: "",
                        },
                      ]
                }
                isFormLoading={isFormLoading}
                setIsFormLoading={setIsFormLoading}
                disabled={readOnly}
                proceedToNextPage={(e: string) => {
                  console.log({ e });
                  e === "edit" ? navigate(`/customer`) : setPage("pagethree");
                }}
              />
            ),

            pagethree: (
              <>
                <PageThree
                  proceedToNextPage={nextPageNumber}
                  data={customerData}
                  isFormLoading={isFormLoading}
                  setIsFormLoading={setIsFormLoading}
                />
              </>
            ),
          }[page]
        }
      </div>
    </div>
  );
};

export default Index;
