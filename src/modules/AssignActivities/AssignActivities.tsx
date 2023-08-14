import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import AddModal from "src/components/AddModal/AddModal";
import CustomPopUp from "src/components/CustomPopup/index";
import FullPageLoader from "src/components/FullPageLoader";
import { ActivityAnalyticCard } from "src/components/InfoCard";
import { usePayloadHook } from "constants/customHook/payloadOptions";
import { permissionList } from "src/constants/permission";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import CommonFilter, {
  FilteredValue,
  converToProperFormikFormat,
} from "src/modules/config/Filters/CommonFilter";
import { ASSIGN_ACTIVITY_INITIAL_VALUE } from "src/modules/config/filterOptionsList";
import BASDataTable from "src/modules/table/BASDataTable";
import { BASConfigTableProps } from "src/interfaces/configs";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAPI } from "src/lib/axios";
import { usePermissionStore } from "src/store/zustand/permission";
import { parseQueryParams } from "utils/queryParams";
import AddAssignActivity from "./AddAssignActivity";
import AssignActivityTabs from "./AssignActivityTabs";
import BottomNavigation from "./BottomNavigation";

const analytics = {
  Completed: 2,
  Test: 0,
  "Testing Anotherssss": 0,
  dasa: 1,
  dasda: 0,
  "New Test ": 0,
  "Testing Activity Status": 0,
  Testing: 0,
  "Another Test": 0,
  sdfsdfsdas: 0,
  "Activity Mode_copy_8a": 0,
  "Activity Mode": 0,
};

