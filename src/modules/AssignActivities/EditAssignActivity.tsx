import React, { useEffect, useState } from "react";
import { Breadcrumbs, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import BackButton from "src/components/buttons/back";
import { useLocation, useParams, Link as Href, useNavigate } from "react-router-dom";
import AddAssignActivity from "./AddAssignActivity";
import { getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import FullPageLoader from "src/components/FullPageLoader";

const EditAssignActivity = () => {
  const [configName, setConfigName] = useState({
    singular: "Activity",
    plural: "Assign Activities",
    pathname: "assign-activities",
    parent_path: "assign-activities",
    api_pathname: "activity",
  });
  const [loading, setLoading] = useState(false);
  const { assignActivityId } = useParams();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [assignData, setAssignData] = useState<any>([]);

  const DynamicTableChanger = () => {
    if (location.pathname.includes("roles-and-permission")) {
      setConfigName({
        singular: "Activity",
        plural: "Assign Activities",
        pathname: "assign-activities",
        parent_path: "assign-activities",
        api_pathname: "activity",
      });
    }
  };

  const fetchActivity = async () => {
    const assignParams = "activity";
    try {
      setLoading(true);
      const { status, data } = await getAPI(`${assignParams}/${assignActivityId}`);

      setLoading(false);
      setAssignData(data);
    } catch (error: any) {
      setLoading(false);
      enqueueSnackbar(error.response.data.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };

  //   breadcrums
  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="src/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="1" color="inherit">
      <Href to={`/assign-activities`}>Assign Activity</Href>
    </Link>,
    <Typography key="2" color="text.primary">
      {assignActivityId ? "Edit" : "Add"}
    </Typography>,
  ];

  useEffect(() => {
    DynamicTableChanger();
  }, [configName.api_pathname]);

  useEffect(() => {
    fetchActivity();
  }, []);
  return (
    <>
      {loading && <FullPageLoader />}
      {!loading && (
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
                  {assignActivityId ? "Edit" : "Add"} {configName.singular}
                </Typography>
              </div>
            </Stack>
            <AddAssignActivity
              assignActivityID={assignActivityId}
              isEdit={assignActivityId ? true : false}
              assignData={assignData && assignData}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EditAssignActivity;
