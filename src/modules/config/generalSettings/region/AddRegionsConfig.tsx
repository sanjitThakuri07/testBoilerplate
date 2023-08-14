import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { Breadcrumbs, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import BackButton from "src/components/buttons/back";
import { CountryProps, LocationProps, RegionProps, TerritoryProps } from "interfaces/configs";
import { useEffect, useState } from "react";
import RegionForm from "./RegionForm";
import "./regions.scss";
import UploadCsv from "../upload/UploadCsv";
import RegionCard from "./RegionCard";
import { useLocation, useParams, Link as Href, useNavigate } from "react-router-dom";
import { useConfigStore } from "globalStates/config";
import { deleteAPI, getAPI, postAPI } from "src/lib/axios";
import TerritoryForm from "../territory/TerritotyForm";
import CountryForm from "../country/CountryForm";
import LocationForm from "../location/LocationForm";
import { useSnackbar } from "notistack";
import BillingAggrementForm from "src/modules/config/finance/billingAggrement/AddBillingAggrement";
import TariffRateType from "src/modules/config/finance/tarrifRateType/AddTariffRateType";
import { ConfigTableUrlUtils } from "../OrganizationConfiguration";
import { Box } from "@mui/system";
import AddInspectionNames from "src/modules/config/Inspection_types/InspectionNames/AddInspectionNames";
import AddInspectionStatus from "src/modules/config/Inspection_types/InspectionStatus/AddInspectionStatus";
import FullPageLoader from "src/components/FullPageLoader";
import EditView from "src/components/ViewEdit";
import { permissionList } from "src/constants/permission";

const AddRegionsConfig = () => {
  const [isRegionExpanded, setIsRegionExpanded] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [opeCsvModal, setOpenCsvModal] = useState(false);
  const [sampleUrl, setSampleUrl] = useState("");
  const [generalCardContainer, setGeneralCardContainer] = useState<any>([]);
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
  const [currentRegion, setCurrentRegion] = useState<RegionProps>({
    code: "",
    name: "",
    status: "Active",
    notes: "",
    notification_email: [],
  });

  const [currentTerritory, setCurrentTerritory] = useState<TerritoryProps>({
    country: "",
    name: "",
    code: "",
    status: "Active",
    notes: "",
    notification_email: "",
  });

  const [currentCountry, setCurrentCountry] = useState<CountryProps>({
    region: "",
    country: "",
    code: "",
    notes: "",
    status: "Active",
    notification_email: [],
    tax_type: "",
    tax_percentage: null,
  });

  const [currentLocation, setCurrentLocation] = useState<LocationProps>({
    territory: "",
    location: "",
    suburb: "",
    city: "",
    state: "",
    post_code: "",
    status: "Active",
    notes: "",
    notification_email: "",
  });

  const { regionId, locationId, territoryId, countryId, billingId, tariffId, inspectionId } =
    useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    regions: { items },
    setRegions,
    deleteRegions,

    countries: { items: countries },
    setCountries,
    deleteCountries,

    territories: { items: territories },
    setTerritories,
    deleteTerritories,

    locations,
    setLocations,
    deleteLocations,
  } = useConfigStore();
  const [loading, setLoading] = useState(false);
  const [addAnother, setAddAnother] = useState(false);

  // getting the query params from the url

  const DynamicTableChanger = () => {
    if (location.pathname.includes("region")) {
      setConfigName({
        singular: "Region",
        plural: "Regions",
        pathname: "region",
        parent_path: "general-settings",
      });
    } else if (location.pathname.includes("country")) {
      setConfigName({
        singular: "Country",
        plural: "Countries",
        pathname: "country",
        parent_path: "general-settings",
      });
    } else if (location.pathname.includes("territory")) {
      setConfigName({
        singular: "Territory",
        plural: "Territories",
        pathname: "territory",
        parent_path: "general-settings",
      });
    } else if (location.pathname.includes("location")) {
      setConfigName({
        singular: "Location",
        plural: "Locations",
        pathname: "location",
        parent_path: "general-settings",
      });
    } else if (location.pathname.includes("billing-agreement-names")) {
      setConfigName({
        singular: "Billing Aggrement Names",
        plural: "billing-aggrement-names",
        pathname: "billing-agreement-names",
        parent_path: "finance",
      });
    } else if (location.pathname.includes("tariff-rate-types")) {
      setConfigName({
        singular: "Tariff Rate Type",
        plural: "tariff-rate",
        pathname: "tariff-rate-types",
        parent_path: "finance",
      });
    } else if (location.pathname.includes("inspection-name")) {
      setConfigName({
        singular: "Inspection Name",
        plural: "inspection-name",
        pathname: "inspection-name",
        parent_path: "inspection-types",
      });
    } else if (location.pathname.includes("inspection-status")) {
      setConfigName({
        singular: "Inspection Status",
        plural: "inspection-status",
        pathname: "inspection-status",
        parent_path: "inspection-types",
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

  // ---------REGION FUNCTIONS----------------
  const handleDeleteRegion = (id?: number, fieldKey: string = "key") => {
    // if (!id) return;
    // const region = items.find((rg) => rg.id === id);
    // region && setCurrentRegion(region);
    let filteredData: any = generalCardContainer.filter((label: any) => label?.id === id);
    setTrackLabel(filteredData[0]?.[fieldKey]);
    setDeleteId(id);
    setOpenModal(true);
  };

  const editRegion = (id?: number) => {
    // if (!id) return;
    const region = items.find((rg) => rg.id === id);
    region && setCurrentRegion(region);
    const reginForm = document.querySelector(".region-form-holder");
    reginForm?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="1" color="inherit">
      <Href to={"/config/general-settings/region"}>General Settings</Href>
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href to={`/config/${configName.parent_path}/${configName.pathname}`}>
        {configName.singular}
      </Href>
    </Link>,
    <Typography key="3" color="text.primary">
      {(regionId ||
        countryId ||
        territoryId ||
        locationId ||
        billingId ||
        tariffId ||
        inspectionId) &&
      !readOnly
        ? "Edit "
        : readOnly
        ? "View "
        : "Add "}
      {configName.singular}
    </Typography>,
  ];

  const deleteRegion = async () => {
    setDeleteLoading(true);
    try {
      await deleteAPI(`${configName.pathname}/`, {
        config_ids: [deleteId],
      });
      setDeleteLoading(false);
      setOpenModal(false);
      // open the toaster
      setGeneralCardContainer((prev: any) => {
        return [...(prev?.filter((data: any) => data?.id !== deleteId) || [])];
      });
      enqueueSnackbar("Data deleted successfully", { variant: "success" });
      // navigate(`/config/${configName.parent_path}/${configName.pathname}`);
    } catch (error: any) {
      setDeleteLoading(false);
      setOpenModal(false);
      enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
    }
  };

  const downloadSample = async (e: any) => {
    e.preventDefault();
    const { status, data } = await getAPI(`${configName.pathname}/csv-format`);
    if (status === 200) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${configName.pathname}.csv`);
      document.body.appendChild(link);
      link.click();
    } else {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const getAllGeneralCard = async () => {
    setLoading(true);
    try {
      const { status, ...response } = await getAPI(
        `${configName.pathname}/?q=${urlUtils.q}&archived=${urlUtils.archived}&page=${urlUtils.page}&size=${urlUtils.size}`,
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
    getAllGeneralCard();
  }, [configName.pathname]);

  const transformArr = (arr: RegionProps[]): RegionProps[] => {
    if (!isRegionExpanded) return arr.filter((_, index) => index < 3);
    return arr;
  };

  const handleNavigateToEdit = (id?: number) => {
    navigate(`/config/${configName.parent_path}/${configName.pathname}/edit/${id}`);
  };

  const slicedRegion = () => {
    let slicedRegion = [];
    if (isRegionExpanded) {
      slicedRegion = generalCardContainer?.slice(0, 3);
    } else {
      slicedRegion = generalCardContainer?.slice(0);
    }
    return slicedRegion;
  };

  const permissionObj: any = {
    region: permissionList?.Region.edit,
    country: permissionList?.Country.edit,
    territory: permissionList?.Territory.edit,
    location: permissionList?.Location.edit,
    // ['billing-agreement-names']: permissionList?.BillingAgreement,
    // ['tariff-rate-types']: pe
  };

  function getKey() {
    let key = "name";
    switch (configName.pathname) {
      case "region":
        return (key = "name");
      case "country":
        return (key = "name");
      case "location":
        return (key = "location");
    }

    return key;
  }

  return (
    <div className="add-region-config-holder position-relative">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={deleteRegion}
        confirmationHeading={`Do you want to delete ${trackLabel}?`}
        confirmationDesc={`This ${configName.pathname.replaceAll("-", " ")} will be deleted.`}
        status="warning"
        confirmationIcon="/assets/icons/icon-feature.svg"
        loader={deleteLoading}
      />

      {!readOnly && (
        <UploadCsv
          sampleLinkHandler={downloadSample}
          sampleLink={`/`}
          uploadUri={`/${configName.pathname}/import-csv`}
          onClose={() => setOpenCsvModal(false)}
          open={opeCsvModal}
        />
      )}
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

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div className="left">
            <Typography variant="h3" color="primary">
              {(regionId ||
                countryId ||
                territoryId ||
                locationId ||
                billingId ||
                tariffId ||
                inspectionId) &&
              !readOnly
                ? "Edit "
                : readOnly
                ? "View "
                : "Add "}{" "}
              {configName.singular}
            </Typography>
            <Typography variant="body1" component="p">
              {(regionId ||
                countryId ||
                territoryId ||
                locationId ||
                billingId ||
                tariffId ||
                inspectionId) &&
              !readOnly
                ? "Edit "
                : readOnly
                ? "View "
                : "Add "}{" "}
              all the details of your {configName.singular.toLowerCase()} here.
            </Typography>
          </div>
          {!readOnly && (
            <div className="right">
              <Button
                variant="outlined"
                startIcon={<img src="/assets/icons/icon-upload.svg" alt="icon-upload" />}
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
                {slicedRegion()?.map((card: any) => (
                  <RegionCard
                    {...card}
                    key={card?.id}
                    status={card.status}
                    navigate={handleNavigateToEdit}
                    handleDeleteRegion={handleDeleteRegion}
                    editRegion={editRegion}
                    fieldKey={getKey()}
                    name={card?.[getKey()]}
                  />
                ))}
              </div>
              {generalCardContainer?.length > 3 && (
                <div className="btn-holder">
                  <Button
                    variant="contained"
                    onClick={() => setIsRegionExpanded(!isRegionExpanded)}
                  >
                    View {isRegionExpanded ? "More" : "Less"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* {!!loading && <FullPageLoader />} */}
      <EditView permission={permissionObj?.[configName?.pathname]} />
      {location.pathname.includes("region") === true ? (
        <>
          <RegionForm
            region={currentRegion}
            disabled={readOnly}
            updateCard={setGeneralCardContainer}
          />
        </>
      ) : location.pathname.includes("territory") === true ? (
        <TerritoryForm
          territory={currentTerritory}
          disabled={readOnly}
          updateCard={setGeneralCardContainer}
        />
      ) : location.pathname.includes("country") === true ? (
        <CountryForm
          country={currentCountry}
          disabled={readOnly}
          updateCard={setGeneralCardContainer}
        />
      ) : location.pathname.includes("location") === true ? (
        <LocationForm location={currentLocation} disabled={readOnly} />
      ) : location.pathname.includes("billing-agreement-names") === true ? (
        <BillingAggrementForm disabled={readOnly} />
      ) : location.pathname.includes("tariff-rate-types") === true ? (
        <TariffRateType disabled={readOnly} updateCard={setGeneralCardContainer} />
      ) : location.pathname.includes("inspection-name") === true ? (
        <AddInspectionNames
          generalCardContainer={generalCardContainer}
          disabled={readOnly}
          updateCard={setGeneralCardContainer}
        />
      ) : location.pathname.includes("inspection-status") === true ? (
        <AddInspectionStatus
          generalCardContainer={generalCardContainer}
          disabled={readOnly}
          updateCard={setGeneralCardContainer}
        />
      ) : null}
    </div>
  );
};

export default AddRegionsConfig;