const AssignActivities = () => {
  const [loading, setLoading] = useState(false);
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState<any>(ASSIGN_ACTIVITY_INITIAL_VALUE);
  const [totalCount, setTotalCount] = React.useState(0);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pathName, setPathName] = React.useState({
    backendUrl: "activity",
    pathUrl: "activity",
    buttonName: "Assign Activity",
    deleteFieldName: "id",
  });
  const [activityStatus, setActivityStatus] = React.useState([]);
  const [activityAnalytics, setActivityAnalytics] = React.useState({});

  const [presentFilter, setPresentFilter] = React.useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});

  const [assignActivity, setAssignActivityData] = React.useState<BASConfigTableProps>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });

  const [urlUtils, setUrlUtils] = usePayloadHook();
  const [values, setValues] = useState({
    assignees: [],
    user_dept: [],
    due_date: null,
    created_by: "",
    modified_by: "",
    status: "",
    inspection: [],
  });

  const { permissions } = usePermissionStore();
  console.log(urlUtils);

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setPresentFilter(false);
      setFilterValue?.(ASSIGN_ACTIVITY_INITIAL_VALUE);
    }
    setValues({
      assignees: [],
      user_dept: [],
      due_date: null,
      created_by: "",
      modified_by: "",
      status: "",
      inspection: [],
    });
  };
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let type = searchParams.get("type");
  const { enqueueSnackbar } = useSnackbar();

  if (type === null) {
    type = "";
  }

  const getFilterAssignActivities = async ({ url }: any) => {
    setLoading(true);
    await fetchApI({
      setterLoading: setLoading,
      setterFunction: (data: any) => {
        setAssignActivityData((prev) => {
          return {
            ...prev,
            ...data,
            items: data.items,
            headers: data.headers,
            page: data.page,
            pages: data.pages,
            size: data.size,
            total: data.total,
            archivedCount: data?.info?.archived_count,
          };
        });
        setTotalCount(data.total);
      },
      getAll: true,
      url,
      queryParam: parseQueryParams(urlUtils).replace("?", ""),
    });
    setLoading(false);
  };

  async function getActivityStatus() {
    await fetchApI({
      setterFunction: setActivityStatus,
      url: "activity-status/",
    });
  }

  async function getActivityAnalytics() {
    const { data, status } = await getAPI("activity/analytics");
    if (status === 200 || (status > 200 && status < 200)) {
      setActivityAnalytics(data);
    } else {
      enqueueSnackbar("Error Fetching Activity Analytics", { variant: "error" });
    }
    // await fetchApI({
    //   setterFunction: setActivityAnalytics,
    //   url: ,
    // });
  }

  // useEffect(() => {
  //   getAllAssignActivities();
  // }, [urlUtils]);

  useEffect(() => {
    if (type === "assigned") {
      getFilterAssignActivities({ url: "activity/self" });
    } else if (type === "overdue") {
      getFilterAssignActivities({ url: "activity/overdue" });
    } else {
      getFilterAssignActivities({ url: "activity/" });
    }
  }, [type, urlUtils]);

  useEffect(() => {
    getActivityStatus();
  }, [urlUtils]);

  useEffect(() => {
    getActivityAnalytics();
  }, []);

  // useEffect(() => {
  //   setUrlUtils((prev) => {
  //     return {
  //       ...prev,
  //       q: '',
  //       filterQuery: '',
  //     };
  //   });
  //   if (!presentFilter) {
  //     setFilterValue(values);
  //   }
  // }, [presentFilter]);

  return (
    <Box sx={{ p: "20px" }} className="config-holder customer__container">
      <AddModal
        openModal={openAddModal}
        setOpenModal={() => setOpenAddModal(!openAddModal)}
        confirmationHeading={"Activity"}
        confirmationDesc=""
      >
        <AddAssignActivity />
      </AddModal>
      <Typography variant="h1" mt={2} className="customer__heading">
        Assign Activities
      </Typography>
      {/* <Grid className="info__container" container spacing={2}>
        {[
          {
            title: `${assignActivity?.items?.length}`,
            subtitle: 'Total Activities',
            badgeContent: { value: '', status: '' },
          },
          {
            title: '2',
            subtitle: 'Pending',
            badgeContent: { value: ' (2)', status: 'Pending' },
          },
          {
            title: '0',
            subtitle: 'Completed',
            badgeContent: { value: 'Completed (0)', status: 'Paid' },
          },
        ].map((item, index): any => {
          return (
            <Grid item xs={4} md={2} key={index}>
              <InfoCard
                title={item?.title}
                subtitle={item?.subtitle}
                badgeContent={item?.badgeContent}
              />
            </Grid>
          );
        })}
      </Grid> */}
      <Box
        sx={{
          display: "flex",
          marginBottom: 2,
          maxWidth: "100%",
          overflowX: "scroll",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
            borderRadius: "10px",
          },
        }}
      >
        {Object.entries(activityAnalytics || {}).map(([key, value], index): any => {
          return <ActivityAnalyticCard key={key} title={key} count={value} />;
        })}
      </Box>
      {/* <Grid className="info__container" container spacing={2}>
        {Object.entries(activityAnalytics || {}).map(([key, value], index): any => {
          return (
            <div key={index}>
              <ActivityAnalyticCard title={key} count={value} />
            </div>
          );
        })}
      </Grid> */}
      {loading && <FullPageLoader />}
      <AssignActivityTabs />
      <CustomPopUp
        openModal={openModal}
        title={viewData?.name || ""}
        setOpenModal={() => {
          setOpenModal(false);
        }}
        headers={assignActivity?.headers}
        viewData={viewData}
        chipOptions={["status"]}
      >
        {/* {JSON.stringify(viewData)} */}
      </CustomPopUp>
      <div className="table__width">
        {" "}
        <BASDataTable
          permissions={permissions}
          permission={permissionList.Activity}
          data={assignActivity}
          deletePath={deleteEndpoint}
          onDataChange={onDataTableChange}
          configName={pathName?.pathUrl}
          backendUrl={pathName?.backendUrl}
          count={totalCount}
          setterFunction={setAssignActivityData}
          tableIndicator={pathName}
          keyName={"assign_activities"}
          csvDownload={false}
          isAddModal={false}
          setOpenAddModal={setOpenAddModal}
          urlUtils={urlUtils}
          onView={(data: any) => {
            setViewData(data);
            setOpenModal(true);
          }}
          allowFilter={{
            filter: true,
            className: "filter__field",
            filteredOptionLength: presentFilter,
          }}
          navigateTitle={{ navigateMode: "view", column: "title", navigate: true }}
          // this is for custom api integration/ chip options
          tableOptions={{
            setIsLoading: setLoading,
            chipOptionsName: ["status", "priority"],
            status: {
              select: true,
              multiple: false,
              api: {
                api: "activity/change-status",
                columnId: "id",
              },
              options: activityStatus || [],
              displayKeyName: "name",
              setKeyName: "id",
              field: "status",
            },
            bottomNavigation: ({ selectedData, setSelectedData }: any) => {
              return (
                <BottomNavigation
                  permissions={permissions}
                  permission={permissionList.Activity}
                  selectedData={selectedData}
                  setSelectedData={setSelectedData}
                  domainName="Activity"
                  activityStatus={activityStatus}
                  filterValues={setUrlUtils}
                  tableDataSet={{ setAssignActivityData, assignActivity }}
                  urlUtils={urlUtils}
                  tableIndicator={pathName}
                  setterFunction={setAssignActivityData}
                />
              );
            },
          }}
          FilterComponent={({ filterModal, setFilterModal }: any) => {
            return (
              // <Filter
              //   filterValues={setUrlUtils}
              //   values={values}
              //   setValues={setValues}
              //   setPresentFilter={setPresentFilter}
              //   setFilterModal={setFilterModal}
              //   filterObj={{ getFilterValue, setFilterValue }}
              // />
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
              />
            );
          }}
          filterChildren={
            <FilteredValue
              getFilterValue={getFilterValue}
              setFilterValue={setFilterValue}
              onDataTableChange={onDataTableChange}
            />
          }
        ></BASDataTable>
      </div>
    </Box>
  );
};

export default AssignActivities;
