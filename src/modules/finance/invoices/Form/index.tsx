import React, { useEffect } from "react";
import { Box } from "@mui/system";
import FullPageLoader from "src/components/FullPageLoader";
import { useLocation, useNavigate } from "react-router";
import { searchParamObject } from "containers/utils/index";
import { useSnackbar } from "notistack";
import { Button, CircularProgress, DialogContent, TextField, Typography } from "@mui/material";
import CustomBadgeCreator from "src/components/CustomBadgeCreator/index";
import ReceiptIcon from "@mui/icons-material/Receipt";

// import fakeData from "../fakedata";
import "containers/finance/finance.scss";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { allRoutes } from "src/routers/routingsUrl";
import { deleteAPI, getAPI, postAPI } from "src/lib/axios";
import {
  fetchIndividualApi,
  fetchTableData,
  setErrorNotification,
} from "src/modules/apiRequest/apiRequest";
import { fetchData } from "containers/finance/functionality";
import BASDataTableButton from "containers/table/BASDataTableButton";
import { formatedDate } from "containers/utils/index";
import BASDataTable from "src/modules/table/BASDataTable";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import CommonFilter, {
  converToProperFormikFormat,
  FilteredValue,
} from "src/modules/config/Filters/CommonFilter";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import { FINANCE_INITIAL_VALUE } from "src/modules/config/filterOptionsList";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import SaveIcon from "src/assets/icons/save_icon.svg";
import { usePayloadHook } from "constants/customHook/payloadOptions";
import { invoiceStatusOptions } from "src/utils/url";
import useInvoiceStore from "store/invoice";

interface NavigateColumnProps {
  navigateColumnName: string;
  navigateTo: Function | null;
}

