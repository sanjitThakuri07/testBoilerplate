import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings";
import BASDataTable from "src/modules/table/BASDataTable";
import { BASConfigTableProps } from "src/interfaces/configs";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { getAPI } from "src/lib/axios";
import UserProfileLayout from "./UserProfileLayout";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import { usePayloadHook } from "constants/customHook/payloadOptions";

export default function UserProfileNotifications() {
  const location = useLocation();
  const { profileId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [getFilterValue, setFilterValue] = React.useState({});
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    pathUrl: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = React.useState<BASConfigTableProps>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setFilterValue({});
    }
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await fetchTableData({
        setData: setTableData,
        setTotalCount,
        enqueueSnackbar,
        api: `organization-user/${profileId}/notification`,
        urlUtils,
      });
      setLoading(false);
    };
    getData();
  }, [urlUtils, location.pathname]);

  return (
    <>
      <UserProfileLayout>
        <Box className="config-holder  loader__parent">
          {loading && <FullPageLoader className="custom__page-loader" />}
          <Box sx={{ mt: 5 }}>
            <BASDataTable
              data={tableData}
              onDataChange={onDataTableChange}
              tableIndicator={pathName}
              count={totalCount}
              csvDownload={false}
              // optional
              deletePath={""}
              configName={"Notifications"}
              backendUrl={"backend url"}
              showDelete={false}
              showEdit={false}
              showAdd={false}
              // setterFunction={setTableData}
              // actionViewMode="dot"
              // handleTableActionModal={handleTableActionModal}
            />
          </Box>
        </Box>
      </UserProfileLayout>
    </>
  );
}
