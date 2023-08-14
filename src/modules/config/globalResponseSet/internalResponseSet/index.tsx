import { Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import BackButton from "src/components/buttons/back";
import {
  useContractorServicesStore,
  usePathUrlSettor,
} from "src/store/zustand/globalStates/config";
import { ResponseSetPropsS } from "src/interfaces/configs";
import { useEffect, useState } from "react";
import { Link as Href, useLocation, useNavigate, useParams } from "react-router-dom";
import InternalResponseSetForm from "./Form/InternalResponseSetForm";
import { fetchInitialValues } from "./Form/apiRequest";

const Index = () => {
  const [page, setPage] = useState("pageone");
  const [loading, setLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [internalResponseData, setInternalResponseData] = useState<ResponseSetPropsS>({
    module: null,
    tableValues: [],
  });
  const modules: Array<ResponseSetPropsS> = [];

  const [intialModuleData, setintialModuleData] = useState(modules);

  const [configName, setConfigName] = useState({
    singular: "",
    plural: "",
    pathname: "",
    parent_path: "",
    parent_pathname: "",
  });

  const { internalResponseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { routes, setCustomRoutes } = usePathUrlSettor();

  //   change the store of all-contractors
  const {
    services: { items },
    setServices,
    deleteServices,
  } = useContractorServicesStore();

  const viewMode = location.pathname?.includes("/config/global-response-set/internal/view");

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
      {viewMode ? "View" : internalResponseId ? "Edit" : "Add"} {configName.singular}
    </Typography>,
  ];

  const getInternalResponseData = async () => {
    setIsFormLoading(true);
    await fetchInitialValues({
      id: Number(internalResponseId),
      setInitialValues: (data: any) => {
        console.log(data, "dassssssta");
        const dat = { module: data?.id, tableValues: data };
        setInternalResponseData(dat);
        if (data !== undefined) {
          setintialModuleData([data]);
        }
      },
    });
    setIsFormLoading(false);
  };

  useEffect(() => {
    if (location.pathname.includes("internal")) {
      setConfigName({
        singular: "Internal Response",
        plural: "Internal Responses",
        pathname: "internal",
        parent_path: "customResponse",
        parent_pathname: "custom",
      });
    }
  }, [configName?.pathname]);

  useEffect(() => {
    internalResponseId && getInternalResponseData();
  }, [internalResponseId]);

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
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={viewMode ? "enable-booking-component" : ""}
        >
          <div className="left">
            <Typography variant="h3" color="primary">
              {viewMode ? "View" : internalResponseId ? "Edit" : "Add"} {configName.singular}
            </Typography>
            <Typography variant="body1" component="p">
              {viewMode ? "View " : internalResponseId ? "Edit " : "Add "}
              all the details of your {configName.plural.toLowerCase()} here.
            </Typography>
          </div>
        </Stack>
      </div>
      {/* <InternalResponseSetForm initialModulerValues={responseSetValues} initialModuleData={responseSetData} internalResponseId={internalResponseId}/> */}
      <InternalResponseSetForm
        initial_data={internalResponseData}
        moduleData2={intialModuleData}
        internalResponseId={internalResponseId}
        setIsFormLoading={setIsFormLoading}
        isFormLoading={isFormLoading}
        viewMode={viewMode}
      />
    </div>
  );
};

export default Index;
