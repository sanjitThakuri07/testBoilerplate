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
import MultiStepProgressBar from "./FormProgress";
import AddRecord from "./Form/AddRecord";
import PageTwo from "./Form/AddTariffs";
import { fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import { contractorProps } from "src/interfaces/configs";
import { allRoutes } from "src/routers/routingsUrl";

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

const fetchParentData = async ({ tariffId, setData, setIsFormLoading }: any) => {
  setIsFormLoading?.(true);
  await fetchIndividualApi({
    id: tariffId,
    url: "finance-tariff/tariff-records",
    setterFunction: (data: any) => {
      setData?.(data?.info?.parent);
    },
  });
  setIsFormLoading?.(false);
};

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [getData, setData] = useState([{}]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [individualData, setIndividualData] = useState<contractorProps>({});
  const [configName, setConfigName] = useState({
    singular: "",
    plural: "",
    pathname: "",
    pathname_url: "",
    parent_path: "",
    parent_path_url: "",
  });

  const { tariffId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchObject = Object.fromEntries(searchParams.entries());
  const { routes, setCustomRoutes } = usePathUrlSettor();
  const { enqueueSnackbar } = useSnackbar();
  const [parentData, setParentData] = useState({});
  //   change the store of all-contractors
  const {
    services: { items },
    setServices,
    deleteServices,
  } = useContractorServicesStore();

  const DynamicTableChanger = () => {
    let newPath = location?.pathname?.includes("edit")
      ? location?.pathname.toString().split("/")?.slice(0, -2)?.join("/")
      : location?.pathname.toString().split("/")?.slice(0, -1)?.join("/");
    if (searchObject["tariff"]) {
      setConfigName({
        singular: "Record",
        plural: "Records",
        pathname: "Finance",
        parent_path: "finance",
        pathname_url: `${newPath}?tariff=${searchObject[`tariff`]}`,
        parent_path_url: "finance/tariffs",
      });
      setCustomRoutes({
        backendUrl: allRoutes?.SidebarFinanceTariffsRecord?.backendUrl,
      });
    } else {
      setConfigName({
        singular: "Tariffs",
        plural: "Tariffs",
        pathname: "Finance",
        parent_path: "finance",
        pathname_url: `${newPath}`,
        parent_path_url: "finance/tariffs",
      });
      setCustomRoutes({
        backendUrl: allRoutes?.SidebarFinanceTariffs?.backendUrl,
      });
    }
  };

  //   breadcrums
  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="src/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="1" color="inherit">
      <Href to={`/${configName.parent_path_url}`} style={{ textTransform: "capitalize" }}>
        {configName.parent_path}
      </Href>
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href to={`${configName.pathname_url}`}>{configName.singular}</Href>
    </Link>,
    <Typography key="3" color="text.primary">
      {tariffId ? "Edit" : "Add"} {configName.singular}
    </Typography>,
  ];

  const getIndividualData = async () => {
    setIsFormLoading(true);
    await fetchIndividualApi({
      id: Number(tariffId),
      enqueueSnackbar: enqueueSnackbar,
      url:
        typeof routes?.backendUrl === "function" ? routes.backendUrl(tariffId) : routes?.backendUrl,
      setterFunction: (data: any) => {
        setData([data]);
        // setIndividualData(data);
      },
    });
    setIsFormLoading(false);
  };

  useEffect(() => {
    DynamicTableChanger();
  }, [Object?.keys(searchObject)?.length]);

  useEffect(() => {
    if (searchObject?.[`tariff`]) {
      fetchParentData({
        tariffId: searchObject?.["tariff"],
        setData: setParentData,
        setIsFormLoading,
      });
    }
    tariffId && routes?.backendUrl && getIndividualData();
  }, [tariffId, routes.backendUrl]);

  return (
    <div className="add-region-config-holder">
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
              {tariffId ? "Edit" : "Add"} {configName.singular}
            </Typography>
            <Typography variant="body1" component="p">
              {tariffId ? "Edit" : "Add"} all the details of your {configName.plural.toLowerCase()}{" "}
              here.
            </Typography>
          </div>
        </Stack>
      </div>
      <div className="body-wrapper">
        {!!!Object.keys(searchObject)?.length && (
          <PageTwo
            isFormLoading={isFormLoading}
            setIsFormLoading={setIsFormLoading}
            individualData={getData}
          />
        )}
        {!!searchObject["tariff"] && (
          <AddRecord
            isFormLoading={isFormLoading}
            setIsFormLoading={setIsFormLoading}
            individualData={getData}
            parentData={parentData}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
