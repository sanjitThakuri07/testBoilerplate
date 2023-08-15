import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { Box } from "@mui/system";
import { Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import BASDataTable from "src/modules/table/BASDataTable";
import { deleteAPI, getAPI } from "src/lib/axios";
import { BASConfigTableProps } from "src/interfaces/configs";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { fetchTableData, setErrorNotification } from "src/modules/apiRequest/apiRequest";
import InfoCard from "src/components/InfoCard/index";
import { useNavigate, useParams } from "react-router-dom";
import ModalLayout from "src/components/ModalLayout";
import CustomerAdd from "../Form/CustomerAdd";
import { permissionList } from "src/constants/permission";
import { usePermissionStore } from "src/store/zustand/permission";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import CommonFilter, {
  converToProperFormikFormat,
  FilteredValue,
} from "src/modules/config/Filters/CommonFilter";
import { CUSTOMER_USER_INITIAL_VALUE } from "src/modules/config/filterOptionsList";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import BackButton from "src/components/buttons/back";

interface NavigateColumnProps {
  navigateColumnName: string;
  navigateTo: Function;
}

const CustomersTable = () => {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [getFilterValue, setFilterValue] = React.useState(CUSTOMER_USER_INITIAL_VALUE);
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    pathUrl: "",
    buttonName: "",
    deleteFieldName: "id",
  });

  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
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
  const [presentFilter, setPresentFilter] = React.useState(false);

  const [urlUtils, setUrlUtils] = usePayloadHook();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const { customerId } = useParams();
  const { permissions } = usePermissionStore();

  const navigate = useNavigate();

  const getData = async () => {
    let returnedParams = `customers/${customerId}/users`;
    let path = "customers";

    setPathName({
      backendUrl: returnedParams,
      pathUrl: path,
      buttonName: "User",
      deleteFieldName: "id",
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
    //   const { status, data } = await getAPI(`customers/${customerId}/users/`);
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
      setFilterValue(CUSTOMER_USER_INITIAL_VALUE);
      setPresentFilter(false);
    }
  };

  useEffect(() => {
    getData();
  }, [urlUtils, location.pathname]);

  const [onNavigate, setOnNavigate] = React.useState<NavigateColumnProps>({
    navigateColumnName: "full_name",
    navigateTo: (id: any) => {
      // Replace the current URL with the updated query parameters
      navigate(`/customer/user/${customerId}/view/${id}`);
    },
  });

  const redirectToEdit = (id: any) => {
    navigate(`/config/users/user/edit/${id}`);
  };

  return (
    <Box sx={{ p: "20px" }} className="config-holder customer__container">
      <Typography variant="h1" mt={2} className="customer__heading">
        Customer User
      </Typography>

      <div
        className="back_button_style"
        style={{
          marginBottom: "10px",
        }}
      >
        <BackButton />
      </div>

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
        <BASDataTableUpdate
          data={customerData}
          deletePath={deleteEndpoint}
          onDataChange={onDataTableChange}
          // tableIndicator={pathName}
          setterFunction={setcustomerData}
          configName={pathName?.pathUrl}
          count={totalCount}
          csvDownload={false}
          urlUtils={urlUtils}
          openAddModal={openModal}
          backendUrl={pathName?.backendUrl}
          // deleteIcon={false}
          tableOptions={{
            chipOptionsName: ["status"],
          }}
          // onEdit={(id: number) => redirectToEdit(id)}
          tableIndicator={{
            backendUrl: pathName?.backendUrl,
            deleteFieldName: {
              value: "id",
              key: "full_name",
            },
            buttonName: "User",
            editFrontEndUrlGetter: (id: number) => {
              return `/customer/user/${customerId}/edit/${id}`;
            },
          }}
          actionViewMode={{
            type: "dot",
            // dotModeOptions: [
            //   {
            //     Icon: <img src="/src/assets/icons/manage_access.svg" alt="access" />,
            //     label: 'Active',
            //     handleButtonClick: console.log('Manage Access'),
            //   },
            // ],
          }}
          isAddModal={true}
          setOpenAddModal={setOpenModal}
          onTitleNavigate={onNavigate}
          permissions={permissions}
          keyName={"id"}
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

      <ModalLayout
        id="AddCustomerModal"
        large={true}
        children={
          <>
            <div className="config_modal_form_css user__department-field">
              <div className="config_modal_heading">
                <div className="config_modal_title">Add Customer User</div>
                <div className="config_modal_text">
                  <div>
                    Create a Email ID and password (if required) for the customers to login to their
                    platform.
                  </div>
                </div>
              </div>
              <Divider variant="middle" style={{ margin: "1px 0" }} />
              <CustomerAdd
                modalState={(e: boolean) => {
                  setOpenModal(e);
                  getData();
                }}
              />
            </div>
          </>
        }
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Box>
  );
};

export default CustomersTable;
