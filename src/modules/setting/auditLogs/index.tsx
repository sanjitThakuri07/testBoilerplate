import {
  Avatar,
  Box,
  Button,
  Grid,
  Pagination,
  PaginationItem,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { getAPI } from "src/lib/axios";
import CustomTable from "src/components/table/CustomTable";
import React, { useEffect, useState } from "react";
import CustomizedTable from "./CustomizedTable";
import DatePicker from "./DatePicker";
import LocationFilters from "./LocationFilters";
import BASDataTable from "src/modules/table/BASDataTable";
import { usePermissionStore } from "src/store/zustand/permission";
import { fetchApI, fetchTableData } from "src/modules/apiRequest/apiRequest";
import { useSnackbar } from "notistack";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import { BOOKING_FILTER_INITIAL_VALUE } from "src/modules/config/filterOptionsList";
import { permissionList } from "src/constants/permission";
import CommonFilter, {
  FilteredValue,
  converToProperFormikFormat,
} from "src/modules/config/Filters/CommonFilter";
import { useLocation, useSearchParams } from "react-router-dom";
import { url } from "src/utils/url";
import FullPageLoader from "src/components/FullPageLoader";
import ModalLayout from "src/components/ModalLayout";
import GeoLocationMap from "src/components/GeoLocationMap/GeoLocationMap";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const AuditLog = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCqNt7sIH2MfrggE7kMnRwaG5J-tCENQ4I",
    libraries: ["places"],
  });
  const location = useLocation();
  const { permissions } = usePermissionStore();
  const { enqueueSnackbar } = useSnackbar();
  const [urlUtils, setUrlUtils] = usePayloadHook();

  const [auditLogsDatas, setAuditLogsDatas] = React.useState({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });

  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    pathUrl: "",
    deleteFieldName: "id",
  });
  const [loading, setLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [presentFilter, setPresentFilter] = React.useState(false);
  const [selectedOption, setSelectedOption] = useState<any>("");
  const [getFilterValue, setFilterValue] = React.useState(BOOKING_FILTER_INITIAL_VALUE);
  const [openModal, setOpenModal] = React.useState(false);
  const [viewData, setViewData] = React.useState<any>({});
  const [datePickerModal, setDatePickerModal] = React.useState(false);

  // map states
  const [mapStates, setMapStates] = useState<any>({
    searchResults: null,
    map: null,
    center: {
      lat: null,
      lng: null,
    },
    address: {
      name: "",
      formatted_address: "",
    },
  });
  // date picker state
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const getData = async () => {
    // let params = location.pathname.split('/').slice(-1).join('');
    const searchParams = new URLSearchParams(location.search);
    const searchObject = Object.fromEntries(searchParams.entries());
    let returnedParams = "";
    let path = "";

    switch (searchObject?.select) {
      case "audit":
        returnedParams = url?.auditLogs;
        path = "Audit Logs ";
        break;
      default:
        returnedParams = "";
        path = "";
    }

    setPathName({
      backendUrl: returnedParams,
      pathUrl: path,
      deleteFieldName: "id",
    });

    setLoading(true);
    setDeleteEndpoint(returnedParams);
    await fetchTableData({
      setData: setAuditLogsDatas,
      api: returnedParams,
      setTotalCount,
      enqueueSnackbar,
      urlUtils,
    });
    setLoading(false);

    // try {
    //   setLoading(true);
    //   const { status, data } = await getAPI(
    //     `${returnedParams}/${parseQueryParams(urlUtils)}`
    //   );
    //   if (status === 200) {
    //     setLoading(false);
    //     //setting common page data
    //     setBookingData((prev) => {
    //       return {
    //         ...prev,
    //         items: data.items || [],
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
    //   enqueueSnackbar(error.response.data.message || "Something went wrong!", {
    //     variant: "error",
    //   });
    // }
  };

  useEffect(() => {
    getData();
  }, [urlUtils, location.pathname, selectedOption]);

  const onDataTableChange = ({ key, value, object }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
      ...object,
    });

    if (key === "filterQuery" && !value) {
      setPresentFilter(false);
      setFilterValue(BOOKING_FILTER_INITIAL_VALUE);
    }
  };

  // when map is clicked
  const handleMapClick = (event: any) => {
    // getting the coordinates whent the marker is set
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMapStates((prev: any) => {
      return {
        ...prev,
        center: {
          lat,
          lng,
        },
      };
    });
    // reversing the coordinates into address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: mapStates?.center?.lat, lng: mapStates?.center?.lng } },
      handleReverseGeocode,
    );
  };

  const handleReverseGeocode = (result: any) => {
    if (result?.[0]) {
      // setAddress(result[0].formatted_address);
      setMapStates((prev: any) => {
        return {
          ...prev,
          address: {
            name: "",
            formatted_address: result[0]?.formatted_address,
          },
        };
      });
    } else {
      // setAddress("No address found");
      console.log("Address Not Found");
    }
  };

  // setting the initial pinpoint of the map when component first render
  useEffect(() => {
    if (viewData) {
      setMapStates((prev: any) => {
        return {
          ...prev,
          center: {
            lat: Number(viewData?.latitude),
            lng: Number(viewData?.longitude),
          },
        };
      });
    }
  }, [viewData]);

  return (
    <>
      <DatePicker
        modelOpen={datePickerModal}
        setModelOpen={setDatePickerModal}
        onHide={() => "datePicker"}
        onDataTableChange={onDataTableChange}
        state={state}
        setState={setState}
      />
      <Box>
        {loading && <FullPageLoader />}
        {!isLoaded && <div>Loading...</div>}
        <ModalLayout
          extralarge
          children={
            <>
              <div className="config_modal_form_css">
                <div className="config_modal_heading">
                  <div className="config_modal_title">Preview location</div>
                  <div className="config_modal_text">
                    <div>
                      The given coordinates {`${viewData?.latitude ?? "N/A"} latitude`} and
                      {` ${viewData?.longitude ?? "N/A"} longitude`} was located on{" "}
                      {viewData?.location ?? "N/A"}.
                    </div>
                  </div>
                </div>

                <Box sx={{ px: 2 }}>
                  <div style={{ marginTop: "10px" }}>
                    <GeoLocationMap
                      handleMapClick={handleMapClick}
                      mapStates={mapStates}
                      setMapStates={setMapStates}
                      mapWidth="100%"
                    />
                  </div>
                </Box>
              </div>
            </>
          }
          openModal={openModal}
          setOpenModal={() => {
            setOpenModal(!openModal);
            setMapStates({
              searchResults: null,
              map: null,
              center: {
                lat: null,
                lng: null,
              },
              address: {
                name: "",
                formatted_address: "",
              },
            });
          }}
        />

        <div className="table__width">
          <BASDataTable
            tableTitle="Activity Logs "
            data={auditLogsDatas}
            deletePath={deleteEndpoint}
            onDataChange={onDataTableChange}
            configName={pathName?.pathUrl}
            backendUrl={pathName?.backendUrl}
            count={totalCount}
            setterFunction={setAuditLogsDatas}
            tableIndicator={pathName}
            keyName={"audit_log"}
            csvDownload={false}
            // isAddModal={true}
            urlUtils={urlUtils}
            // allowFilter={false}
            navigateTitle={{
              navigateMode: "view",
              column: "booking_id",
              navigate: true,
            }}
            onView={(data: any) => {
              setViewData(data);
              setOpenModal(true);
            }}
            // setOpenAddModal={setOpenAddModal}
            // openAddModal={openAddModal}
            allowCustomButtons
            permissions={permissions}
            // tableControls={{
            //   add: false,
            //   edit: false,
            //   delete: false,
            //   duplicate: false,
            //   view: true,
            //   requiredSelectIndication: false,
            //   archieved: false,
            // }}
            tableControls={(rowData: any) => {
              return {
                duplicate: false,
                view: true,
                requiredSelectIndication: false,
                archieved: false,
                add: false,
                edit: false,
                delete: false,
              };
            }}
            showAdd={false}
            permission={permissionList.Bookings}
            tableOptions={{
              chipOptionsName: ["event_description"],
            }}
            allowDateFilter={{
              filter: true,
              dateFilterModal: () => setDatePickerModal(true),
              handleClearDateFilter: () => {
                setState([
                  {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: "selection",
                  },
                ]);
                setUrlUtils({
                  page: 1,
                  size: 25,
                  archived: "",
                  q: "",
                  filterQuery: "",
                });
              },
            }}
          />
        </div>
      </Box>
    </>
  );
};

export default AuditLog;
