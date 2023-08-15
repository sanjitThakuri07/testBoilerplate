import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { Box } from "@mui/system";
import { Button, Typography, Stack } from "@mui/material";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import BASDataTable from "src/modules/table/BASDataTable";
import { deleteAPI, getAPI } from "src/lib/axios";
import { BASConfigTableProps } from "src/interfaces/configs";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { allRoutes } from "src/routers/routingsUrl";
import {
  fetchIndividualApi,
  fetchTableData,
  setErrorNotification,
} from "src/modules/apiRequest/apiRequest";
import { searchParamObject } from "src/modules/utils/index";
import { fetchData } from "./functionality";
import CustomBadgeCreator from "src/components/CustomBadgeCreator/index";
import { formatedDate } from "src/modules/utils/index";
import FullPageLoader from "src/components/FullPageLoader";
import "./finance.scss";
import FinanceLayout from "./FinanceLayout";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import CommonFilter, {
  converToProperFormikFormat,
  FilteredValue,
} from "src/modules/config/Filters/CommonFilter";
import { parseQueryParams } from "src/utils/queryParams";
import { TARIFF_INITIAL_VALUE } from "src/modules/config/filterOptionsList";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import CustomPopUp from "src/components/CustomPopup/index";
import SubTabs from "./tariffs/SubTabs";

interface NavigateColumnProps {
  navigateColumnName: string;
  navigateTo: Function | null;
}

