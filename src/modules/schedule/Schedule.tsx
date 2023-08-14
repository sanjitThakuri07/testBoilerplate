import BackButton from "src/components/buttons/back";

import React from "react";
import { Link as Href, useNavigate, useParams } from "react-router-dom";
import { Box, Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import FullPageLoader from "src/components/FullPageLoader";
import "./Schedule.scss";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import { usePermissionStore } from "src/store/zustand/permission";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import { useSnackbar } from "notistack";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { permissionList } from "src/constants/permission";
import { usePayloadHook } from "constants/customHook/payloadOptions";

const Schedule = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [deleteEndpoint, setDeleteEndpoint] = React.useState<string>("");
  const [configSchedule, setConfigSchedule] = React.useState<any>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });
  const [urlUtils, setUrlUtils] = usePayloadHook();

  const { permissions } = usePermissionStore();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { templateId } = useParams();

  // const templateId = 80;

  const getScheduledData = async () => {
    setLoading(true);
    setDeleteEndpoint(`template-schedule/`);
    await fetchTableData({
      setData: setConfigSchedule,
      setTotalCount,
      enqueueSnackbar,
      api: `template-schedule/${templateId}`,
      urlUtils,
    });
    setLoading(false);
  };

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });
  };

  React.useEffect(() => {
    getScheduledData();
  }, [urlUtils]);

  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href
        style={{
          textDecoration: "none",
        }}
        to={`/template`}
      >
        Template
      </Href>
    </Link>,
    // <Typography key="3" color="text.primary">
    //   Schedule Inspection
    // </Typography>,
  ];

  const handleEdit = (id: number) => {
    navigate(`/schedule/edit/${templateId}/${id}`);
  };

  return (
    <div id="Schedule">
      <div className="schedule_container">
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
            style={{
              marginTop: "20px",
            }}
          >
            <div className="left">
              <Typography variant="h3" color="primary">
                Schedule Inspection
              </Typography>
              <Typography variant="body1" component="p">
                You can schedule/manage your inspection here.
                {/* {configName.plural.toLowerCase()} here. */}
              </Typography>
            </div>
          </Stack>
        </div>

        <Box sx={{ p: "20px" }} className="config-holder loader__parent">
          {loading && <FullPageLoader></FullPageLoader>}

          <BASDataTableUpdate
            data={configSchedule}
            deletePath={deleteEndpoint}
            onDataChange={onDataTableChange}
            configName={`Schedule Templates`}
            setterFunction={setConfigSchedule}
            tableIndicator={{
              backendUrl: "template-schedule",
              deleteFieldName: "id",
              buttonName: "Schedule Inspection",
              editFrontEndUrlGetter: (id: number) => {
                return `/schedule/edit/${templateId}/${id}`;
              },
            }}
            backendUrl={"template-schedule/"}
            count={totalCount}
            urlUtils={urlUtils}
            onAdd={(data: any) => {
              navigate(`/template/schedule-inspection/${templateId}`);
            }}
            // onEdit={(id: any) => {
            //   navigate(`/schedule/edit/${templateId}/${id}`);
            // }}
            tableOptions={{
              chipOptionsName: ["status", "repeat_status"],
            }}
            permissions={permissions}
            permission={permissionList.InspectionSchedules}
          ></BASDataTableUpdate>
        </Box>
      </div>
    </div>
  );
};

export default Schedule;
