import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import CustomBreadCrumbItem from "src/components/CustomBreadCrum";
import FullPageloader from "src/components/FullPageLoader";
import { permissionList } from "src/constants/permission";
import { fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import BASDataTable from "src/modules/table/BASDataTable";
import { useContractorServicesStore } from "globalStates/config";
import { BASConfigTableProps } from "interfaces/configs";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";
import { getAPI } from "src/lib/axios";
import { usePermissionStore } from "src/store/zustand/permission";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "../generalSettings/OrganizationConfiguration";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import { FINDING_AND_RECOMMENDATION_FILTER_INITIAL_VALUE } from "src/modules/config/filterOptionsList/index";
import CommonFilter, {
  FilteredValue,
  converToProperFormikFormat,
} from "src/modules/config/Filters/CommonFilter";
import CustomPopUp from "src/components/CustomPopup/index";
import { usePayloadHook, defaultPayloadValue } from "constants/customHook/payloadOptions";
import { getTableData } from "./findingsAndRecommendationsForm/subComponents/findingAndRecommendationAPi";
import SubTabs from "./findingsAndRecommendationsForm/subComponents/SubTabs";
import useAppStore from "src/store/zustand/app";

interface NavigateColumnProps {
  navigateColumnName: string;
  navigateTo: Function;
}

let generalLink = {
  commonLink: "findings-recommendations",
};

// =============== Contractor and services common component ==============
export default function FindingsAndRecommendations() {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    sectionTitle: "",
    buttonName: "",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: "",
    subSectionUrl: null,
    popUpField: { key: "", label: "" },
    showAddButton: true,
  });
  const { systemParameters }: any = useAppStore();
  // used for navigating or changing route
  const [onNavigate, setOnNavigate] = React.useState<NavigateColumnProps>({
    navigateColumnName: "name",
    navigateTo: (id: any) => {
      // Replace the current URL with the updated query parameters
      navigate(`/config/findings-recommendations?category=${id}`);
    },
  });

  const [crumbData, setCrumbData] = React.useState<any>([]);
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState([]);
  const [staticHeader, setStaticHeader] = React.useState<any>({});

  const { enqueueSnackbar } = useSnackbar();
  // Get the current location object
  const location = useLocation();
  const navigate = useNavigate();

  // Get the value of the nextPage parameter
  const searchParams = new URLSearchParams(location.search);
  const searchObject = Object.fromEntries(searchParams.entries());
  const category = searchParams.get("category");
  const findings = searchParams.get("findings");
  const pCategory = searchParams.get("p_category");

  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});

  const [findingAndRecommendation, setFindingAndRecommendation] =
    React.useState<BASConfigTableProps>({
      items: [],
      headers: [],
      page: 1,
      pages: 1,
      size: 1,
      total: 0,
      archivedCount: 0,
    });
  const { services, setServices } = useContractorServicesStore();

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const getData = async () => {
    let params = location.pathname.split("/").slice(-1).join("");
    // for api end point
    let returnedParams = "";
    let path = "";

    switch (params) {
      case "findings-recommendations":
        returnedParams = "finding-category";
        path = "Findings & Recommendations";
        break;

      default:
        returnedParams = "";
        path = "";
    }

    setPathName((prev: any) => ({
      ...prev,
      backendUrl: returnedParams,
      buttonName: "New Category",
      sectionTitle: "All Findings & Recommendations",
      // subSectionUrl: `${location?.pathname}/add?category=${id}`,
      subSectionUrl: (id: number) => {
        return `${location?.pathname}/add?category=${id}`;
      },
      frontEndUrl: `${location?.pathname}/add`,
      deleteFieldName: "id",
      popUpField: { key: "findings", label: "All Findings" },
      editFrontEndUrlGetter: (id: number) => {
        return `${location?.pathname}/edit/${id}`;
      },
    }));
    setLoading(true);
    await fetchTableData({
      setData: setFindingAndRecommendation,
      api: "main-category",
      setTotalCount,
      // enqueueSnackbar,
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
      setFilterValue([]);
    }
  };

  const { permissions } = usePermissionStore();

  const fetchData = async ({ id, url, domain, customURL }: any) => {
    setLoading?.(true);
    const apiResponse = await fetchIndividualApi({
      id,
      url,
      // enqueueSnackbar,
      customApiUrl: customURL,
      domain,
      setterFunction: (data: any) => {
        if (!url.includes("main-category")) {
          setPathName((prev: any) => ({
            ...prev,
            backendUrl:
              domain === "Sub Category"
                ? "finding-category"
                : `finding-category/${
                    domain?.toLowerCase() === "finding" ? "finding" : "recommendation"
                  }`,
            buttonName:
              data?.info?.title?.toLowerCase() === "recommendations"
                ? "New Recommendation"
                : data?.info?.title?.toLowerCase() === "category"
                ? "New Sub Category"
                : "New Finding",
            sectionTitle: data?.info?.finding || data?.info?.parent || data?.info?.p_category,
            frontEndUrl: `${location?.pathname}/add${location?.search}&_type=2`,
            subSectionUrl: (id: any) => {
              return `${
                data?.info?.title?.toLowerCase() === "recommendations"
                  ? `${location?.pathname}/add?category=${id}&_type=2`
                  : `${location?.pathname}/add?findings=${id}&_type=2`
              }`;
            },
            popUpField:
              domain?.toLowerCase() === "finding"
                ? { key: "recommendations", label: "All Recommendations" }
                : { key: "", label: "" },
            editFrontEndUrlGetter: (id: number) =>
              `${location?.pathname}/edit/${id}${location?.search}`,
            deleteFieldName:
              domain?.toLowerCase() === "finding" || domain?.toLowerCase() === "recommendation"
                ? { value: "id", key: "description" }
                : { value: "id", key: "name" },
          }));
        } else {
          setPathName((prev: any) => ({
            ...prev,
            backendUrl: "main-category/finding",
            buttonName: "New Finding",
            sectionTitle: data?.info?.finding || data?.info?.parent || data?.info?.p_category,
            frontEndUrl: `${location?.pathname}/add${location?.search}&_type=2`,
            // subSectionUrl: (id: any) => {
            //   return '/iii';
            // },
            editFrontEndUrlGetter: (id: number) =>
              `${location?.pathname}/edit/${id}${location?.search}`,
            popUpField: { key: "recommendations", label: "All Recommendations" },
          }));
        }
        let datasss: any = [];
        let value = data?.info?.main_cat
          ? "category_recommendations"
          : data?.info?.p_category
          ? "main_category"
          : searchObject?.type === "findings" &&
            data?.info?.title?.toString().toLowerCase() === "findings"
          ? "main_category"
          : data?.info?.title?.toString().toLowerCase();
        let rootpath = "/config/findings-recommendations";
        switch (value) {
          case "main_cat".toString().toLowerCase():
            datasss = [{ label: "Category", path: "" }];
            break;
          case "findings".toString().toLowerCase():
            datasss = [
              { label: "Home", path: rootpath },
              {
                label: "Findings",
                path: `/config/findings-recommendations?category=${data?.info.category}`,
              },
            ];
            break;
          case "recommendations".toString().toLowerCase():
            datasss = [
              { label: "Home", path: rootpath },
              {
                label:
                  data?.info?.sub_cat && data?.info?.sub_cat?.main_category
                    ? data?.info?.sub_cat?.main_category?.name
                    : "Findings",
                path: `${rootpath}?category=${data?.info.category}`,
              },
              {
                label: data?.info?.sub_cat ? data?.info?.sub_cat?.name : "",
                path: `${rootpath}?category=${data?.info.category}`,
              },
            ];
            break;

          case "category_recommendations":
            datasss = [
              { label: "Home", path: rootpath },
              {
                label: data?.info?.main_cat?.name,
                path: `${rootpath}?p_category=${data?.info?.main_cat?.id}${
                  searchObject?.p_category && searchObject?.findings ? "&type=findings" : ""
                }`,
              },
            ];
            break;
          case "main_category":
            datasss = [{ label: "Home", path: rootpath }];
            break;
          default:
            datasss = [];
            break;
        }
        setCrumbData(datasss);
        setFindingAndRecommendation({
          ...data,
          archivedCount: data?.info?.archived_count,
        });
        setTotalCount(data.total);
      },
      queryParam: urlUtils,
    });
    if (!apiResponse && searchObject?.type === "findings") {
      setPathName((prev: any) => ({
        ...prev,
        backendUrl: "main-category/finding",
        buttonName: "New Finding",
        sectionTitle: "",
        frontEndUrl: `${location?.pathname}/add${location?.search}&_type=2`,
        subSectionUrl: (id: number) => {
          return `${location?.pathname}/add?findings=${Number(id)}&_type=2`;
        },
        editFrontEndUrlGetter: (id: number) =>
          `${location?.pathname}/edit/${id}${location?.search}`,
        popUpField: { key: "recommendations", label: "All Recommendations" },
      }));
    }
    setLoading?.(false);
  };

  useEffect(() => {
    getTableData({
      searchObject,
      navigate,
      setOnNavigate,
      setStaticHeader,
      setPathName,
      fetchData,
      setCrumbData,
      getData,
      location,
      setUrlUtils,
      systemParameters,
    });
  }, [
    Object.keys(searchObject || {})?.length,
    searchObject?.["type"],
    pCategory,
    category,
    findings,
    urlUtils,
    systemParameters,
  ]);

  return (
    <>
      <OrganizationConfiguration>
        <CustomBreadCrumbItem items={crumbData} />
        <Box sx={{ p: "20px" }} className="config-holder">
          {loading && <FullPageloader />}
          <CustomPopUp
            openModal={openModal}
            title={viewData?.name || ""}
            setOpenModal={() => {
              setOpenModal(false);
            }}
            headers={findingAndRecommendation?.headers || staticHeader}
            viewData={viewData}
            field={{ label: "description" }}
            chipOptions={["status"]}
          >
            {/* {JSON.stringify(viewData)} */}
          </CustomPopUp>
          {searchObject?.["p_category"] &&
            (Object.keys(searchObject)?.length === 1 || searchObject?.type === "findings") && (
              <SubTabs
                navigate={navigate}
                location={location}
                searchObject={searchObject}
                searchParams={searchParams}
              />
            )}

          <BASDataTable
            data={findingAndRecommendation}
            deletePath={deleteEndpoint}
            onDataChange={onDataTableChange}
            onView={(data: any) => {
              setViewData(data);
              setOpenModal(true);
            }}
            urlUtils={urlUtils}
            tableIndicator={pathName}
            configName={pathName?.buttonName}
            backendUrl={pathName?.backendUrl}
            tableTitle={pathName?.sectionTitle || ""}
            count={totalCount}
            setterFunction={setFindingAndRecommendation}
            popUpDisplay={true}
            onTitleNavigate={onNavigate}
            staticHeader={staticHeader}
            textTitleLength={50}
            tableOptions={{
              chipOptionsName: ["risk_factor", "status"],
              status: {
                show: false,
                api: "",
                options: [],
              },
            }}
            permissions={permissions}
            permission={permissionList.FindingsCategory}
          />
        </Box>
      </OrganizationConfiguration>
    </>
  );
}