// =============== Contractor and services common component ==============
export default function Finance() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [onNavigate, setOnNavigate] = React.useState<NavigateColumnProps>({
    navigateColumnName: "contract_no",
    navigateTo: (id: any) => {
      navigate(`/finance/tariffs?tariff=${id}`);
    },
  });
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    sectionTitle: "",
    buttonName: "tariff",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: { value: "id", key: "contract_no" },
    subSectionUrl: null,
  });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(TARIFF_INITIAL_VALUE);
  const [presentFilter, setPresentFilter] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [financeData, setFinanceData] = React.useState<any>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });
  const { services, setServices } = useContractorServicesStore();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchObject = searchParamObject(searchParams);
  const { permissions } = usePermissionStore();

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});

  const getData = async ({ type }: any) => {
    let params = location.pathname.split("/").slice(-1).join("");
    // for api end point
    let returnedParams = "";
    let path = "";

    switch (params) {
      case "tariffs":
        returnedParams = allRoutes?.SidebarFinanceTariffs?.backendUrl;
        path = "Tariffs";
        break;
      default:
        returnedParams = "";
        path = "";
    }
    setLoading(true);
    await fetchTableData({
      setData: setFinanceData,
      api: returnedParams,
      setTotalCount,
      enqueueSnackbar,
      urlUtils: type ? { ...urlUtils, type } : urlUtils,
    });
    setLoading(false);
  };

  // for fetching multiple api according to search params

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setFilterValue(TARIFF_INITIAL_VALUE);
      setPresentFilter(false);
    }
  };

  useEffect(() => {
    if (searchObject?.["type"]) {
      getData({ type: searchObject?.["type"] });
      setPathName((prev) => ({
        ...prev,
        buttonName: "Tariff",
        frontEndUrl: `${location?.pathname}/add`,
        editFrontEndUrlGetter: null,
        backendUrl: allRoutes?.SidebarFinanceTariffs?.backendUrl,
      }));
      setOnNavigate({
        navigateColumnName: "contract_no",
        navigateTo: (id: any) => {
          // Replace the current URL with the updated query parameters
          navigate(`/finance/tariffs?tariff=${id}`);
        },
      });
      return;
    }
    if (searchObject?.[`tariff`]) {
      fetchData({
        id: Number(searchObject?.["tariff"]),
        setLoading,
        fetchIndividualApi,
        setTotalCount,
        // setPathName,
        // enqueueSnackbar,
        setData: (data: any) => {
          setFinanceData((prev: any) => ({
            ...data,
            items: data?.items?.map((it: any) => ({
              ...it,
              ["rate_types"]: it?.["rate_types"]?.map(
                (data: any) => `${data?.rate_type} (${data?.rate})`,
              ),
            })),
          }));

          setPathName?.((prev: any) => ({
            ...prev,
            buttonName: "Record",
            backendUrl: "finance-tariff/tariff-records",
            sectionTitle: data?.info?.tariff || data?.info?.parent || "",
            frontEndUrl: `${location?.pathname}/add${location?.search}`,
            subSectionUrl: null,
            editFrontEndUrlGetter: (id: number) =>
              `${location?.pathname}/edit/${id}${location?.search}`,
            deleteFieldName: { value: "id", key: "inspection" },
          }));
        },
        location,
        domain: "Record",
        buttonName: "Record",
        url: "finance-tariff/tariff-records",
        urlUtils: urlUtils,
      });
      setOnNavigate((prev) => ({
        navigateColumnName: "",
        navigateTo: null,
      }));
    } else {
      getData({});
      setPathName((prev) => ({
        ...prev,
        buttonName: "Tariff",
        frontEndUrl: `${location?.pathname}/add`,
        editFrontEndUrlGetter: null,
        backendUrl: allRoutes?.SidebarFinanceTariffs?.backendUrl,
      }));
      setOnNavigate({
        navigateColumnName: "contract_no",
        navigateTo: (id: any) => {
          // Replace the current URL with the updated query parameters
          navigate(`/finance/tariffs?tariff=${id}`);
        },
      });
    }
  }, [Object.keys(searchObject || {})?.length, urlUtils, searchObject?.["type"]]);

  return (
    <FinanceLayout>
      <Box sx={{ p: "20px" }} className="config-holder">
        {loading && <FullPageLoader />}
        {!searchObject["tariff"] && <SubTabs navigate={navigate} searchObject={searchObject} />}
        {!loading &&
          !!searchObject["tariff"] &&
          !!Object.keys(financeData?.info?.parent || {})?.length &&
          (() => {
            let { contract_no, begin_date, end_date, status, customer } = financeData?.info?.parent;
            return (
              <Box className="finance">
                <Button
                  onClick={() => {
                    navigate("/finance/tariffs");
                  }}
                  startIcon={<img src="/src/assets/icons/back.svg" alt="back button" />}
                  sx={{
                    textTransform: "capitalize",
                  }}
                >
                  Back
                </Button>

                <Typography variant="h1" mt={2} className="customer__heading">
                  <span>{contract_no}</span>
                  <CustomBadgeCreator
                    value={status}
                    styleChoice={status === "Inactive" ? "OutlineInactive" : "OutlineActive"}
                    badgeStyle={{
                      fontSize: "14px",
                    }}
                  />
                </Typography>
                <p className="title__finance">{customer}</p>
                <div className="date__container">
                  <p>
                    <span>Start Date:</span>
                    <span>{begin_date ? formatedDate(new Date(begin_date)) : ""}</span>
                  </p>
                  <p>
                    <span>End Date:</span>
                    <span>{end_date ? formatedDate(new Date(end_date)) : ""}</span>
                  </p>
                </div>
              </Box>
            );
          })()}

        <CustomPopUp
          openModal={openModal}
          title={viewData?.name || ""}
          setOpenModal={() => {
            setOpenModal(false);
          }}
          headers={financeData?.headers}
          viewData={viewData}
          chipOptions={["status"]}
        ></CustomPopUp>

        <BASDataTableUpdate
          data={financeData}
          deletePath={deleteEndpoint}
          onDataChange={onDataTableChange}
          setterFunction={setFinanceData}
          configName={pathName?.buttonName}
          tableIndicator={pathName}
          count={totalCount}
          urlUtils={urlUtils}
          onTitleNavigate={onNavigate}
          textTitleLength={50}
          csvDownload={false}
          backendUrl={pathName?.backendUrl}
          onView={(data: any) => {
            setViewData(data);
            setOpenModal(true);
          }}
          tableOptions={{
            chipOptionsName: ["status", "tariff_type"],
          }}
          // navigateTitle={{
          //   navigateMode: 'view',
          //   column: 'contract_no',
          //   navigate: true,
          // }}
          permissions={permissions}
          permission={permissionList.Tariffs}
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
      </Box>
    </FinanceLayout>
  );
}
