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
import { allRoutes } from "src/routers/routingsUrl";
import FindingsAndRecommendationsEdit from "./FindingsAndRecommendationForm";
import FindingsAndRecommendationsForm from "./FnRForm";

const AddCategory = () => {
  const [isMore, setMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [opeCsvModal, setOpenCsvModal] = useState(false);
  const [sampleUrl, setSampleUrl] = useState("");
  const [deleteId, setDeleteId] = useState<number | null | undefined>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [trackLabel, setTrackLabel] = useState("");
  const [configName, setConfigName]: any = useState({
    singular: "",
    plural: "",
    pathname: "",
    pathname_url: "",
    parent_path: "",
    parent_path_url: "",
  });

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { routes, setCustomRoutes } = usePathUrlSettor();
  const searchParams = new URLSearchParams(location.search);
  const searchObject = Object.fromEntries(searchParams.entries());

  const {
    services: { items },
    setServices,
    deleteServices,
  } = useContractorServicesStore();

  const DynamicTableChanger = () => {
    let newPath = location?.pathname?.includes("edit")
      ? location?.pathname.toString().split("/")?.slice(0, -2)?.join("/")
      : location?.pathname.toString().split("/")?.slice(0, -1)?.join("/");

    console.log({ newPath });
    if (searchObject["category"]) {
      setConfigName({
        singular: "Finding",
        plural: "Findings",
        pathname: "findings",
        parent_path: "Category",
        pathname_url: `${newPath}?category=${searchObject[`category`]}`,
        parent_path_url: "findings-recommendations",
      });
      setCustomRoutes({
        backendUrl: allRoutes?.FARFindings?.backendUrl,
      });
    } else if (searchObject["findings"]) {
      setConfigName({
        singular: "Recommendation",
        plural: "Recommendations",
        pathname: "Recommendation",
        parent_path: "Category",
        second_parent_path: "Findings",
        second_parent_url: `${newPath}?p_category=${searchObject?.["p_category"]}&type=findings`,
        pathname_url: `${newPath}?findings=${searchObject[`findings`]}`,
        parent_path_url: "findings-recommendations",
      });
      setCustomRoutes({
        backendUrl: allRoutes?.FARRecommendations?.backendUrl,
      });
    } else if (searchObject["p_category"]) {
      if (searchObject?.type !== "findings") {
        setConfigName({
          singular: "Sub Category",
          plural: "Sub Categorys",
          pathname: "Sub Category",
          parent_path: "Category",
          pathname_url: `${newPath}?p_category=${searchObject[`p_category`]}`,
          parent_path_url: "findings-recommendations",
        });
        setCustomRoutes({
          backendUrl: allRoutes?.FARCategory?.backendUrl,
        });
      } else {
        setConfigName({
          singular: "Finding",
          plural: "Findings",
          pathname: "Findings",
          parent_path: "Category",
          pathname_url: `${newPath}?p_category=${searchObject[`p_category`]}&type=findings`,
          parent_path_url: "findings-recommendations",
        });
      }
    } else {
      setConfigName({
        singular: "Category",
        plural: "Categorys",
        pathname: "",
        parent_path: "Category",
        pathname_url: "",
        parent_path_url: "findings-recommendations",
      });
      setCustomRoutes({
        backendUrl: allRoutes?.FARPCategory?.backendUrl,
      });
    }
  };

  const [urlUtils, setUrlUtils] = useState<ConfigTableUrlUtils>({
    page: 1,
    size: 5,
    archived: "",
    q: "",
  });

  // ---------Activity FUNCTIONS----------------
  const handleDeleteService = (id?: number) => {
    setDeleteId(id);
    setOpenModal(true);
  };

  const breadcrumbs = () => {
    let breadcrumb = [
      <Link key="0" href="/">
        <img src="/src/assets/icons/home.svg" alt="home" />
      </Link>,
      <Link underline="hover" key="1" color="inherit">
        <Href to={`/config/${configName?.parent_path_url}`} style={{ textTransform: "capitalize" }}>
          {configName.parent_path}
        </Href>
      </Link>,
      <Typography key="3" color="text.primary">
        {!!params?.findingsAndRecommendationsId ? "Edit" : "Add"} {configName.singular}
      </Typography>,
    ];

    let linkCollection: any = configName?.second_parent_url
      ? [
          <Link underline="hover" key="1" color="inherit">
            <Href to={`${configName?.second_parent_url}`} style={{ textTransform: "capitalize" }}>
              {configName.second_parent_path}
            </Href>
          </Link>,
        ]
      : [];

    if (configName?.pathname) {
      breadcrumb?.splice(
        2,
        0,
        ...linkCollection.concat(
          <Link underline="hover" key="1" color="inherit">
            <Href to={`${configName?.pathname_url}`} style={{ textTransform: "capitalize" }}>
              {configName.pathname}
            </Href>
          </Link>,
        ),
      );
    }

    return breadcrumb;
  };

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

  useEffect(() => {
    DynamicTableChanger();
  }, [Object?.keys(searchObject)?.length]);

  const transformArr = (arr: serviceProps[]): serviceProps[] => {
    if (!isMore) return arr.filter((_, index) => index < 3);
    return arr;
  };

  const handleNavigateToEdit = (id?: number) => {
    // /config/contractors/services/
    navigate(`/config/${configName.parent_path}/edit/${id}`);
  };

  const getTextTitle = ({ text, lowerCase = false }: any) => {
    let title = "";
    if (searchObject?.["p_category"] && searchObject?.type === "findings") {
      title = "Findings";
    } else if (searchObject?.["p_category"]) {
      title = "Sub Category";
    } else {
      title = text;
    }
    return lowerCase ? title?.toString().toLowerCase() : title;
  };

  return (
    <div className="add-region-config-holder">
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
            {breadcrumbs()}
          </Breadcrumbs>
        </div>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div className="left">
            <Typography variant="h3" color="primary">
              {/* {!!params?.findingsAndRecommendationsId ? 'Edit' : 'Add'} {configName.singular} */}
              {!!params?.findingsAndRecommendationsId ? "Edit" : "Add"}{" "}
              {getTextTitle({ text: configName?.singular })}
            </Typography>
            <Typography variant="body1" component="p">
              {!!params?.findingsAndRecommendationsId ? "Edit" : "Add"} all the details of your{" "}
              {getTextTitle({ text: configName.plural.toLowerCase(), lowerCase: true })} here.
            </Typography>
          </div>
          <div className="right">
            {/* <Button
              variant="outlined"
              startIcon={<img src="/src/assets/icons/icon-upload.svg" alt="icon-upload" />}
              onClick={() => setOpenCsvModal(true)}>
              Upload CSV
            </Button> */}
          </div>
        </Stack>
      </div>

      {/* for edit use another  */}
      {location.pathname.includes("findings-recommendations") === true &&
        !location.pathname.includes("edit") &&
        !searchObject?.["_type"] && <FindingsAndRecommendationsForm />}
      {location.pathname.includes("findings-recommendations") === true &&
        (location.pathname.includes("edit") || searchObject?.["_type"] == "2") && (
          <FindingsAndRecommendationsEdit />
        )}
    </div>
  );
};

export default AddCategory;
