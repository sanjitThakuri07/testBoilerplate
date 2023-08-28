import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { permissionList } from "src/constants/permission";
import BASDataTable from "src/modules/table/BASDataTable";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router";
import { getAPI } from "src/lib/axios";
import { usePermissionStore } from "src/store/zustand/permission";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "../generalSettings/OrganizationConfiguration";
import GlobalResponseSetLayout from "./GlobalResponseSetLayout";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
// import {
//   CONTRACTOR_FILTER_INITIAL_VALUE,
//   SERVICES_FILTER_INITIAL_VALUE,
// } from 'src/modules/config/filterOptionsList/index';
import CommonFilter, {
  FilteredValue,
  converToProperFormikFormat,
} from "src/modules/config/Filters/CommonFilter";
import MCRModal from "src/modules/template/components/ResponseTab/MultipleChoiceResponse/MCRModal";
import GRSModal from "src/modules/template/components/ResponseTab/GlobalResponseSet/GRSModal";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import { EXTERNAL_ATTRIBUTES_INITIAL_VALUE } from "../filterOptionsList";
import CustomPopUp from "src/components/CustomPopup/index";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import { lockFields } from "src/utils/url";

// =============== GlobalResponseSet and services common component ==============
export default function GlobalResponseSet() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    sectionTitle: "",
    buttonName: "",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: "id",
    subSectionUrl: null,
    popUpField: { key: "", label: "", fieldName: "", componentType: "" },
  });
  const [staticHeader, setStaticHeader] = React.useState<any>({});
  const [isAdd, setIsAdd] = React.useState({ status: "", id: null });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(EXTERNAL_ATTRIBUTES_INITIAL_VALUE);
  const { enqueueSnackbar } = useSnackbar();
  const [GlobalResponseSetData, setGlobalResponseSetData] = React.useState<any>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 5,
    total: 0,
    archivedCount: 0,
  });
  const { services, setServices } = useContractorServicesStore();
  const [viewMode, setViewMode] = React.useState("edit");

  const [urlUtils, setUrlUtils] = usePayloadHook();
  const [presentFilter, setPresentFilter] = React.useState(false);

  const { permissions } = usePermissionStore();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});

  const getData = async () => {
    let params = location.pathname.split("/").slice(-1).join("");
    // for api end point
    let returnedParams = "";
    let path = "";

    switch (params) {
      case "internal":
        returnedParams = "internal-response";
        path = "Internal Attributes";
        setPathName((prev: any) => ({
          ...prev,
          backendUrl: returnedParams,
          buttonName: path,
          popUpField: {
            key: "options",
            label: "",
            fieldName: "name",
            titleFieldName: "name",
          },
          showAddButton: false,
          tableTitle: "Internal Attributes",
        }));
        break;
      case "relation":
        returnedParams = "relation-response";
        path = "Relational Attributes";
        setPathName((prev: any) => ({
          ...prev,
          backendUrl: returnedParams,
          buttonName: path,
          popUpField: {
            key: "options",
            label: "",
            fieldName: "name",
            titleFieldName: "name",
          },
          showAddButton: false,
          tableTitle: "Relational Attributes",
        }));
        break;
      case "custom":
        returnedParams = "global-response";
        path = "Custom Attributes";
        setStaticHeader({
          id: "Id",
          name: "Name",
          options: "Options",
        });
        setPathName((prev: any) => ({
          ...prev,
          backendUrl: returnedParams,
          buttonName: path,
          popUpField: {
            key: "options",
            label: "",
            fieldName: "name",
            titleFieldName: "name",
          },
          showAddButton: false,
          tableTitle: "Global Response",
        }));
        break;
      case "external":
        returnedParams = "external-api";
        path = "External Attributes";
        setPathName((prev: any) => ({
          ...prev,
          backendUrl: returnedParams,
          buttonName: path,
          popUpField: {
            key: "",
            label: "",
            fieldName: "",
            titleFieldName: "",
          },
          showAddButton: false,
          tableTitle: "External Attributes",
        }));
        break;
      case "status":
        returnedParams = "multiple-response";
        path = "Status Attributes";
        setPathName((prev: any) => ({
          ...prev,
          backendUrl: returnedParams,
          buttonName: path,
          showAddButton: false,
          popUpField: {
            key: "options",
            label: "All Status",
            fieldName: "name",
            componentType: "custom__chip",
            oneLine: "true",
          },
          tableTitle: "Status Attributes",
        }));
        break;
      default:
        returnedParams = "";
        path = "";
    }

    if (!returnedParams) return;

    setLoading(true);
    await fetchTableData({
      api: returnedParams,
      setTotalCount,
      setData: setGlobalResponseSetData,
      urlUtils,
    });
    setLoading(false);
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
      setFilterValue(EXTERNAL_ATTRIBUTES_INITIAL_VALUE);
    }
  };

  useEffect(() => {
    getData();
  }, [urlUtils, location.pathname]);

  const tabPermissions: any = {
    "internal-response": permissionList.InternalAttributes,
    "Custom Response Sets": [],
    "external-response": permissionList.ExternalAttributes,
  };

  function getTitleNavigation() {
    if (
      pathName?.buttonName === "Status Attributes" ||
      pathName?.buttonName === "Custom Attributes"
    ) {
      return {
        navigateColumnName: "name",
        navigateTo: async (id: any) => {
          setViewMode("view");
          setIsAdd({ status: pathName?.buttonName, id: id });
        },
      };
    } else if (pathName?.buttonName === "External Attributes") {
      return {
        navigateColumnName: "name",
        navigateTo: async (id: any) => {
          navigate(`/config/global-response-set/external/view/${id}`);
        },
      };
    }
  }

  const readOnly = viewMode === "view" ? true : false;
  return (
    <OrganizationConfiguration>
      <GlobalResponseSetLayout>
        <Box sx={{ p: "20px" }} className="config-holder loader__parent">
          {loading && <FullPageLoader className="custom__page-loader" />}
          <>
            {isAdd?.status === "Status Attributes" && (
              <MCRModal
                setOpenModal={() => {
                  // setResponseSetId(null);
                  // setOpenMCRModal(!openMCRModal);
                  setIsAdd((prev: any) => ({ ...prev, status: "" }));
                }}
                openModal={isAdd?.status ? true : false}
                responseSetId={isAdd?.id || null}
                updateState={(data: any) => {
                  if (data?.data) {
                    console.log({ data });
                    setGlobalResponseSetData?.((prev: any) => ({
                      ...prev,
                      items: [
                        data?.data,
                        ...(prev?.items?.filter((item: any) => item.id !== data?.data?.id) || []),
                      ],
                    }));
                  }
                }}
                disabled={readOnly}
              />
            )}
            {isAdd?.status === "Custom Attributes" && (
              <GRSModal
                setOpenModal={() => {
                  // setResponseSetId(null);
                  // setOpenMCRModal(!openMCRModal);
                  setIsAdd((prev: any) => ({ ...prev, status: "" }));
                }}
                openModal={isAdd?.status ? true : false}
                responseSetId={isAdd?.id || null}
                updateState={(data: any) => {
                  if (data?.data)
                    setGlobalResponseSetData?.((prev: any) => ({
                      ...prev,
                      items: [
                        data?.data,

                        ...(prev?.items?.filter((item: any) => item.id !== data?.data?.id) || []),

                        // ...(prev?.items || [])
                      ],
                    }));
                }}
                disabled={readOnly}
              />
            )}
          </>

          <CustomPopUp
            openModal={openModal}
            title={viewData?.name || ""}
            setOpenModal={() => {
              setOpenModal(false);
            }}
            headers={GlobalResponseSetData?.headers}
            viewData={viewData}
            field={{ key: "options", label: "name" }}
            chipOptions={["status"]}
          >
            {/* {JSON.stringify(viewData)} */}
          </CustomPopUp>

          <BASDataTableUpdate
            data={GlobalResponseSetData}
            deletePath={deleteEndpoint}
            onDataChange={onDataTableChange}
            setterFunction={setGlobalResponseSetData}
            configName={pathName?.buttonName}
            count={totalCount}
            staticHeader={staticHeader}
            onTitleNavigate={getTitleNavigation()}
            onView={(data: any) => {
              setViewData(data);
              setOpenModal(true);
            }}
            tableControls={(rowData: any) => {
              let lockDEDL = location?.pathname?.includes("global-response-set/internal")
                ? lockFields?.includes(rowData?.name)
                : false;

              return {
                duplicate: !lockDEDL,
                view: true,
                requiredSelectIndication: !lockDEDL,
                archieved: true,
                add: true,
                edit: true,
                delete: !lockDEDL,
              };
            }}
            onAdd={
              pathName?.buttonName === "Status Attributes" ||
              pathName?.buttonName === "Custom Attributes"
                ? (data: any) => {
                    setViewMode("add");
                    setIsAdd({ status: pathName?.buttonName, id: null });
                  }
                : null
            }
            onEdit={
              pathName?.buttonName === "Status Attributes" ||
              pathName?.buttonName === "Custom Attributes"
                ? (data: any) => {
                    console.log(data);
                    setViewMode("edit");
                    setIsAdd({ status: pathName?.buttonName, id: data });
                  }
                : null
            }
            urlUtils={urlUtils}
            keyName={pathName?.backendUrl}
            backendUrl={pathName?.backendUrl}
            tableIndicator={pathName}
            tableOptions={{
              chipOptionsName: ["status"],
            }}
            navigateTitle={
              pathName?.buttonName !== "Status Attributes" &&
              pathName?.buttonName !== "Custom Attributes"
                ? { column: "name", navigate: true, navigateMode: "view" }
                : { column: "", navigate: false }
            }
            permissions={permissions}
            permission={permissionList.CustomAttributes}
            csvDownload={false}
            // allowFilter={{
            //   filter: true,
            //   className: 'filter__field',
            //   filteredOptionLength: presentFilter,
            // }}
            maxCharacters="none"
            // FilterComponent={({ filterModal, setFilterModal }: any) => {
            //   return (
            //     <CommonFilter
            //       setFilterUrl={setUrlUtils}
            //       filterModal={filterModal}
            //       INITIAL_VALUES={converToProperFormikFormat({
            //         data: getFilterValue,
            //         getFilterValue,
            //       })}
            //       setFilterModal={setFilterModal}
            //       setPresentFilter={setPresentFilter}
            //       filterObj={{ getFilterValue, setFilterValue }}></CommonFilter>
            //   );
            // }}
            // filterChildren={
            //   <FilteredValue
            //     getFilterValue={getFilterValue}
            //     setFilterValue={setFilterValue}
            //     onDataTableChange={onDataTableChange}
            //   />
            // }
          ></BASDataTableUpdate>
        </Box>
      </GlobalResponseSetLayout>
    </OrganizationConfiguration>
  );
}
