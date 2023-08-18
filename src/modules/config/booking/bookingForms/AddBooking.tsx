import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { Breadcrumbs, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import BackButton from "src/components/buttons/back";
import { serviceProps } from "src/src/interfaces/configs";
import { useEffect, useState } from "react";
import BookingStatusForm from "./BookingStatusForm";
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
import { allRoutes, contractorsUrl } from "src/routers/routingsUrl";
import { permissionList } from "src/constants/permission";
import EditView from "src/components/ViewEdit";
import { url } from "src/utils/url";
const AddBooking = () => {
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

  const [individualData, setIndividualData] = useState<serviceProps>({
    name: "",
    status: "Active",
    notes: "",
  });

  const [addAnother, setAddAnother] = useState(false);

  const params = useParams();
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
      case "booking-status":
        url = "booking-status";
        break;
      default:
        url = "";
    }

    return url;
  };

  const DynamicTableChanger = () => {
    if (location.pathname.includes("booking-status")) {
      setConfigName({
        singular: "Booking Status",
        plural: "Booking Status",
        pathname: "booking-status",
        parent_path: "booking-status",
      });
    }
  };

  const [urlUtils, setUrlUtils] = useState<ConfigTableUrlUtils>({
    page: 1,
    size: 5,
    archived: "",
    q: "",
  });

  const readOnly = location.pathname?.includes("view");

  // ---------Activity FUNCTIONS----------------
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
    service && setIndividualData(service);
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
      <Href to={`/config/${configName.parent_path}`} style={{ textTransform: "capitalize" }}>
        {configName.parent_path}
      </Href>
    </Link>,
    <Typography key="3" color="text.primary">
      {!!params?.bookingStatusId && !readOnly ? "Edit " : readOnly ? "View " : "Add "}{" "}
      {configName.singular}
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
      navigate(`/config/${configName.parent_path}/add`);
    } catch (error: any) {
      setDeleteLoading(false);
      setOpenModal(false);
      const {
        response: { data: detail },
      } = error;
      if (detail) {
        enqueueSnackbar(
          (detail?.detail?.message ? detail?.detail?.message : error?.message) ||
            "Something went wrong!",
          {
            variant: "error",
          },
        );
      }
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
    console.log(configName);
    if (!configName?.pathname) return;
    if (configName?.pathname === "types") {
      setCustomRoutes({
        backendUrl: allRoutes?.activityType?.backendUrl,
      });
    } else if (configName?.pathname === "status") {
      setCustomRoutes({
        backendUrl: allRoutes?.activityStatus?.backendUrl,
      });
    } else if (configName?.pathname === "booking-status") {
      setCustomRoutes({
        backendUrl: url?.bookingStatus,
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
    navigate(`/config/${configName.parent_path}/edit/${id}`);
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
    <div className="add-region-config-holder position-relative">
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
      {!readOnly && (
        <UploadCsv
          sampleLinkHandler={downloadSample}
          sampleLink={`/`}
          uploadUri={`/${routes?.backendUrl}/import-csv`}
          onClose={() => setOpenCsvModal(false)}
          open={opeCsvModal}
        />
      )}
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
              {!!params?.bookingStatusId && !readOnly ? "Edit " : readOnly ? "View " : "Add "}{" "}
              {configName.singular}
            </Typography>
            <Typography variant="body1" component="p">
              {!!params?.bookingStatusId && !readOnly ? "Edit " : readOnly ? "View " : "Add "} all
              the details of your {configName.plural.toLowerCase()} here.
            </Typography>
          </div>
          {!readOnly && (
            <div className="right">
              <Button
                variant="outlined"
                startIcon={<img src="/src/assets/icons/icon-upload.svg" alt="icon-upload" />}
                onClick={() => setOpenCsvModal(true)}
              >
                Upload CSV
              </Button>
            </div>
          )}
        </Stack>
      </div>

      {!readOnly && (
        <div className="border-wrapper">
          {generalCardContainer.length > 0 && (
            <div className="regions">
              <div className="regions-area" key={Number(loading)}>
                {slicedRegion()?.map((card: any) => (
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
      )}

      <EditView permission={permissionList.BookingStatus.edit} />

      {location.pathname.includes("booking-status") === true && (
        <BookingStatusForm
          service={individualData}
          setIndividualData={setIndividualData}
          updateCard={setGeneralCardContainer}
          disabled={readOnly}
          addAnother={addAnother}
          setAddAnother={setAddAnother}
        ></BookingStatusForm>
      )}
    </div>
  );
};

export default AddBooking;
