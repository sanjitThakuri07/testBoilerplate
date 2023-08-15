import { deleteAPI, getAPI } from "src/lib/axios";
import { RegionProps } from "src/interfaces/configs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/material";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import BackButton from "src/components/buttons/back";
import { PrivateRoute } from "src/constants/variables";
import UploadCsv from "src/modules/config/generalSettings/upload/UploadCsv";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings";
import { useDepartmentConfigStore } from "src/store/zustand/globalStates/config";
import { Box } from "@mui/system";
import OrgForms from "./OrgForms";

const AddOrgUsers = () => {
  const [isRegionExpanded, setIsRegionExpanded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [opeCsvModal, setOpenCsvModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<RegionProps>({
    name: "",
    status: "Active",
    notes: "",
    notification_email: [],
  });
  const { departmentId } = useParams();
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

  const [urlUtils, setUrlUtils] = useState<ConfigTableUrlUtils>({
    page: 1,
    size: 5,
    archived: "",
    q: "",
  });

  const setCurrentDepartmentFromLocal = (tempRegion: RegionProps) => {
    if (departmentId) {
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
        setCurrentDepartmentFromLocal(data.items.find((rg: any) => rg.id === Number(departmentId)));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/src/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" href="/config/general-settings/region">
      General Settings
    </Link>,
    <Link underline="hover" href={`/config/users/user`}>
      Users Details
    </Link>,
    <Typography
      key="3"
      color="text.primary"
      sx={{ background: "#F9FAFB", borderRadius: "5px", padding: "2px 5px" }}
    >
      Add User
    </Typography>,
  ];

  const deleteRegion = async () => {
    try {
      await deleteAPI("user-department/", {
        department_ids: [currentDepartment.id],
      });
      currentDepartment.id && deleteDepartments(currentDepartment.id);
      setCurrentDepartment({
        name: "",
        status: "Active",
      });
      setOpenModal(false);
      navigate(PrivateRoute.CONFIG.department.home);
    } catch (error) {
      setOpenModal(false);
      setCurrentDepartment({
        name: "",
        status: "Active",
      });
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      fetchRegions();
    } else {
      const currRegion = items.find((rg: any) => rg.id === Number(departmentId));
      currRegion && setCurrentDepartment(currRegion);
    }
  }, []);

  const transformArr = (arr: RegionProps[]): RegionProps[] => {
    if (!isRegionExpanded) return arr.filter((_, index) => index < 3);
    return arr;
  };

  return (
    <div className="add-region-config-holder">
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
              Add Users
            </Typography>
            <Typography variant="body1" component="p">
              Add all the users details here.
            </Typography>
          </div>
          <div className="right">
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              {/* <Box> */}
              {/* <Button
                  variant="text"
                  startIcon={<img src="/src/assets/icons/shareLink.svg" alt="icon-upload" />}>
                  Share Invite Link
                </Button>
              </Box> */}
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<img src="/src/assets/icons/icon-upload.svg" alt="icon-upload" />}
                  onClick={() => setOpenCsvModal(true)}
                >
                  Upload CSV
                </Button>
              </Box>
            </Stack>
          </div>
        </Stack>
      </div>
      <div className="user-border">
        <div>
          <div className="regions-area" key={Number(loading)}>
            {/* {transformArr(items).map((rg) => (
              <RegionCard
                {...rg}
                key={rg.id}
                handleDeleteRegion={handleDeleteRegion}
                editRegion={editRegion}
              />
            ))} */}
          </div>
          {items?.length > 6 && (
            <div className="btn-holder">
              <Button variant="contained" onClick={() => setIsRegionExpanded(!isRegionExpanded)}>
                View {isRegionExpanded ? "Less" : "More"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <OrgForms />
    </div>
  );
};

export default AddOrgUsers;
