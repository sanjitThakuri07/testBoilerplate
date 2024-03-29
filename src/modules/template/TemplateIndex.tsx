import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { Box } from "@mui/system";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { getAPI } from "src/lib/axios";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { fetchIndividualApi, setErrorNotification } from "src/modules/apiRequest/apiRequest";
import { searchParamObject } from "src/modules/utils/index";
import { fetchData } from "../finance/functionality";
import FullPageLoader from "src/components/FullPageLoader";
import "../finance/finance.scss";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import BASDataTable from "src/modules/table/BASDataTable";
import ScheduleIcon from "src/assets/icons/schedule_Icon.svg";
import AddModal from "src/components/AddModal/AddModalTest";
import AssignInspectionName from "./assignInspectionName/Form";
import { useAssignInspectionStore } from "src/store/zustand/inspection/assignInspection";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import QRCode from "react-qr-code";
import ModalLayout from "src/components/ModalLayout";
import { Button, Stack } from "@mui/material";
import QRIcon from "src/assets/icons/qrIcon.svg";
import { parseQueryParams } from "src/utils/queryParams";
import CommonFilter, {
  converToProperFormikFormat,
  FilteredValue,
} from "src/modules/config/Filters/CommonFilter";
import { FORM_INITIAL_VALUE } from "src/modules/config/filterOptionsList";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import { useTemplateStore } from "src/store/zustand/templates/templateStore";

interface NavigateColumnProps {
  navigateColumnName: string;
  navigateTo: Function | null;
}

