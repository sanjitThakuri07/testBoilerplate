import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { Breadcrumbs, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import BackButton from "src/components/buttons/back";
import { serviceProps } from "src/src/interfaces/configs";
import { useEffect, useState } from "react";
import ServiceForm from "./ServiceForm";
import "./regions.scss";
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

const AddServiceConfig = () => {
  const [isMore, setMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [opeCsvModal, setOpenCsvModal] = useState(false);
  const [sampleUrl, setSampleUrl] = useState("");
  const [generalCardContainer, setGeneralCardContainer] = useState([]);
  const [deleteId, setDeleteId] = useState<number | null | undefined>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [trackLabel, setTrackLabel] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [configName, setConfigName] = useState({
    singular: "",
    plural: "",
    pathname: "",
    parent_path: "",
  });

  const [individualServices, setIndividualServices] = useState<serviceProps>({
    name: "",
    status: "Active",
    notes: "",
  });

  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { routes, setCustomRoutes } = usePathUrlSettor();

  const {
    services: { items },
    setServices,
    deleteServices,
  } = useContractorServicesStore();

  const [loading, setLoading] = useState(false);

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

  const DynamicTableChanger = () => {
    if (location.pathname.includes("services")) {
      setConfigName({
        singular: "Service",
        plural: "Services",
        pathname: "services",
        parent_path: "contractors",
      });
    }
  };

  const [urlUtils, setUrlUtils] = useState<ConfigTableUrlUtils>({
    page: 1,
    size: 5,
    archived: "",
    q: "",
  });

  // ---------REGION FUNCTIONS----------------
  const handleDeleteService = (id?: number) => {
    // if (!id) return;
    // const region = items.find((rg) => rg.id === id);
    // region && setCurrentRegion(region);
    let filteredData: any = generalCardContainer.filter((label: any) => label?.id === id);
    setTrackLabel(filteredData[0]?.name);
    setDeleteId(id);
    setOpenModal(true);
  };

  const editService = (id?: number) => {
    // if (!id) return;
    const service = items.find((rg) => rg.id === id);
    service && setIndividualServices(service);
    const serviceForm = document.querySelector(".region-form-holder");
    serviceForm?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/src/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="1" color="inherit">
      <Href
        to={`/config/${configName.parent_path}/all-contractors`}
        style={{ textTransform: "capitalize" }}
      >
        {configName.parent_path}
      </Href>
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href to={`/config/${configName.parent_path}/${configName.pathname}`}>
        {configName.singular}
      </Href>
    </Link>,
    <Typography key="3" color="text.primary">
      {serviceId ? "Edit" : "Add"} {configName.singular}
    </Typography>,
  ];

  const deleteService = async () => {
    setDeleteLoading(true);
    const params = configName?.pathname?.toString().toLowerCase();
    try {
      await deleteAPI(`${getBackEndApi(params)}/`, {
        config_ids: [deleteId],
      });
      setDeleteLoading(false);
      setOpenModal(false);
      deleteServices(Number(deleteId));
      setGeneralCardContainer((prev) => {
        const updatedData = prev?.filter(({ id }) => id !== Number(deleteId));
        return updatedData;
      });
      // open the toaster
      enqueueSnackbar("Data deleted successfully", { variant: "success" });
      navigate(`/config/${configName.parent_path}/${configName.pathname}/add`);
    } catch (error: any) {
      setDeleteLoading(false);
      setOpenModal(false);
      enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
    }
  };

  // downloading csv sample file
  const downloadSample = async (e: any) => {
    e.preventDefault();
    const { status, data } = await getAPI(`${routes?.backendUrl}/csv-format`);
    if (status === 200) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${routes?.backendUrl}.csv`);
      document.body.appendChild(link);
      link.click();
    } else {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const getAllGeneralCard = async () => {
    setLoading(true);
    const params = configName?.pathname?.toString().toLowerCase();
    let url = getBackEndApi(params);

    try {
      const { status, ...response } = await getAPI(
        `${url}/?q=${urlUtils.q}&archived=${urlUtils.archived}&page=${urlUtils.page}&size=${urlUtils.size}`,
      );
      if (status === 200) {
        const { data } = response;
        setGeneralCardContainer(data?.items);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    DynamicTableChanger();
    if (!configName?.pathname) return;
    if (configName?.pathname === "services") {
      setCustomRoutes({
        backendUrl: contractorsUrl?.services?.backendUrl,
      });
    } else if (configName?.pathname === "contractor") {
      setCustomRoutes({
        backendUrl: contractorsUrl?.allContractors?.backendUrl,
      });
    }
    getAllGeneralCard();
  }, [configName.pathname]);

  const transformArr = (arr: serviceProps[]): serviceProps[] => {
    if (!isMore) return arr.filter((_, index) => index < 3);
    return arr;
  };

  const handleNavigateToEdit = (id?: number) => {
    // /config/contractors/services/
    navigate(`/config/${configName.parent_path}/${configName.pathname}/edit/${id}`);
  };

  const slicedRegion = () => {
    let slicedRegion = [];
    if (isMore) {
      slicedRegion = generalCardContainer?.slice(0, 3);
    } else {
      slicedRegion = generalCardContainer?.slice(0);
    }
    return slicedRegion;
  };

  return (
    <div className="add-region-config-holder">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={deleteService}
        confirmationHeading={`Do you want to delete ${trackLabel}?`}
        confirmationDesc={`This ${configName.pathname.replaceAll("-", " ")} will be deleted.`}
        status="warning"
        confirmationIcon="/src/assets/icons/icon-feature.svg"
        loader={deleteLoading}
      />
      <UploadCsv
        sampleLinkHandler={downloadSample}
        sampleLink={`/`}
        uploadUri={`/${routes?.backendUrl}/import-csv`}
        onClose={() => setOpenCsvModal(false)}
        open={opeCsvModal}
      />
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
              {serviceId ? "Edit" : "Add"} {configName.singular}
            </Typography>
            <Typography variant="body1" component="p">
              {serviceId ? "Edit" : "Add"} all the details of your {configName.plural.toLowerCase()}{" "}
              here.
            </Typography>
          </div>
          <div className="right">
            <Button
              variant="outlined"
              startIcon={<img src="/src/assets/icons/icon-upload.svg" alt="icon-upload" />}
              onClick={() => setOpenCsvModal(true)}
            >
              Upload CSV
            </Button>
          </div>
        </Stack>
      </div>

      <div className="border-wrapper">
        {/* loading */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              left: "55.5%",
              top: "50%",
              zIndex: 9999,
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}
        {generalCardContainer.length > 0 && (
          <div className="regions">
            <div className="regions-area" key={Number(loading)}>
              {slicedRegion()?.map((card: serviceProps) => (
                <ServiceCard
                  {...card}
                  key={card.id}
                  status={card.status}
                  navigate={handleNavigateToEdit}
                  handleDeleteService={handleDeleteService}
                  editService={editService}
                />
              ))}
            </div>
            {generalCardContainer?.length > 3 && (
              <div className="btn-holder">
                <Button variant="contained" onClick={() => setMore(!isMore)}>
                  View {!isMore ? "Less" : "More"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {location.pathname.includes("services") === true && (
        <ServiceForm
          service={individualServices}
          setIndividualServices={setIndividualServices}
          updateCard={setGeneralCardContainer}
        ></ServiceForm>
      )}
    </div>
  );
};

export default AddServiceConfig;
