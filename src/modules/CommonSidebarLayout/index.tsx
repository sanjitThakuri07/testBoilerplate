import { Box } from "@mui/system";
import FullPageLoader from "src/components/FullPageLoader";
import { permissionList } from "src/constants/permission";
import { fetchIndividualApi, setErrorNotification } from "src/modules/apiRequest/apiRequest";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { searchParamObject } from "src/modules/utils/index";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useLocation, useNavigate } from "react-router";
import { getAPI } from "src/lib/axios";
import { usePermissionStore } from "src/store/zustand/permission";
import { parseQueryParams } from "src/utils/queryParams";
import "../finance/finance.scss";
import { fetchData } from "../finance/functionality";
import BASDataTable from "src/modules/table/BASDataTable";
import CommonFilter, {
  converToProperFormikFormat,
  FilteredValue,
} from "src/modules/config/Filters/CommonFilter";
import { INSPECTION_INITIAL_VALUE } from "src/modules/config/filterOptionsList";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import { useTemplateFieldsStore } from "src/store/zustand/templates/templateFieldsStore";
import usePageStore from "src/store/zustand/page";

interface NavigateColumnProps {
  navigateColumnName: string;
  navigateTo: Function | null;
}

// =============== Contractor and services common component ==============
export default function CommonSidebarLayout() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [presentFilter, setPresentFilter] = React.useState(false);
  const navigate = useNavigate();

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
    buttonName: "Data",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: "id",
    subSectionUrl: null,
  });
  const [getFilterValue, setFilterValue] = React.useState(INSPECTION_INITIAL_VALUE);
  const { enqueueSnackbar } = useSnackbar();

  const { services, setServices } = useContractorServicesStore();
  const searchParams = new URLSearchParams(location.search);
  const searchObject = searchParamObject(searchParams);

  const { sidebarId } = useParams();

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const { permissions } = usePermissionStore();

  const { pages, fetchPages, loading, tableActionHandler, tableDatas }: any = usePageStore();

  const getData = async () => {
    // for api end point
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: "templates-data",
      buttonName: "Inspection",
      deleteFieldName: { value: "id", key: "title" },
    }));

    const apiResponse = await fetchPages({ query: { templates: sidebarId }, getAll: true });
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
    if (sidebarId) {
      getData();
      setPathName((prev) => ({
        ...prev,
        buttonName: "Data",
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
  }, [urlUtils, sidebarId]);

  const tableUpdateDatas: any = {
    page: {
      data: tableDatas,
      setterFn: async ({ datas, type }: any) => {
        await tableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
  };

  return (
    <Box sx={{ p: "20px" }} className="config-holder">
      {loading && <FullPageLoader />}

      <BASDataTable
        data={tableUpdateDatas?.page?.data || []}
        onDataChange={onDataTableChange}
        tableIndicator={pathName}
        setterFunction={tableUpdateDatas?.page?.setterFn || null}
        count={totalCount}
        csvDownload={false}
        urlUtils={urlUtils}
        tableOptions={{
          chipOptionsName: ["inspection_status"],
        }}
        permissions={permissions}
        permission={permissionList.InspectionName}
        navigateTitle={{
          column: "template",
          navigate: true,
          navigateMode: "view",
          routePath: ({ data }: any) => {
            navigate(`/inspections/edit/${data?.id}`);
          },
        }}
        onAdd={() => {
          navigate(`/template/inspection/${sidebarId}`);
        }}
        onEdit={(data: any) => {
          navigate(`/inspections/edit/${data?.id}`);
        }}
        actionViewMode={{
          type: "dot",
          dotModeOptions: [
            {
              Icon: <img src="/src/assets/icons/manage_access.svg" alt="report" />,
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
