import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings";
import BASDataTable from "src/modules/table/BASDataTable";
import { BASConfigTableProps } from "src/src/interfaces/configs";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { getAPI } from "src/lib/axios";
import UserProfileLayout from "./UserProfileLayout";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";

export default function UserProfileTemplateAccessed() {
  const location = useLocation();
  const { profileId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
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
    }
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await fetchTableData({
        setData: setTableData,
        setTotalCount,
        enqueueSnackbar,
        api: `organization-user/${profileId}/templates`,
        urlUtils,
      });
      setLoading(false);
    };
    getData();
  }, [urlUtils, location.pathname]);

  return (
    <>
      <UserProfileLayout>
        <Box className="config-holder">
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
          <Box sx={{ mt: 5 }}>
            <BASDataTable
              data={tableData}
              onDataChange={onDataTableChange}
              tableIndicator={pathName}
              count={totalCount}
              csvDownload={false}
              deletePath={""}
              configName={"Templateso"}
              backendUrl={"backend url"}
              showDelete={false}
              showEdit={false}
              showAdd={false}
              setterFunction={setTableData}
              maxCharacters={10000000000}
              // actionViewMode="dot"
              // handleTableActionModal={handleTableActionModal}
            />
          </Box>
        </Box>
      </UserProfileLayout>
    </>
  );
}