// =============== Contractor and services common component ==============
export default function TemplateIndex() {
  const { permissions } = usePermissionStore();
  const { postAssignInspection, isLoading } = useAssignInspectionStore();

  const [selected, setSelected] = React.useState<any>(undefined);
  const [showModal, setShowModal] = React.useState<any>(undefined);

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const handleModalShow = (mode: any) => setShowModal(mode);
  const handleModalClose = () => setShowModal(undefined);

  const location = useLocation();
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
    buttonName: "Form",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: "name",
    subSectionUrl: null,
  });
  const [presentFilter, setPresentFilter] = React.useState(false);

  const [qrData, setQrData] = React.useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchObject = searchParamObject(searchParams);

  const [urlUtils, setUrlUtils] = usePayloadHook();
  const [getFilterValue, setFilterValue] = React.useState(FORM_INITIAL_VALUE);

  const {
    getTemplates,
    tableDatas,
    tableActionHandler,
    isLoading: templateLoading,
  }: any = useTemplateStore();

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
      backendUrl: returnedParams,
      buttonName: "Form",
      deleteFieldName: "contract_no",
      tableTitle: "All Forms",
    }));
    getTemplates({ query: urlUtils, getAll: true });
  };

  // for fetching multiple api according to search params

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setFilterValue(FORM_INITIAL_VALUE);
      setPresentFilter(false);
    }
  };

  useEffect(() => {
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
  }, [Object.keys(searchObject || {})?.length, urlUtils]);

  const handleCopyQrLink = () => {
    navigator.clipboard.writeText(qrData);
    enqueueSnackbar("Copied to clipboard", { variant: "success" });
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById("qr-code") as HTMLCanvasElement;

    if (svg !== null) {
      const svgData = new XMLSerializer().serializeToString(svg); // Convert the SVG element to a string
      const blob = new Blob([svgData], { type: "image/svg+xml" }); // Create a Blob object with the SVG data

      const url = URL.createObjectURL(blob); // Create a URL for the Blob object
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.svg"; // Set the filename for the downloaded image
      link.click(); // Simulate a click on the link to trigger the download

      URL.revokeObjectURL(url); // Release the object URL when no longer needed
    }
  };

  const tableUpdateDatas: any = {
    template: {
      data: tableDatas,
      setterFn: async ({ datas, type }: any) => {
        console.log("data");
        await tableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
  };
  return (
    <Box sx={{ p: "20px" }} className="config-holder">
      {templateLoading && <FullPageLoader />}
      {selected && (
        <AddModal
          confirmationHeading={`Assign inspection name to the template. ( ${selected?.name})`}
          openModal={showModal === "assign_inspection"}
          setOpenModal={() => handleModalClose()}
        >
          <AssignInspectionName
            selected={selected}
            isLoading={isLoading}
            onCreate={async ({ values }: any) => {
              if (await postAssignInspection({ query: values, enqueueSnackbar })) {
                handleModalClose();
                getData();
              }
            }}
          />
        </AddModal>
      )}

      <BASDataTable
        data={tableUpdateDatas?.template?.data}
        onDataChange={onDataTableChange}
        // count={totalCount}
        setterFunction={tableUpdateDatas?.template?.setterFn}
        textTitleLength={50}
        onTitleNavigate={onNavigate}
        tableIndicator={pathName}
        urlUtils={urlUtils}
        permissions={permissions}
        permission={permissionList.Form}
        navigateTitle={{ column: "name", navigate: true }}
        csvDownload={false}
        duplicate={true}
        actionViewMode={{
          type: "dot",
          // dotModeOptions: [
          //   {
          //     Icon: <img src="/src/assets/icons/manage_access.svg" alt="report" />,
          //     label: "Create Layout",
          //     handleButtonClick: ({ id }: any) => {
          //       navigate(`layout/${id}`);
          //     },
          //     permission: [permissionList.Form.add],
          //   },
          //   {
          //     Icon: <img src="/src/assets/icons/manage_access.svg" alt="report" />,
          //     label: "Manage Access",
          //     handleButtonClick: ({ id }: any) => {
          //       navigate(`access-control/${id}`);
          //     },
          //     permission: [permissionList.Form.edit],
          //   },
          //   {
          //     Icon: <img src={ScheduleIcon} alt="schedule-inspection" />,
          //     label: "Schedule Inspection",
          //     handleButtonClick: ({ id }: any) => {
          //       navigate(`schedule-inspection/${id}`);
          //     },
          //     permission: [permissionList.Form.edit],
          //   },
          //   {
          //     Icon: <img src="/src/assets/icons/manage_access.svg" alt="report" />,
          //     label: "Assign Inspection",
          //     handleButtonClick: (row: any) => {
          //       // navigate(`layout/${id}`);
          //       handleModalShow("assign_inspection");
          //       setSelected(row);
          //     },
          //     permission: [permissionList.Form.add],
          //   },
          //   {
          //     Icon: (
          //       <ManageHistoryIcon style={{ width: "22px", height: "22px", color: "#667084" }} />
          //     ),
          //     label: "Manage Schedule",
          //     handleButtonClick: ({ id }: any) => {
          //       navigate(`/schedule/${id}`);
          //     },
          //     permission: [permissionList.Form.edit],
          //   },
          //   {
          //     Icon: <img src={QRIcon} alt="report" />,
          //     label: "Generate QR Code",
          //     handleButtonClick: ({ id }: any) => {
          //       setOpenModal(true);
          //       setQrData(`${process.env.VITE_URL}/template/inspection/${id}`);
          //     },
          //     permission: [permissionList.Form.view],
          //   },
          // ],
          dotModeOptions: [],
        }}
        onEdit={(data: any) => {
          navigate(`/template/edit/${data?.id}`);
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
        // defaultDisable={['photo', 'created_at', 'created_by', 'updated_at', 'updated_by', 'fields']}
      />

      <ModalLayout
        id="Inspection_QR_code"
        children={
          <>
            <div className="config_modal_form_css user__department-field">
              <div className="config_modal_heading">
                <div className="config_modal_title">Start Inspection from QR Code</div>
                <div className="config_modal_text">
                  <div>
                    Users with access to this template can start inspections via the mobile app by
                    scanning this QR code.
                  </div>
                </div>
              </div>
              {/* <Divider variant="middle" /> */}
              <div
                id="qr-code"
                style={{ height: "auto", margin: "0 auto", maxWidth: 300, width: "100%" }}
              >
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={qrData}
                  viewBox={`0 0 256 256`}
                />
              </div>

              <Stack
                spacing={2}
                direction="row"
                justifyContent={"space-between"}
                style={{
                  padding: "20px 30px",
                }}
              >
                <Button variant="outlined" fullWidth onClick={handleCopyQrLink}>
                  Copy link
                </Button>
                <Button variant="contained" fullWidth onClick={handleDownloadQr}>
                  Download QR code
                </Button>
              </Stack>
            </div>
          </>
        }
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Box>
  );
}
