import { deleteAPI, getAPI } from "src/lib/axios";
import { RegionProps } from "src/src/interfaces/configs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/material";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import BackButton from "src/components/buttons/back";
import DepartmentForm from "./DepartmentForm";
import { PrivateRoute } from "src/constants/variables";
import UploadCsv from "src/modules/config/generalSettings/upload/UploadCsv";
import RegionCard from "src/modules/config/generalSettings/region/RegionCard";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings";
import { useDepartmentConfigStore } from "src/store/zustand/globalStates/config";
import { Box } from "@mui/system";
import { permissionList } from "src/constants/permission";
import EditView from "src/components/ViewEdit";
import { downloadSample } from "src/modules/apiRequest/apiRequest";
import { useSnackbar } from "notistack";

const AddUserDepartment = () => {
  const location = useLocation();
  const [isRegionExpanded, setIsRegionExpanded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [opeCsvModal, setOpenCsvModal] = useState(false);
  const [userCardContainer, setUserCardContainer] = useState<any>([]);
  const [currentDepartment, setCurrentDepartment] = useState<RegionProps>({
    name: "",
    status: "Active",
    notes: "",
    notification_email: [],
  });
  const { userDepartmentId } = useParams();
  const {
    departments: { items },
    setDepartments,
    deleteDepartments,
  } = useDepartmentConfigStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteRegion = (id?: number) => {
    if (!id) return;
    const region = items.find((rg: any) => rg.id === id);
    region && setCurrentDepartment(region);
    setOpenModal(true);
  };

  const editRegion = (id?: number) => {
    if (!id) return;
    const region = items.find((rg: any) => rg.id === id);
    region && setCurrentDepartment(region);
    const reginForm = document.querySelector(".region-form-holder");
    reginForm?.scrollIntoView({
      behavior: "smooth",
    });
  };
  const readOnly = location.pathname?.includes("view");

  const [urlUtils, setUrlUtils] = useState<ConfigTableUrlUtils>({
    page: 1,
    size: 5,
    archived: "",
    q: "",
  });

  const setCurrentDepartmentFromLocal = (tempRegion: RegionProps) => {
    if (userDepartmentId) {
      setCurrentDepartment(tempRegion);
    }
  };

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const { status, ...response } = await getAPI(
        `user-department/?q=${urlUtils.q}&archived=${urlUtils.archived}&page=${urlUtils.page}&size=${urlUtils.size}`,
      );

      if (status === 200) {
        const { data } = response;
        setDepartments(data);
        setUserCardContainer(data.items);
        setCurrentDepartmentFromLocal(
          data.items.find((rg: any) => rg.id === Number(userDepartmentId)),
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleNavigateToEdit = (id?: number) => {
    navigate(`/config/users/user-department/edit/${id}`);
  };

  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/src/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" href="/config/general-settings/region">
      General Settings
    </Link>,
    <Link underline="hover" href={`/config/users/user-department`}>
      Users
    </Link>,
    <Typography
      key="3"
      color="text.primary"
      sx={{ background: "#F9FAFB", borderRadius: "5px", padding: "2px 5px" }}
    >
      User Department
    </Typography>,
  ];

  const deleteRegion = async () => {
    try {
      await deleteAPI("user-department/", {
        config_ids: [currentDepartment.id],
      });
      currentDepartment.id && deleteDepartments(currentDepartment.id);
      setUserCardContainer((prev: any) => {
        return [...(prev?.filter((data: any) => data?.id !== currentDepartment.id) || [])];
      });
      enqueueSnackbar("Data deleted successfully", { variant: "success" });

      setCurrentDepartment({
        name: "",
        status: "Active",
      });
      setOpenModal(false);
    } catch (error) {
      setOpenModal(false);
      setCurrentDepartment({
        name: "",
        status: "Active",
      });
    }
  };

  useEffect(() => {
    fetchRegions();
  }, [location.pathname]);

  const transformArr = (arr: RegionProps[]): RegionProps[] => {
    if (!isRegionExpanded) return arr.filter((_, index) => index < 3);
    return arr;
  };

  const slicedRegion = () => {
    let slicedRegion = [];
    if (isRegionExpanded) {
      slicedRegion = userCardContainer?.slice(0, 3);
    } else {
      slicedRegion = userCardContainer?.slice(0);
    }
    return slicedRegion;
  };

  function getKey() {
    let key = "name";
    if (location.pathname.includes("/user-department/")) {
    }

    return key;
  }

  const { enqueueSnackbar } = useSnackbar();

  return (
    <div className="add-region-config-holder position-relative">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => {
          setOpenModal(!openModal);
          setCurrentDepartment({
            name: "",
            status: "Active",
          });
        }}
        handelConfirmation={deleteRegion}
        confirmationHeading={`Do you want to delete region ${currentDepartment?.name}?`}
        confirmationDesc={"This region will be deleted."}
        status="warning"
        confirmationIcon="src/assets/icons/icon-feature.svg"
      />
      <UploadCsv
        sampleLink="/"
        uploadUri="/user-department/import-csv?organization=1"
        onClose={() => setOpenCsvModal(false)}
        sampleLinkHandler={(e: any) => {
          downloadSample(e, "user-department/get-format", enqueueSnackbar, "User Department");
        }}
        open={opeCsvModal}
      />
      <div className="header-block">
        <Box>
          <BackButton />
        </Box>
        <div className="breadcrumbs-holder" style={{ display: "inline-block" }}>
          <Breadcrumbs
            sx={{
              background: "#FCFCFD",
              padding: "5px 13px",
              borderRadius: "5px",
            }}
            separator={<img src="/src/assets/icons/chevron-right.svg" alt="right" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </div>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div className="left">
            <Typography variant="h3" color="primary">
              {userDepartmentId && !readOnly ? "Edit " : readOnly ? "View " : "Add "} User
              Department
            </Typography>
            <Typography variant="body1" component="p">
              {userDepartmentId && !readOnly ? "Edit " : readOnly ? "View " : "Add "} all the
              details of your user department here.
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
          {userCardContainer.length > 0 && (
            <div className="regions">
              <div className="regions-area" key={Number(loading)}>
                {slicedRegion()?.map((card: RegionProps) => (
                  <RegionCard
                    {...card}
                    key={card.id}
                    status={card.status}
                    navigate={handleNavigateToEdit}
                    handleDeleteRegion={handleDeleteRegion}
                    editRegion={editRegion}
                  />
                ))}
              </div>
              {userCardContainer?.length > 3 && (
                <div className="btn-holder">
                  <Button
                    variant="contained"
                    onClick={() => setIsRegionExpanded(!isRegionExpanded)}
                  >
                    View {!isRegionExpanded ? "Less" : "More"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <EditView permission={permissionList.UserDepartment.edit} />
      {/* <DepartmentForm region={currentDepartment} currentDepartment={currentDepartment} setCurrentDepartment={setCurrentDepartment} /> */}
      <DepartmentForm disabled={readOnly} updateCard={setUserCardContainer} />
    </div>
  );
};

export default AddUserDepartment;
