import React, { useState, useEffect } from "react";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { Breadcrumbs, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import BackButton from "src/components/buttons/back";
import { useLocation, useParams, Link as Href, useNavigate } from "react-router-dom";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { usePathUrlSettor } from "src/store/zustand/globalStates/config";
import { fetchInitialValues } from "./Form/apiRequest";
import { ExternalConnectionProps, ResponseSetPropsS, TableValue } from "src/interfaces/configs";
import ExternalResponseSetForm from "./Form/ExternalResponseSetForm";

const Index = () => {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [externalResponseData, setExternalResponseData] = useState<ExternalConnectionProps>({
    api: "",
    api_id: 0,
    token: "",
    display_name: "",
    status: "Active",
    authenticated: false,
    tableValues: [],
    api_header: "https",
  });
  const modules: Array<ResponseSetPropsS> = [];

  const [apiId, setApiId] = useState(0);

  const [configName, setConfigName] = useState({
    singular: "",
    plural: "",
    pathname: "",
    parent_path: "",
    parent_pathname: "",
  });

  const { externalResponseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { routes, setCustomRoutes } = usePathUrlSettor();

  //   change the store of all-contractors
  const {
    services: { items },
    setServices,
    deleteServices,
  } = useContractorServicesStore();

  const viewMode = location.pathname?.includes("/config/global-response-set/external/view");

  //   breadcrums
  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="1" color="inherit">
      <Href
        to={`/config/global-response-set/${configName.parent_pathname}`}
        style={{ textTransform: "capitalize" }}
      >
        {configName.parent_path}
      </Href>
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href to={`/config/global-response-set/${configName.pathname}`}>{configName.singular}</Href>
    </Link>,
    <Typography key="3" color="text.primary">
      {viewMode ? "View" : externalResponseId ? "Edit" : "Add"} {configName.singular}
    </Typography>,
  ];

  const getExternalResponseData = async () => {
    setIsFormLoading(true);
    await fetchInitialValues({
      id: Number(externalResponseId),
      setInitialValues: (data: any) => {
        console.log(data);
        const dat = {
          api: data?.api?.split("://")?.[1],
          api_id: data?.api_id,
          api_header: data?.api?.split("://")?.[0],
          token: data?.api_token,
          display_name: data?.display_name,
          status: data?.status,
          authenticated: true,
          tableValues: [],
        };
        setExternalResponseData(dat);
        setApiId(data?.id);
      },
    });
    setIsFormLoading(false);
  };

  useEffect(() => {
    if (location.pathname.includes("external")) {
      setConfigName({
        singular: "External Response",
        plural: "External Responses",
        pathname: "external",
        parent_path: "customResponse",
        parent_pathname: "custom",
      });
    }
  }, [configName?.pathname]);

  useEffect(() => {
    externalResponseId && getExternalResponseData();
  }, [externalResponseId]);
  return (
    <div className="add-region-config-holder">
      <div className="header-block">
        <BackButton />
        <div className="breadcrumbs-holder">
          <Breadcrumbs
            separator={<img src="/assets/icons/chevron-right.svg" alt="right" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </div>
        <Stack
          className={viewMode ? "enable-booking-component" : ""}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <div className="left">
            <Typography variant="h3" color="primary">
              {viewMode ? "View " : externalResponseId ? "Edit" : "Add"} {configName.singular}
            </Typography>
            <Typography variant="body1" component="p">
              {viewMode ? "View " : externalResponseId ? "Edit" : "Add"} all the details of your{" "}
              {configName.plural.toLowerCase()} here.
            </Typography>
          </div>
        </Stack>
      </div>
      <ExternalResponseSetForm
        initial_data={externalResponseData}
        externalResponseId={externalResponseId}
        apiRef={apiId}
        isFormLoading={isFormLoading}
        setIsFormLoading={setIsFormLoading}
        viewMode={viewMode}
      />
    </div>
  );
};

export default Index;
