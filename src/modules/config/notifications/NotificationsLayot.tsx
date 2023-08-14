import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { permissionList } from "src/constants/permission";
import { TextSeperator } from "containers/utils";
import { useAlertPopup } from "globalStates/alertPopup";
import { BASConfigTableProps } from "interfaces/configs";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { getAPI } from "src/lib/axios";
import { usePermissionStore } from "src/store/zustand/permission";
import BASDataTable from "../generalSettings/BASDataTable";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "../generalSettings/OrganizationConfiguration";
import SignUpAlertModal from "./SignUpAlertModal";
import UserAlertModal from "./UserAlertModal";
import UserAlertModalLayout from "./UserAlertModalLayout";
import DeletableChips from "../generalSettings/Filters/FilterChip";
import CommonFilter, {
  FilteredValue,
  converToProperFormikFormat,
} from "src/modules/config/Filters/CommonFilter";
import { fetchIndividualApi, fetchTableData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import { NOTIFICATION_FILTER_INITIAL_VALUE } from "src/modules/config/filterOptionsList/index";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import { getDataInPopUp } from "./notificationAPI";
import CustomPopUp from "src/components/CustomPopup/index";
import { usePayloadHook } from "constants/customHook/payloadOptions";

export default function NotificationsLayot() {
  const location = useLocation();
  // getting the search value
  const {
    alertContainerValue,
    setAlertContainerValue,
    searchValue,
    setSearchValue,
    openModalBox,
    setOpenModalBox,
    selectedSearchModule,
    setSelectedSearchModule,
  } = useAlertPopup();

  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState<any>(NOTIFICATION_FILTER_INITIAL_VALUE);
  const [presentFilter, setPresentFilter] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [configNotifications, setConfigNotifications] = React.useState<BASConfigTableProps>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });
  const [allSearchModules, setAllSearchModules] = React.useState([]);
  const [isProceedButtonDisabled, setIsProceedButtonDisabled] = React.useState(false);
  const [individualData, setIndividualData] = useState({});
  const [viewMode, setViewMode] = useState("edit");
  const [viewData, setViewData] = useState<any>({});
  const [openModal, setOpenModal] = useState(false);

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const prevUrlUtils = useRef<ConfigTableUrlUtils>();

  const { permissions } = usePermissionStore();

  const getAllUserSettings = async () => {
    setLoading(true);
    setDeleteEndpoint(`alert`);
    await fetchTableData({
      setData: setConfigNotifications,
      setTotalCount,
      enqueueSnackbar,
      api: "alert",
      urlUtils,
    });
    setLoading(false);
  };

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setPresentFilter(false);
      setFilterValue(NOTIFICATION_FILTER_INITIAL_VALUE);
    }
  };

  useEffect(() => {
    if (prevUrlUtils.current && prevUrlUtils.current !== urlUtils) {
      getAllUserSettings();
    }
    prevUrlUtils.current = urlUtils;
  }, [urlUtils, urlUtils?.filterQuery, getFilterValue]);

  // clearing the search input value
  useEffect(() => {
    setUrlUtils((prev) => {
      return {
        ...prev,
        q: "",
        filterQuery: "",
      };
    });
  }, [location.pathname]);

  // getting all the search inputs values for the popup
  const getAllUserActivityModule = async () => {
    await getAPI(`module/?q=${searchValue && searchValue}`).then(
      (res: { data: any; status: any }) => {
        if (res.status === 200) {
          setAllSearchModules(res?.data);
        }
      },
    );
  };

  useEffect(() => {
    getAllUserActivityModule();
  }, [openModalBox]);

  // form submit handler for user activity popup
  const searchSubmitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    getAllUserActivityModule();
  };

  // disabling the button when value is empty
  useEffect(() => {
    if (Object.keys(selectedSearchModule || {})?.length === 0) {
      setIsProceedButtonDisabled(true);
    } else {
      setIsProceedButtonDisabled(false);
    }
  }, [selectedSearchModule]);

  const readOnly = viewMode === "view" ? true : false;

  return (
    <OrganizationConfiguration>
      <Box>
        {/* user alert modal layout */}
        <UserAlertModalLayout
          modal={openModalBox}
          setModal={() => {
            setOpenModalBox(!openModalBox);
            setAlertContainerValue("user-alert");
          }}
          title={`   ${
            selectedSearchModule?.name ? TextSeperator(selectedSearchModule?.name) : "User Activity"
          } Alert`}
          subTitle="Receive notifications when defined trigger conditions are matched."
        >
          {/* user alert */}
          {alertContainerValue === "user-alert" ? (
            <>
              <UserAlertModal
                datas={allSearchModules}
                searchSubmitHandler={searchSubmitHandler}
                search={searchValue}
                setSearch={setSearchValue}
                setSelectedSearchModule={setSelectedSearchModule}
                isProceedButtonDisabled={isProceedButtonDisabled}
                setAlertContainerValue={setAlertContainerValue}
                alertContainerValue={alertContainerValue}
                disabled={readOnly}
              />
            </>
          ) : (
            <>
              <SignUpAlertModal
                title={`${
                  selectedSearchModule?.name ? TextSeperator(selectedSearchModule?.name) : ""
                } Alert`}
                values={individualData}
                closeBox={() => {
                  setAlertContainerValue("user-alert");
                  setOpenModalBox(false);
                }}
                setTableData={setConfigNotifications}
                disabled={readOnly}
                updateIndividualEmail={(val: any) => {
                  setIndividualData((prev: any) => ({ ...prev, email_content: val }));
                }}
              />
            </>
          )}
        </UserAlertModalLayout>
      </Box>

      <Box sx={{ p: "20px" }} className="config-holder loader__parent">
        {loading && <FullPageLoader className="custom__page-loader"></FullPageLoader>}
        <CustomPopUp
          openModal={openModal}
          title={viewData?.name || ""}
          setOpenModal={() => {
            setOpenModal(false);
          }}
          headers={configNotifications?.headers}
          viewData={viewData}
          chipOptions={["status"]}
        >
          {/* {JSON.stringify(viewData)} */}
        </CustomPopUp>

        <BASDataTableUpdate
          data={configNotifications}
          deletePath={deleteEndpoint}
          onDataChange={onDataTableChange}
          configName={`Notifications & Alerts`}
          setterFunction={setConfigNotifications}
          tableIndicator={{
            backendUrl: "alert",
            deleteFieldName: "id",
            buttonName: "Notifications & Alerts",
          }}
          backendUrl={"alert/"}
          onView={(data: any) => {
            setViewData(data);
            setOpenModal(true);
          }}
          count={totalCount}
          urlUtils={urlUtils}
          onTitleNavigate={{
            navigateColumnName: "name",
            navigateTo: async (id: any) => {
              setViewMode("view");
              getDataInPopUp?.({
                setLoading,
                setIndividualData,
                allSearchModules,
                setSelectedSearchModule,
                setAlertContainerValue,
                setOpenModalBox,
                id,
              });
            },
          }}
          onAdd={(data: any) => {
            setViewMode("add");
            setIndividualData(() => {});
            setOpenModalBox(true);
          }}
          onEdit={async (id: any) => {
            setViewMode("edit");
            getDataInPopUp?.({
              setLoading,
              setIndividualData,
              allSearchModules,
              setSelectedSearchModule,
              setAlertContainerValue,
              setOpenModalBox,
              // enqueueSnackbar,
              id,
            });
          }}
          tableOptions={{
            chipOptionsName: ["status"],
          }}
          allowFilter={{
            filter: true,
            className: "filter__field",
            filteredOptionLength: presentFilter,
          }}
          permissions={permissions}
          permission={permissionList.Alert}
          FilterComponent={({ filterModal, setFilterModal }: any) => {
            return (
              <CommonFilter
                setFilterUrl={setUrlUtils}
                filterModal={filterModal}
                INITIAL_VALUES={converToProperFormikFormat({
                  data: getFilterValue,
                  getFilterValue,
                })}
                setFilterModal={setFilterModal}
                setPresentFilter={setPresentFilter}
                filterObj={{ getFilterValue, setFilterValue }}
              ></CommonFilter>
            );
          }}
          filterChildren={
            <FilteredValue
              getFilterValue={getFilterValue}
              setFilterValue={setFilterValue}
              onDataTableChange={onDataTableChange}
            />
          }
        ></BASDataTableUpdate>
      </Box>
    </OrganizationConfiguration>
  );
}
