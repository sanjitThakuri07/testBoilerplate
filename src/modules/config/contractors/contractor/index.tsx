import React, { useState, useEffect } from "react";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { Breadcrumbs, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import BackButton from "src/components/buttons/back";
import { serviceProps } from "src/interfaces/configs";
import ServiceForm from "./ServiceForm";
import "../services/regions.scss";
import UploadCsv from "src/modules/config/generalSettings/upload/UploadCsv";
import ServiceCard from "./ServiceCard";
import { useLocation, useParams, Link as Href, useNavigate } from "react-router-dom";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { deleteAPI, getAPI, postAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { Box } from "@mui/system";
import { usePathUrlSettor } from "src/store/zustand/globalStates/config";
import { contractorsUrl } from "src/routers/routingsUrl";
import MultiStepProgressBar from "./FormProgress";
import PageOne from "./Form/ContractorForm";
import PageTwo from "./Form/ContractorAddress";
import { fetchInitialValues } from "./Form/apiRequest";
import { contractorProps } from "src/interfaces/configs";
import { permissionList } from "src/constants/permission";
import EditView from "src/components/ViewEdit";

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

const ProgressDataSet: ProgressStep[] = [
  {
    id: "1",
    page: "pageone",
    title: "Contractor Details",
    subText: "Please provide contractor details",
  },
  {
    id: "2",
    page: "pagetwo",
    title: "Contractor Address",
    subText: "A few details about your address",
  },
];

const Index = () => {
  const [page, setPage] = useState("pageone");
  const [loading, setLoading] = useState(false);
  const [getCurrentContractorAddress, setCurrentContractorAddress] = useState([{}]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [contractorData, setContractorData] = useState<contractorProps>({});
  const [configName, setConfigName] = useState({
    singular: "",
    plural: "",
    pathname: "",
    parent_path: "",
  });

  const { contractorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { routes, setCustomRoutes } = usePathUrlSettor();

  // Get the value of the nextPage parameter
  const urlPageNumber = new URLSearchParams(location.search).get("nextPage");

  const readOnly = location.pathname?.includes("view");

  //   change the store of all-contractors
  const {
    services: { items },
    setServices,
    deleteServices,
  } = useContractorServicesStore();

  //   breadcrums
  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="src/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="1" color="inherit">
      <Href
        to={`/config/contractors/${configName.parent_path}`}
        style={{ textTransform: "capitalize" }}
      >
        {configName.parent_path?.split("-")[1]}
      </Href>
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href to={`/config/contractors/${configName.parent_path}`}>{configName.singular}</Href>
    </Link>,
    <Typography key="3" color="text.primary">
      {contractorId && !readOnly ? "Edit " : readOnly ? "View " : "Add "} {configName.singular}
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
    if (contractorId) {
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

  // getting the query params from the url
  const getBackEndApi = (params: string) => {
    let url = "";
    switch (params) {
      case "services":
        url = "organization-service";
        break;
      case "contractors":
        url = "contractors";
        break;
      default:
        url = "";
    }

    return url;
  };

  const getIndividualContractorAddressDetails = async () => {
    setIsFormLoading(true);
    await fetchInitialValues({
      id: Number(contractorId),
      setInitialValues: (data: any) => {
        setCurrentContractorAddress(data?.contractor_address);
        setContractorData(data);
      },
    });
    setIsFormLoading(false);
  };

  useEffect(() => {
    if (location.pathname.includes("contractors")) {
      setConfigName({
        singular: "Contractor",
        plural: "Contractors",
        pathname: "all-contractor",
        parent_path: "all-contractors",
      });
    }
  }, [configName?.pathname]);

  useEffect(() => {
    contractorId && getIndividualContractorAddressDetails();
  }, [contractorId, urlPageNumber]);

  const permissionObj: any = {
    ["all-contractor"]: permissionList.Contractor.edit,
  };

  return (
    <div className="add-region-config-holder position-relative">
      <div className="header-block">
        <BackButton />
        <div className="breadcrumbs-holder">
          <Breadcrumbs
            separator={<img src="src/assets/icons/chevron-right.svg" alt="right" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </div>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div className="left">
            <Typography variant="h3" color="primary">
              {contractorId && !readOnly ? "Edit " : readOnly ? "View " : "Add "}{" "}
              {configName.singular}
            </Typography>
            <Typography variant="body1" component="p">
              {contractorId && !readOnly ? "Edit " : readOnly ? "View " : "Add "} all the details of
              your {configName.plural.toLowerCase()} here.
            </Typography>
          </div>
        </Stack>
      </div>
      <EditView permission={permissionObj?.[configName?.pathname]} />
      <div className="body-wrapper ">
        <MultiStepProgressBar
          page={page}
          onPageNumberClick={nextPageNumber}
          ProgressDataSet={ProgressDataSet}
        />
        {
          {
            pageone: (
              <PageOne
                proceedToNextPage={nextPageNumber}
                data={contractorData}
                isFormLoading={isFormLoading}
                setIsFormLoading={setIsFormLoading}
                disabled={readOnly}
              />
            ),
            pagetwo: (
              <PageTwo
                address={
                  contractorData?.contractor_address?.length
                    ? contractorData?.contractor_address
                    : [
                        {
                          address_type: "",
                          address_line: "",
                          city: null,
                          state: null,
                          territory: null,
                          country: "",
                          zip_code: "",
                        },
                      ]
                }
                isFormLoading={isFormLoading}
                setIsFormLoading={setIsFormLoading}
                disabled={readOnly}
              />
            ),
          }[page]
        }
      </div>
    </div>
  );
};

export default Index;
