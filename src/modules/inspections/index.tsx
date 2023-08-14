import { Box } from "@mui/system";
import FullPageLoader from "src/components/FullPageLoader";
import { permissionList } from "src/constants/permission";
import { fetchIndividualApi, setErrorNotification } from "src/modules/apiRequest/apiRequest";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { searchParamObject } from "containers/utils/index";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { getAPI } from "src/lib/axios";
import { usePermissionStore } from "src/store/zustand/permission";
import { parseQueryParams } from "utils/queryParams";
import "../finance/finance.scss";
import { fetchData } from "../finance/functionality";
import BASDataTable from "src/modules/table/BASDataTable";
import CommonFilter, {
  converToProperFormikFormat,
  FilteredValue,
} from "src/modules/config/Filters/CommonFilter";
import { INSPECTION_INITIAL_VALUE } from "src/modules/config/filterOptionsList";
import { usePayloadHook } from "constants/customHook/payloadOptions";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";

interface NavigateColumnProps {
  navigateColumnName: string;
  navigateTo: Function | null;
}

// =============== Contractor and services common component ==============
export default function Inspections() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [presentFilter, setPresentFilter] = React.useState(false);

  const [onNavigate, setOnNavigate] = React.useState<NavigateColumnProps>({
    navigateColumnName: "contract_no",
    navigateTo: (id: any) => {
      // Replace the current URL with the updated query parameters
      navigate(`/finance/tariffs?tariff=${id}`);
    },
  });
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    sectionTitle: "",
    buttonName: "Inspection",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: "id",
    subSectionUrl: null,
  });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(INSPECTION_INITIAL_VALUE);
  const { enqueueSnackbar } = useSnackbar();
  const [templateData, setTemplateData] = React.useState<any>({
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

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const { permissions } = usePermissionStore();

  const getData = async () => {
    let params = location.pathname.split("/").slice(-1).join("");
    // for api end point
    let returnedParams = "";
    let path = "";

    switch (params) {
      case "template":
        returnedParams = "templates";
        path = "";
        break;
      default:
        returnedParams = "";
        path = "";
    }
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: "templates-data",
      buttonName: "Inspection",
      deleteFieldName: { value: "id", key: "title" },
    }));
    try {
      setLoading(true);
      const { status, data } = await getAPI(`templates-data/${parseQueryParams(urlUtils)}`);
      if (status === 200) {
        setLoading(false);
        const itemss = data.items || [];
        let newItems: any = [];
        if (itemss?.length > 0) {
          newItems = itemss?.map((item: any) => {
            let phone_numbers = item?.phone_numbers?.length
              ? item?.phone_numbers?.map((it: string) => it.split("/")?.reverse()[0])
              : [];
            return { ...item, phone_numbers };
          });
        }
        //setting common page data
        setTemplateData((prev: any) => {
          return {
            ...prev,
            items: newItems || [],
            headers: { ...data.headers },
            page: data.page,
            pages: data.pages,
            size: data.size,
            total: data.total,
            archivedCount: data?.info?.archived_count,
          };
        });

        setTotalCount(data.total);
      }
    } catch (error: any) {
      setLoading(false);
      setErrorNotification(error, enqueueSnackbar);
    }
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
      setFilterValue(INSPECTION_INITIAL_VALUE);
      setPresentFilter(false);
    }
  };

  useEffect(() => {
    if (searchObject?.[`tariff`]) {
      fetchData({
        id: Number(searchObject?.["tariff"]),
        setLoading,
        fetchIndividualApi,
        setTotalCount,
        setPathName,
        enqueueSnackbar,
        setData: setTemplateData,
        urlUtils,
        location,
        domain: "Record",
        buttonName: "Record",
        url: "finance-tariff/tariff-records",
      });
      setOnNavigate((prev) => ({
        navigateColumnName: "",
        navigateTo: null,
      }));
    } else {
      getData();
      setPathName((prev) => ({
        ...prev,
        frontEndUrl: `${location?.pathname}/create`,
      }));
      setOnNavigate({
        navigateColumnName: "inspection",
        navigateTo: (id: any) => {
          // Replace the current URL with the updated query parameters
          navigate(`/template/inspection/${id}`);
        },
      });
    }
  }, [Object.keys(searchObject || {})?.length, urlUtils]);

  const {
    templateDatasets,
    setTemplateDatasets,
    setTemplateHeading,
    updateTemplateDatasets,
    resetTemplateValues,
  } = useTemplateFieldsStore();

  useEffect(() => {
    resetTemplateValues();
  }, []);

  return (
    <Box sx={{ p: "20px" }} className="config-holder">
      {loading && <FullPageLoader />}

      <BASDataTable
        data={templateData}
        deletePath={deleteEndpoint}
        onDataChange={onDataTableChange}
        tableIndicator={pathName}
        setterFunction={setTemplateData}
        configName={pathName?.buttonName}
        count={totalCount}
        csvDownload={false}
        urlUtils={urlUtils}
        backendUrl={pathName?.backendUrl}
        tableOptions={{
          chipOptionsName: ["inspection_status"],
        }}
        permissions={permissions}
        permission={permissionList.InspectionName}
        navigateTitle={{
          column: "template",
          navigate: true,
          navigateMode: "view",
        }}
        showAdd={false}
        actionViewMode={{
          type: "dot",
          dotModeOptions: [
            {
              Icon: <img src="/assets/icons/manage_access.svg" alt="report" />,
              label: "Generate Report",
              handleButtonClick: ({ id }: any) => {
                navigate(`report/${id}`);
              },
            },
          ],
        }}
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
      ></BASDataTable>
    </Box>
  );
}