export default function InvoiceForm() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const searchParams = new URLSearchParams(location.search);
  const searchObject = searchParamObject(searchParams);
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [presentFilter, setPresentFilter] = React.useState(false);
  const [openCancellationModal, setOpenCancellationModal] = React.useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = React.useState("");
  const [onNavigate, setOnNavigate] = React.useState<NavigateColumnProps>({
    navigateColumnName: "contract_no",
    navigateTo: (id: any) => {
      // Replace the current URL with the updated query parameters
      navigate(`/finance/invoices?invoice=${id}`);
    },
  });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(FINANCE_INITIAL_VALUE);
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
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    sectionTitle: "",
    buttonName: "",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: "id",
    subSectionUrl: null,
    searchName: "",
  });
  const [urlUtils, setUrlUtils] = usePayloadHook();
  const [cancellationReason, setCancellationReason] = React.useState("");

  const { permissions } = usePermissionStore();

  const { changeInvoiceStatus, getAnalytics, analytics }: any = useInvoiceStore();

  //  function to get data
  const getData = async () => {
    let params = location.pathname.split("/").slice(-1).join("");
    // for api end point
    let returnedParams = "";
    let path = "";
    let search_path = "";

    switch (params) {
      case "invoices":
        returnedParams = allRoutes?.SidebarFinanaceAllInvoices?.backendUrl;
        path = "All Invoices";
        search_path = "invoice no. and customer name";
        break;
      case "to-be-invoiced":
        returnedParams = "booking_templates-data";
        path = "To Be Approved";
        search_path = "invoice no. and customer name";
        break;
      default:
        returnedParams = "";
        path = "";
    }
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: returnedParams,
      buttonName: path,
      deleteFieldName: "id",
      searchName: search_path,
    }));
    setLoading(true);
    await fetchTableData({
      setData: setFinanceData,
      api: returnedParams,
      setTotalCount,
      enqueueSnackbar,
      urlUtils,
      query: {
        type: "pending_approval",
      },
    });
    setLoading(false);
    // try {
    //   setLoading(true);
    //   const { status, data } = await getAPI(`${returnedParams}/?page=1&size=25`);
    //   if (status === 200) {
    //     setLoading(false);
    //     const itemss = data.items || [];
    //     let newItems: any = [];
    //     if (itemss?.length > 0) {
    //       newItems = itemss;
    //     }

    //     //setting common page data
    //     setFinanceData((prev: any) => {
    //       return {
    //         ...prev,
    //         items: newItems || [],
    //         headers: data.headers,
    //         page: data.page,
    //         pages: data.pages,
    //         size: data.size,
    //         total: data.total,
    //         // archivedCount: data?.info?.archived_count,
    //       };
    //     });

    //     setTotalCount(data.total);
    //   }
    // } catch (error: any) {
    //   setLoading(false);
    //   setErrorNotification(error, enqueueSnackbar);
    // }
  };

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setFilterValue(FINANCE_INITIAL_VALUE);
      setPresentFilter(false);
    }
  };

  useEffect(() => {
    if (searchObject?.[`invoice`]) {
      fetchData({
        id: Number(searchObject?.["invoice"]),
        setLoading,
        fetchIndividualApi,
        setTotalCount,
        setPathName,
        enqueueSnackbar,
        setData: setFinanceData,
        location,
        domain: "Record",
        buttonName: "Record",
        url: "finance-invoice/invoices",
      });
      setOnNavigate((prev) => ({
        navigateColumnName: "",
        navigateTo: null,
      }));
    } else {
      getData();
      setPathName((prev) => ({
        ...prev,
        frontEndUrl: `${location?.pathname}/add`,
      }));
      setOnNavigate({
        navigateColumnName: "contract_no",
        navigateTo: (id: any) => {
          navigate(`/finance/invoices?invoice=${id}`);
        },
      });
    }
  }, [Object.keys(searchObject || {})?.length, urlUtils]);

  const generateInvoiceHandler = async (selectedInvoices: any) => {
    let encodeURI = [...selectedInvoices]
      ?.map((invoice: any) => `booking_ids=${invoice?.id}`)
      .join("&");

    try {
      setLoading(true);
      const { status, data } = await getAPI(`invoice/generate/?${encodeURI}`);
      if (status === 200) {
        setLoading(false);
        // navigate(`/finance/invoice/generate-invoice/${data?.data?.invoice_id}`);
        // TODO
        document.location.href = `/finance/invoice/generate-invoice/${data?.data?.invoice_id}`;
      }
    } catch (error: any) {
      setLoading(false);
      enqueueSnackbar(error.response.data.detail.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };

  const generateInvoiceHandlerOpen = async (selectedInvoices: any) => {
    let encodeURI = [...selectedInvoices]
      ?.map((invoice: any) => `booking_ids=${invoice?.id}`)
      .join("&");
    // TODO
    // navigate(`/finance/invoice/generate-invoice/${selectedInvoices[0]?.id}`);
    document.location.href = `/finance/invoice/generate-invoice/${selectedInvoices[0]?.id}`;

    // try {
    //   setLoading(true);
    //   const { status, data } = await getAPI(`invoice/${selectedInvoices[0]?.id}`);
    //   if (status === 200) {
    //     setLoading(false);
    //     navigate(`/finance/invoice/generate-invoice/${selectedInvoices[0]?.id}`);
    //   }
    // } catch (error: any) {
    //   setLoading(false);
    //   enqueueSnackbar(error.response.data.detail.message || 'Something went wrong!', {
    //     variant: 'error',
    //   });
    // }
  };

  const pathname = window.location.pathname.split("/").slice(-1).join("");

  const handleCancelInvoice = async () => {
    let payload = {
      invoice_id: selectedInvoiceId,
      cancellation_reason: cancellationReason,
    };

    try {
      setLoading(true);
      await postAPI(`/invoice/cancel/`, payload).then((res) => {
        enqueueSnackbar(res?.data?.message, {
          variant: "success",
        });
        getData();
        setLoading(false);
        setOpenCancellationModal(false);
      });
    } catch (error: any) {
      setLoading(false);
      enqueueSnackbar(error.response.data.detail.message || "Something went wrong!", {
        variant: "error",
      });
      setOpenCancellationModal(false);
    }
  };

  const tableOptions = location.pathname.includes("/invoice/invoices")
    ? {
        chipOptionsName: ["status"],
        status: (rowData: any) => {
          return {
            containerClassName: "",
            select: rowData?.status?.toLowerCase() === "sent" ? true : false,
            multiple: false,
            api: {
              api: "activity/change-status",
              columnId: "id",
            },
            backendAction: async (data: any) => {
              setLoading(true);
              const response = await changeInvoiceStatus({
                id: rowData?.id,
                values: { is_paid: true },
                enqueueSnackbar,
              });
              if (!response) {
                setFinanceData((prev: any) => {
                  return {
                    ...prev,
                    items: prev?.items?.map((it: any) =>
                      it?.id === rowData?.id ? { ...it, status: "Sent" } : it,
                    ),
                  };
                });
              }
              getAnalytics({});
              setLoading(false);
            },
            options: invoiceStatusOptions || [],
            displayKeyName: "name",
            setKeyName: "id",
            field: "status",
          };
        },
      }
    : { chipOptionsName: ["status"] };

  return (
    <Box sx={{ p: "20px" }} className="config-holder">
      <ConfirmationModal
        openModal={openCancellationModal}
        setOpenModal={setOpenCancellationModal}
        confirmationIcon={SaveIcon}
        handelConfirmation={handleCancelInvoice}
        confirmationHeading={"Are you sure you want to cancel?"}
        status={"Normal"}
        IsSingleBtn={false}
        children={
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Cancellation Reason"
              onChange={(e) => setCancellationReason(e.target.value)}
              variant="filled"
            />
          </Box>
        }
      />

      {loading && <FullPageLoader />}
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
                startIcon={<img src="/assets/icons/back.svg" alt="back button" />}
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
      {/* <BASDataTableButton
        data={financeData}
        deletePath={deleteEndpoint}
        onDataChange={onDataTableChange}
        configName={pathName?.buttonName}
        searchName={pathName?.searchName}
        backendUrl={pathName?.backendUrl}
        count={totalCount}
        setterFunction={setFinanceData}
        textTitleLength={50}
        onTitleNavigate={onNavigate}
        tableIndicator={pathName}
        csvDownload={false}
        tableHeaderContainer={{
          buttonLabel: 'Generate Invoice',
          isButtonDisplayed: true,

          headerButtonHandler: (e: any) => {
          },
        }}
      /> */}

      <BASDataTableUpdate
        data={financeData}
        deletePath={deleteEndpoint}
        onDataChange={onDataTableChange}
        setterFunction={setFinanceData}
        configName={pathName?.buttonName}
        count={totalCount}
        tableIndicator={pathName}
        urlUtils={urlUtils}
        csvDownload={false}
        viewIcon={true}
        backendUrl={pathName?.backendUrl}
        tableOptions={tableOptions}
        isAddModal={false}
        replaceHeaderBtn={(datas: any) => {
          const id = datas?.map((data: any) => data?.id);
          return (
            <>
              {" "}
              {pathname === "to-be-invoiced" ? (
                <Button
                  disabled={id?.length === 0}
                  variant="contained"
                  className="btn__add"
                  onClick={() => generateInvoiceHandler(datas)}
                >
                  Generate Invoice
                </Button>
              ) : (
                ""
              )}
            </>
          );
        }}
        permissions={permissions}
        onTitleNavigate={onNavigate}
        permission={{
          add: "add_Invoice",
          view: "view_AInvoice",
          delete: "delete_AInvoice",
          edit: "edit_AInvoice",
          export: "export_AInvoice",
        }}
        actionViewMode={{
          type: "dot",
          dotModeOptions: (val: any) => {
            return pathname === "to-be-invoiced"
              ? [
                  {
                    Icon: <img src="/assets/icons/manage_access.svg" alt="report" />,
                    label: "Generate Invoice",
                    handleButtonClick: ({ id }: any) => {
                      generateInvoiceHandler([
                        {
                          id,
                        },
                      ]);
                      // navigate(`/finance/invoice/generate-invoice/${val.id}`);
                    },
                  },
                ]
              : val?.status === "Paid" || val?.status === "Sent"
              ? [
                  {
                    Icon: <img src="/assets/icons/manage_access.svg" alt="report" />,
                    label: "View Invoice",
                    handleButtonClick: ({ invoice_file }: any) => {
                      // generateInvoiceHandlerOpen([
                      //   {
                      //     id,
                      //   },
                      // ]);
                      // navigate(`/finance/invoice/generate-invoice/${val.id}`);
                      // navigate(`/public-invoice/${invoice_file}`);
                      // TODO
                      document.location.href = `/public-invoice/${invoice_file}`;
                    },
                  },
                ]
              : val?.is_draft
              ? [
                  // {
                  //   Icon: <img src="/assets/icons/manage_access.svg" alt="report" />,
                  //   label: 'Generate Report',
                  //   handleButtonClick: ({ id }: any) => {
                  //     navigate(`report/${id}`);
                  //   },
                  // },
                  {
                    Icon: <img src="/assets/icons/manage_access.svg" alt="report" />,
                    label: "Open Invoice",
                    handleButtonClick: ({
                      id,
                      is_draft,
                      is_cancelled,
                      invoice_sent,
                      ...data
                    }: any) => {
                      generateInvoiceHandlerOpen([
                        {
                          id,
                        },
                      ]);
                      setSelectedInvoiceId(id);
                      // setOpenCancellationModal(true);
                      // handleCancelInvoice(id);

                      // if (!is_cancelled && !invoice_sent) {
                      //   // alert('Invoice already draft');
                      // } else if (is_cancelled) {
                      //   enqueueSnackbar('Invoice already cancelled', {
                      //     variant: 'error',
                      //   });
                      // } else if (invoice_sent) {
                      //   enqueueSnackbar('Invoice already sent', {
                      //     variant: 'error',
                      //   });
                      // }
                    },
                    permission: [permissionList.Invoice.delete],
                  },
                ]
              : val?.is_cancelled
              ? [
                  {
                    Icon: (
                      <NotInterestedIcon
                        sx={{
                          fontSize: "21px",
                        }}
                      />
                    ),
                    label: "Generate Invoice",
                    handleButtonClick: ({
                      id,
                      is_draft,
                      is_cancelled,
                      invoice_sent,
                      ...data
                    }: any) => {
                      setSelectedInvoiceId(id);
                      // setOpenCancellationModal(true);
                      // handleCancelInvoice(id);

                      if (!is_cancelled && !invoice_sent) {
                        // alert('Invoice already draft');
                      } else if (is_cancelled) {
                        enqueueSnackbar("Invoice already cancelled", {
                          variant: "error",
                        });
                      } else if (invoice_sent) {
                        enqueueSnackbar("Invoice already sent", {
                          variant: "error",
                        });
                      }
                    },
                    permission: [permissionList.Invoice.delete],
                  },
                ]
              : val?.invoice_sent
              ? []
              : val?.status === "Hold"
              ? [
                  {
                    Icon: <img src="/assets/icons/manage_access.svg" alt="report" />,
                    label: "View Invoice",
                    handleButtonClick: ({ id }: any) => {
                      generateInvoiceHandlerOpen([
                        {
                          id,
                        },
                      ]);
                      // navigate(`/finance/invoice/generate-invoice/${val.id}`);
                    },
                  },
                  {
                    Icon: (
                      <NotInterestedIcon
                        sx={{
                          fontSize: "21px",
                        }}
                      />
                    ),
                    label: "Cancel Invoice",
                    handleButtonClick: ({
                      id,
                      is_draft,
                      is_cancelled,
                      invoice_sent,
                      ...data
                    }: any) => {
                      setSelectedInvoiceId(id);
                      setOpenCancellationModal(true);
                      // handleCancelInvoice(id);

                      if (!is_cancelled && !invoice_sent) {
                        // alert('Invoice already draft');
                      } else if (is_cancelled) {
                        enqueueSnackbar("Invoice already cancelled", {
                          variant: "error",
                        });
                      } else if (invoice_sent) {
                        enqueueSnackbar("Invoice already sent", {
                          variant: "error",
                        });
                      }
                    },
                    permission: [permissionList.Invoice.delete],
                  },
                ]
              : [];
          },
        }}
        // navigateTitle={{
        //   navigateMode: 'view',
        //   column: 'booking_id',
        //   navigate: false,
        //   handleCustomNavigate: ({ id }: any) => navigate(`/bookings/all-bookings/view/${id}`),
        // }}
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
  );
}
