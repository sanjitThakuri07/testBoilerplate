import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { Box } from "@mui/system";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import BASDataTable from "src/modules/table/BASDataTable";
import { deleteAPI, getAPI } from "src/lib/axios";
import { BASConfigTableProps } from "src/interfaces/configs";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { fetchTableData, setErrorNotification } from "src/modules/apiRequest/apiRequest";
import InfoCard from "src/components/InfoCard/index";
import "./customer.scss";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import CommonFilter, {
  converToProperFormikFormat,
  FilteredValue,
} from "src/modules/config/Filters/CommonFilter";
import { CUSTOMER_INITIAL_VALUE } from "src/modules/config/filterOptionsList";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";

interface NavigateColumnProps {
  navigateColumnName: string;
  navigateTo: Function;
}
// =============== Contractor and services common component ==============
export default function Contractor() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    pathUrl: "",
    buttonName: "",
    deleteFieldName: { value: "id", key: "organization_name" },
  });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(CUSTOMER_INITIAL_VALUE);
  const [presentFilter, setPresentFilter] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [customerData, setcustomerData] = React.useState<BASConfigTableProps>({
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

  const { services, setServices } = useContractorServicesStore();
  const navigate = useNavigate();

  const getData = async () => {
    let params = location.pathname.split("/").slice(-1).join("");
    // console.log({ params });
    // for api end point
    let returnedParams = "";
    let path = "";

    switch (params) {
      case "customer":
        returnedParams = "customers";
        path = "Customer";
        break;
      default:
        returnedParams = "";
        path = "";
    }
    setPathName({
      backendUrl: returnedParams,
      pathUrl: path,
      buttonName: "Customer",
      deleteFieldName: { value: "id", key: "organization_name" },
    });

    setLoading(true);
    await fetchTableData({
      setData: setcustomerData,
      api: returnedParams,
      setTotalCount,
      enqueueSnackbar,
      urlUtils,
    });
    setLoading(false);
    // try {
    //   setLoading(true);
    //   const { status, data } = await getAPI(`${returnedParams}/?q=&archived=&page=1&size=5`);
    //   if (status === 200) {
    //     setLoading(false);
    //     const itemss = data.items || [];
    //     let newItems: any = [];
    //     if (itemss?.length > 0) {
    //       newItems = itemss?.map((item: any) => {
    //         let phone_numbers = item?.phone_numbers?.length
    //           ? item?.phone_numbers?.map((it: string) => it.split('/')?.reverse()[0])
    //           : [];
    //         return { ...item, phone_numbers };
    //       });
    //     }

    //     //setting common page data
    //     setcustomerData((prev) => {
    //       return {
    //         ...prev,
    //         items: newItems || [],
    //         headers: data.headers,
    //         page: data.page,
    //         pages: data.pages,
    //         size: data.size,
    //         total: data.total,
    //         archivedCount: data?.info?.archived_count,
    //       };
    //     });

    //     setTotalCount(data.total);

    //     // setting data to right store
    //     if (path.toString().toLowerCase() === 'service') {
    //       setServices({
    //         items: data.items,
    //         headers: data.headers,
    //         page: data.page,
    //         pages: data.pages,
    //         size: data.size,
    //         total: data.total,
    //         archivedCount: data?.info?.archived_count,
    //       });
    //     }
    //   }
    // } catch (error: any) {
    //   setLoading(false);
    //   setErrorNotification(error, enqueueSnackbar);
    // }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setPresentFilter(false);
      setFilterValue(CUSTOMER_INITIAL_VALUE);
    }
  };

  useEffect(() => {
    getData();
  }, [urlUtils, location.pathname]);

  const [onNavigate, setOnNavigate] = React.useState<NavigateColumnProps>({
    navigateColumnName: "organization_name",
    navigateTo: (id: any) => {
      // Replace the current URL with the updated query parameters
      navigate(`/customer/view/${id}`);
    },
  });

  return (
    <Box sx={{ p: "20px" }} className="config-holder customer__container">
      <Typography variant="h1" mt={2} className="customer__heading">
        Customers
      </Typography>
      {/* <Grid className="info__container" container spacing={2}>
        {[
          {
            title: '$22.47k',
            subtitle: 'Total Estimates(3)',
            badgeContent: { value: 'Accepted (2)', status: 'Accepted' },
          },
          {
            title: '$3.47k',
            subtitle: 'Total Estimates(3)',
            badgeContent: { value: 'Pending (2)', status: 'Pending' },
          },
          {
            title: '$22.47k',
            subtitle: 'Invoices(3)',
            badgeContent: { value: 'Paid (2)', status: 'Paid' },
          },
          {
            title: '$22.47k',
            subtitle: 'Invoices(3)',
            badgeContent: { value: 'Accepted (2)', status: 'Pending' },
          },
          {
            title: '$22.47k',
            subtitle: 'Total Estimates(3)',
            badgeContent: { value: 'Accepted (2)', status: 'Overdue' },
          },
          {
            title: '$22.47k',
            subtitle: 'Total Estimates(3)',
            badgeContent: { value: 'Accepted (2)', status: 'Draft' },
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
      <div className="table__width">
        {/* <BASDataTable
          data={customerData}
          deletePath={deleteEndpoint}
          onDataChange={onDataTableChange}
          configName={pathName?.pathUrl}
          backendUrl={pathName?.backendUrl}
          count={totalCount}
          setterFunction={setcustomerData}
          tableIndicator={pathName}
          keyName={'organization_name'}
          csvDownload={false}
          permissions={permissions}
          permission={permissionList.Customer}
          viewIcon={true}
        /> */}

        <BASDataTableUpdate
          data={customerData}
          deletePath={deleteEndpoint}
          onDataChange={onDataTableChange}
          setterFunction={setcustomerData}
          configName={pathName?.pathUrl}
          count={totalCount}
          urlUtils={urlUtils}
          keyName={"customer"}
          csvDownload={false}
          viewIcon={true}
          tableIndicator={pathName}
          onTitleNavigate={onNavigate}
          backendUrl={pathName?.backendUrl}
          tableOptions={{
            chipOptionsName: ["status"],
          }}
          permissions={permissions}
          permission={permissionList.Customer}
          allowFilter={{
            filter: true,
            className: "filter__field",
            filteredOptionLength: presentFilter,
          }}
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
      </div>
    </Box>
  );
}
