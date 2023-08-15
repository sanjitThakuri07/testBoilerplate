import TestTable from "src/modules/finance/invoices/invoiceGenerate/invoiceTable";
import InvoicePreview from "src/modules/finance/invoices/invoiceGenerate/InvoicePreview";
import React from "react";
import InvoiceBillingForm from "src/modules/finance/invoices/invoiceGenerate/InvoiceBillingForm";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams } from "react-router-dom";
import { getAPIPublic } from "src/lib/axios";
import {
  useBillingInvoceData,
  usePublicInvoice,
} from "src/store/zustand/globalStates/invoice/invoice";
import { Backdrop, Button, IconButton, Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PageNotFound from "pages/message/PageNotFound";
import "./PublicInvoicePage.scss";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import ZoomOutMapOutlinedIcon from "@mui/icons-material/ZoomOutMapOutlined";

function GetModifiedData({ data }: any) {
  const flatData = data?.flatMap((item: any) => {
    return item.locations?.flatMap((location: any) => {
      return location?.rate_types.map((rateType: any) => {
        return {
          booking_id: item.booking_id,
          location: location.location,
          inspection: location.inspection,
          rate: rateType.rate,
          rate_type: {
            rate_type: rateType.rate_type,
            remarks: rateType.remarks,
          },
          RATEID: rateType.id,
          LOCATIONID: location.id,
          BOOKINGID: item.booking_id,
          // currency: item.currency,
        };
      });
    });
  });

  const finalData = flatData?.map((item: any, index: any) => {
    if (index === 0) {
      return item;
    } else {
      if (!item) return;
      let { rate, rate_type, booking_id, inspection, location, ...rest } = item;
      const otherObj = { rate, rate_type };
      const prevData = flatData[index - 1];
      const nextData = flatData[index + 1];
      const newObj = Object.assign({}, otherObj, {
        booking_id: prevData?.booking_id === booking_id ? "" : booking_id,
        inspection: prevData?.location === location ? "" : inspection,
        location: prevData?.location === location ? "" : location,
        totalAmmount: Number(prevData?.rate || 0) + Number(rate || 0),
        tax: "10%",
        ...rest,
      });

      return newObj;
    }
  });
  return finalData;
}

const PublicInvoicePage = () => {
  const [getCurrentPreviewData, setCurrentPreviewData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const { invoiceData, setInvoiceData } = useBillingInvoceData();
  const [error, setError] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);

  const { setPublicInvoice, publicInvoice } = usePublicInvoice();

  const { token } = useParams();

  React.useEffect(() => {
    if (token) {
      setLoading(true);

      getAPIPublic(`/api/v1/invoice/public/`, token)
        .then((res) => {
          if (res && res.data) {
            setInvoiceData(res.data);
            setCurrentPreviewData(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    }
  }, [token]);

  console.log(invoiceData, "invoiceData");

  React.useEffect(() => {
    if (invoiceData) {
      if (invoiceData?.booking_data?.[0]?.items?.length) {
        setPublicInvoice(
          GetModifiedData({
            data: invoiceData?.booking_data,
          }),
        );
      } else if (invoiceData?.booking_data?.length) {
        setPublicInvoice(invoiceData?.booking_data);
      }
    }
  }, [invoiceData]);

  function PrintElem(elem: string): boolean {
    const mywindow = window.open("", "PRINT", "height=400,width=600");

    if (mywindow) {
      mywindow.document.write("<html><head><title>" + document.title + "</title>");
      mywindow.document.write("</head><body >");
      mywindow.document.write("<h1>" + document.title + "</h1>");
      const elemContent = document.getElementById(elem)?.innerHTML;
      mywindow.document.write(elemContent || "");
      mywindow.document.write("</body></html>");

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10

      mywindow.print();
      mywindow.close();

      return true;
    }

    return false;
  }

  const handlePrint = () => {
    PrintElem("public_invoice_preview_wrapper");
  };

  const handleZoomIn = () => {
    setZoom((prev) => prev + 0.1);
    const element = document.getElementById("public_invoice_preview_wrapper");
    if (element) {
      element.style.transform = `scale(${zoom})`;
    }
  };

  const handleZoomOut = () => {
    setZoom((prev) => prev - 0.1);
    const element = document.getElementById("public_invoice_preview_wrapper");
    if (element) {
      element.style.transform = `scale(${zoom})`;
    }
  };

  const handleResetZoom = () => {
    setZoom(1);
    const element = document.getElementById("public_invoice_preview_wrapper");
    if (element) {
      element.style.transform = `scale(${zoom})`;
    }
  };

  React.useEffect(() => {
    handleZoomIn();
    handleZoomOut();
  }, [zoom]);

  return (
    <div id="PublicInvoicePage">
      {loading ? (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div>
          {getCurrentPreviewData && (
            <DndProvider backend={HTML5Backend}>
              <div id="public_invoice_preview_wrapper">
                <div className="public_invoice_preview_container">
                  <InvoicePreview previewData={getCurrentPreviewData} />
                </div>
              </div>

              <div className="PublicInvoicePage_floating_btns">
                <div className="PublicInvoicePage_floating_btns_container">
                  <Tooltip title="Print" arrow placement="left">
                    <IconButton
                      onClick={handlePrint}
                      sx={{
                        color: "#fff",
                        backgroundColor: "#384874",
                        "&:hover": {
                          backgroundColor: "#1e3061d1",
                        },
                      }}
                    >
                      <PrintOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Zoom in" arrow placement="left">
                    <IconButton
                      onClick={() => {
                        handleZoomIn();
                      }}
                      sx={{
                        color: "#fff",
                        backgroundColor: "#384874",
                        "&:hover": {
                          backgroundColor: "#384874",
                        },
                      }}
                    >
                      <ZoomInOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Zoom out" arrow placement="left">
                    <IconButton
                      onClick={() => {
                        handleZoomOut();
                      }}
                      sx={{
                        color: "#fff",
                        backgroundColor: "#384874",
                        "&:hover": {
                          backgroundColor: "#384874",
                        },
                      }}
                    >
                      <ZoomOutOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Reset zoom" arrow placement="left">
                    <IconButton
                      onClick={() => {
                        handleResetZoom();
                      }}
                      sx={{
                        color: "#fff",
                        backgroundColor: "#384874",
                        "&:hover": {
                          backgroundColor: "#384874",
                        },
                      }}
                    >
                      <ZoomOutMapOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </DndProvider>
          )}
        </div>
      )}

      {error && <PageNotFound />}
    </div>
  );
};

export default PublicInvoicePage;
