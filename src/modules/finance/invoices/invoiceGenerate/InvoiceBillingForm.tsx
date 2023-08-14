import { Backdrop, Box, Button } from "@mui/material";
import React, { useEffect } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import {
  useAdjustmentData,
  useBillingInvoceData,
  useInvoiceFile,
  useInvoiceTriggred,
} from "globalStates/invoice/invoice";

import InvoicePreview from "./InvoicePreview";
import TestTable from "./invoiceTable";
import { getAPI } from "src/lib/axios";
import { useParams } from "react-router-dom";

// function PrintElem(elem: string): boolean {
//   const mywindow = window.open('', 'PRINT', 'height=400,width=600');

//   if (mywindow) {
//     mywindow.document.write('<html><head><title>' + document.title + '</title>');
//     mywindow.document.write('</head><body >');
//     mywindow.document.write('<h1>' + document.title + '</h1>');
//     const elemContent = document.getElementById(elem)?.innerHTML;
//     mywindow.document.write(elemContent || '');
//     mywindow.document.write('</body></html>');

//     mywindow.document.close(); // necessary for IE >= 10
//     mywindow.focus(); // necessary for IE >= 10

//     mywindow.print();
//     mywindow.close();

//     return true;
//   }

//   return false;
// }

function PrintElem(elem: string): void {
  const printWindow = window.open("", "_blank", "height=400,width=600");

  if (printWindow) {
    printWindow.document.write("<html><head><title>" + document.title + "</title>");
    printWindow.document.write("</head><body >");
    printWindow.document.write("<h1>" + document.title + "</h1>");
    const elemContent = document.getElementById(elem)?.innerHTML;
    printWindow.document.write(elemContent || "");
    printWindow.document.write("</body></html>");
    printWindow.document.close(); // necessary for IE >= 10
    printWindow.focus(); // necessary for IE >= 10

    // Call the print function after a short delay to give the window enough time to load the content.
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  } else {
    console.error("Failed to open print window.");
  }
}

const InvoiceBillingForm = () => {
  const [allDatas, setAllDatas] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { invoiceId } = useParams();

  const [invoiceBillingData, setInvoiceBillingData] = React.useState<any>({
    invoiceBillingData: [
      {
        booking_id: "",
        locations: [
          {
            location: "",
            billing_agreement: "",
            inspection: "",
            rate_types: [
              {
                rate: "",
                rate_type: "",
              },
            ],
          },
        ],
      },
    ],
  });

  const [disableEntireField, setDisableEntireField] = React.useState<boolean>(true);
  const [getCurrentPreviewData, setCurrentPreviewData] = React.useState([]);

  const { invoiceData, setInvoiceData, additionalInvoiceData, setAdditionalInvoiceData } =
    useBillingInvoceData();
  const { adjustmentData } = useAdjustmentData();
  const { setIsSendTriggered, isPrintTriggered, setIsPrintTriggered } = useInvoiceTriggred();
  const { setInvoiceFile, invoiceFile } = useInvoiceFile();
  const [showPreview, setShowPreview] = React.useState(false);

  const printRef = React.useRef<HTMLInputElement>(null);

  const sendInvoice = async () => {
    setIsSendTriggered(true);
  };

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const handlePrint = () => {
    PrintElem("InvoicePreview");
  };

  const getAllInvoicedDatas = async (): Promise<void> => {
    try {
      setLoading(true);
      const { status, data } = await getAPI(`invoice/${invoiceId}`);
      if (status === 200) {
        setInvoiceData(data);

        setAdditionalInvoiceData(data);

        setAllDatas(
          data?.booking_data[0]?.items ? data?.booking_data[0]?.items : data?.booking_data,
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvoicedDatas();
  }, []);

  const populateBillingData = () => {
    if (invoiceData.booking_data !== undefined) {
      setInvoiceBillingData({
        invoiceBillingData: invoiceData?.booking_data[0]?.items,
      });
    }
  };

  React.useEffect(() => {
    populateBillingData();
  }, [invoiceData]);

  useEffect(() => {
    if (showPreview) {
      handlePrint();
      setShowPreview(false);
    }
  }, [showPreview === true]);

  return (
    <div id="InvoiceBillingForm">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        className="tenant-page-container"
        style={{
          margin: "40px 0",
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          borderTop={"none"}
          className="setting-form-group"
          sx={{
            marginTop: "0",
            padding: 0,
            boxShadow: "none",
          }}
        >
          <TestTable
            setCurrentPreviewData={(val: any) => {
              setCurrentPreviewData(val);
            }}
            data={allDatas}
          />
        </Box>
      </div>

      <div className="invoiceBillingData_footer">
        <div className="invoiceBillingData_footer_btn">
          <div className="invoiceBillingData_footer_btn_left">
            {/* <Button
              variant="outlined"
              onClick={() => {
                handlePrint();
                // exportPDF();
              }}>
              Download PDF
            </Button> */}
          </div>

          <div className="invoiceBillingData_footer_btn_right">
            <Button
              variant="outlined"
              onClick={(e) => {
                setIsPrintTriggered(!isPrintTriggered);
                setInvoiceData({ ...invoiceData, ...invoiceFile });
                setShowPreview(true);
              }}
            >
              Preview
            </Button>

            <Button variant="contained" onClick={sendInvoice}>
              Send Invoice
            </Button>
          </div>
        </div>
      </div>

      {showPreview && (
        <div
          className="none_type_display"
          style={{
            display: "none",
          }}
        >
          <div className="none_type_display" id="Preview_main_pdf" ref={printRef}>
            {!loading && <InvoicePreview previewData={getCurrentPreviewData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceBillingForm;
