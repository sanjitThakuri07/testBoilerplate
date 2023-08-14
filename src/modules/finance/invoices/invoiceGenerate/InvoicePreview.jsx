import {
  useAdditionalPreviewData,
  useBillingInvoceData,
  useInvoiceTableDatas,
  usePublicInvoice,
} from "globalStates/invoice/invoice";

import "./InvoicePreview.scss";
import TestTable from "./invoiceTable";

// Create styles

const heading_text = {
  fontFamily: `'Inter', sans-serif`,
  src: `url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')`,
};

// section: {
//   margin: 10,
//   padding: 10,
//   flexGrow: 1,
// },
const pdf_preview_text = {
  fontSize: "15px",
  fontWeight: 600,
  marginBottom: "10px",
  fontFamily: `'Inter', sans-serif`,
  src: `url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')`,
};

const textAlignEnd = {
  textAlign: "end",
};

const invoice_preview_container = {
  fontFamily: `'Inter', sans-serif`,
  src: `url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')`,
};

const pdf_preview_label = {
  fontSize: "15px",
  fontWeight: "normal",
  marginBottom: "10px",
  color: "#6f6f84",
  fontFamily: `'Inter', sans-serif`,
  src: `url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')`,
};

// remove first th of thead using css

const InvoicePreview = (previewData) => {
  const { publicInvoice } = usePublicInvoice();
  const { additionalPreviewData, setAdditionalPreviewData } = useAdditionalPreviewData();

  const { invoiceData } = useBillingInvoceData();
  let PreviewData = publicInvoice?.length ? publicInvoice : invoiceData.booking_data?.[0].items;

  function numberToWords(number) {
    const ones = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];

    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    function convertBelowThousand(num) {
      if (num === 0) return "";
      if (num < 20) return ones[num];
      if (num < 100)
        return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? "-" + ones[num % 10] : "");
      return (
        ones[Math.floor(num / 100)] +
        " hundred" +
        (num % 100 !== 0 ? " and " + convertBelowThousand(num % 100) : "")
      );
    }

    function convertIntegerToWords(integerPart) {
      if (integerPart === 0) return "zero";
      let words = "";
      const billion = Math.floor(integerPart / 1000000000);
      const million = Math.floor((integerPart % 1000000000) / 1000000);
      const thousand = Math.floor((integerPart % 1000000) / 1000);
      const rest = integerPart % 1000;

      if (billion) words += convertBelowThousand(billion) + " billion ";
      if (million) words += convertBelowThousand(million) + " million ";
      if (thousand) words += convertBelowThousand(thousand) + " thousand ";
      if (rest) words += convertBelowThousand(rest);

      return words.trim();
    }

    function convertDecimalToWords(decimalPart) {
      if (decimalPart === 0) return "";
      const decimalString = decimalPart.toString();
      const decimalWords = decimalString
        .slice(2)
        .split("")
        .map((digit) => ones[Number(digit)])
        .join(" ");
      return "point " + decimalWords;
    }

    const integerPart = Math.floor(number);
    const decimalPart = number - integerPart;

    const integerWords = convertIntegerToWords(integerPart);
    const decimalWords = convertDecimalToWords(decimalPart.toFixed(2));

    return integerWords + (decimalWords ? " " + decimalWords : "");
  }

  const pdf_preview_label_float_right = {
    float: "right",
    marginRight: "10px",
  };

  return (
    <div id="InvoicePreview">
      <div className="InvoicePreview_container">
        <div
          className="InvoicePreview_heading"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "20px",
          }}
        >
          <div
            className="InvoicePreview_heading_left_side"
            style={{ ...heading_text, fontSize: "24px", fontWeight: "600" }}
          >
            Invoice
          </div>

          <div className="InvoicePreview_heading_right_side">
            <img
              src={`${process.env.VITE_HOST_URL}/${invoiceData.logo}`}
              alt="logo"
              height={70}
              width={70}
              style={{
                maxWidth: "100px",
              }}
            />
          </div>
        </div>

        <div
          className="invoice_info_container"
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
          }}
        >
          {/* <div className="invoice_info_grid">
            <div className="pdf_preview_label" style={pdf_preview_label}>
              Subject
            </div>
            <div className="pdf_preview_text" style={pdf_preview_text}>
              Design System
            </div>
          </div> */}
          <div className="invoice_info_grid">
            <div className="pdf_preview_label" style={pdf_preview_label}>
              Customer Name
            </div>
            <div className="pdf_preview_text" style={pdf_preview_text}>
              {invoiceData.customer_name || "N/A"}
            </div>
          </div>
          <div className="invoice_info_grid">
            <div className="pdf_preview_label" style={pdf_preview_label}>
              Remarks
            </div>
            <div className="pdf_preview_text" style={pdf_preview_text}>
              {invoiceData.invoice_for || "N/A"}
            </div>
          </div>
        </div>
        <div
          className="invoice_info_container"
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
            marginTop: "20px",
            boxShadow: "#2833521f 0px 0px 0px 1000px inset",
            padding: "10px",
            borderTop: "1px solid #BCB0C4",
            borderBottom: "1px solid #BCB0C4",
          }}
        >
          <div className="invoice_info_grid">
            <div className="pdf_preview_label" style={pdf_preview_label}>
              Invoice Number
            </div>
            <div className="pdf_preview_text" style={pdf_preview_text}>
              #{invoiceData.invoice_number}
            </div>
          </div>
          <div className="invoice_info_grid">
            <div className="pdf_preview_label" style={pdf_preview_label}>
              Invoice Date
            </div>
            <div className="pdf_preview_text" style={pdf_preview_text}>
              {invoiceData.invoice_date}
            </div>
          </div>
          <div className="invoice_info_grid">
            <div className="pdf_preview_label" style={pdf_preview_label}>
              Due on
            </div>
            <div className="pdf_preview_text" style={pdf_preview_text}>
              {invoiceData.due_date}
            </div>
          </div>
        </div>

        <div
          className="invoice_info_container"
          id="BillInfoContainer"
          style={{
            boxShadow: "#2833521f 0px 0px 0px 1000px inset",
            padding: "10px",
            borderBottom: "1px solid #BCB0C4",
          }}
        >
          <TestTable
            setCurrentPreviewData={(val) => {
              console.log({ val });
            }}
            data={PreviewData}
          />
        </div>

        <div
          className="invoice_info_container"
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto auto auto auto auto auto auto auto",
            marginTop: "20px",
          }}
        >
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid" style={{}}>
            <div
              className="pdf_preview_label"
              style={{
                ...pdf_preview_text,
                ...pdf_preview_label_float_right,
                marginRight: "0px",
              }}
            >
              Net Amount
            </div>
          </div>
          <div className="invoice_info_grid">
            <div
              className="pdf_preview_text"
              style={{
                ...pdf_preview_text,
                ...pdf_preview_label_float_right,
                marginRight: "0px",
              }}
            >
              {invoiceData?.currency_data?.currency + " "}
              {invoiceData?.net_amount || "N/A"}
            </div>

            {/* {invoiceData?.invoice_price_adjustment.map((item, index) => {
              return (
                <div className="pdf_preview_text" style={pdf_preview_text}>
                  {item?.adjustment_name}
                </div>
              );
            })}

            {invoiceData?.invoice_price_adjustment.map((item, index) => {
              return (
                <div className="pdf_preview_text" style={pdf_preview_text}>
                  {item?.adjustment_type === 'amount'
                    ? ` AUD ${item?.adjustment_amount}`
                    : `${item?.adjustment_amount} %`}
                </div>
              );
            })} */}
          </div>
        </div>

        {/* Adjustment data */}

        <div
          className="invoice_info_container"
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto auto auto auto auto  auto",
          }}
        >
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid" style={{}}>
            {invoiceData?.invoice_price_adjustment.map((item, index) => {
              return (
                <div className="pdf_preview_text" style={{ ...pdf_preview_text, ...textAlignEnd }}>
                  {`${item?.adjustment_name}
                  ${item.adjustment_type === "percent" ? "(" + item.adjustment_amount + "%)" : ""}
                  `}
                </div>
              );
            })}
          </div>

          <div className="invoice_info_grid">
            {invoiceData?.invoice_price_adjustment.map((item, index) => {
              return (
                <div className="pdf_preview_text" style={{ ...pdf_preview_text, ...textAlignEnd }}>
                  {item?.adjustment_type === "amount"
                    ? ` ${invoiceData?.currency_data?.currency}  ${item?.adjustment_amount}`
                    : `${item?.adjustment_amount_display} `}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="invoice_info_container"
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto auto auto auto auto auto auto auto auto auto",
          }}
        >
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid" style={{}}>
            <div className="pdf_preview_text" style={{ ...pdf_preview_text, ...textAlignEnd }}>
              {`Tax (${invoiceData?.tax?.tax_percentage}%)`}
            </div>
          </div>

          <div className="invoice_info_grid">
            <div className="pdf_preview_text" style={{ ...pdf_preview_text, ...textAlignEnd }}>
              {`${invoiceData?.currency_data?.currency + " "}${invoiceData?.tax?.tax_amount}`}
            </div>
          </div>
        </div>

        <div
          className="invoice_info_container"
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto auto auto auto auto auto auto auto auto",
            marginTop: "20px",
            boxShadow: "rgb(40 52 81) 0px 0px 0px 1000px inset",
            padding: "10px",
            color: "#ffffff",
          }}
        >
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>
          <div className="invoice_info_grid"></div>

          <div
            className="pdf_preview_label"
            style={{
              ...pdf_preview_label,
              textAlign: "right",

              color: "#ffffff",
              fontSize: "16px",
              marginTop: "10px",
            }}
          >
            Grand Total
          </div>

          <div className="invoice_info_grid">
            <div
              className="pdf_preview_text"
              style={{
                ...pdf_preview_text,
                fontSize: "18px",
                marginTop: "10px",
                textAlign: "right",
              }}
            >
              {invoiceData?.currency_data?.currency + " "}{" "}
              {invoiceData?.total_amount?.toFixed(2) || "N/A"}
            </div>
          </div>
        </div>

        <style jsx>
          {`
            @media print {
              @page {
                margin-top: 5px;
                margin-bottom: 5px;
              }
              body {
                padding-top: 4rem;
                padding-bottom: 4rem;
              }
            }
            #BillInfoContainer {
              background-color: rgba(40, 51, 82, 0.1);
            }
            #BillInfoContainer .additional_input_iconn {
              display: block !important;
            }
            #BillInfoContainer .grand_total_container {
              display: none !important;
              background-color: rgb(40, 52, 81);
            }
            #BillInfoContainer .invoice_info_container td {
              padding: 7px 0 !important;
            }
            #BillInfoContainer .pdf_preview_label_opt,
            #BillInfoContainer pdf_preview_label_opt {
              display: none !important;
            }

            #BillInfoContainer .pdf_preview_label {
              margin-right: 0px !important;
            }

            .grand_total_container {
              display: none;
            }
            #BillInfoContainer .additional_drag_icon {
              all: unset;
            }
            #BillInfoContainer .custom_input_field {
              all: unset;
            }
            #BillInfoContainer .MuiButtonBase-root {
              display: none;
            }
            #BillInfoContainer .drag_icon_start {
              display: none;
            }
            #BillInfoContainer .invoice_footer {
              display: none;
            }
            #BillInfoContainer .grand_total_label {
              margin-left: -100px;
            }
            .preview_invoice_footer_content {
               {
                /* display: none; */
              }
            }

            .invoice_info_grid {
               {
                /* display: grid;
              grid-template-columns: auto auto;
              padding: 10px;
              margin-top: 20px;
              position: absolute;
              bottom: 0px; */
              }
            }

            @media print {
              #BillInfoContainer {
                font-family: "Inter", sans-serif;
                font-size: 10pt;
              }
              #InvoicePreview {
                font-family: "Inter", sans-serif;
                font-size: 10pt;
              }
            }
          `}
        </style>

        <div
          className="invoice_info_container"
          style={{
            display: "grid",
            gridTemplateColumns: "auto 30px auto ",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          <div className="invoice_info_grid">
            <div className="pdf_preview_label" style={pdf_preview_label}>
              {/* Grand Total : AUD ${sum} */} Note
            </div>
            <div className="pdf_preview_text" style={pdf_preview_text}>
              Rate Type:
            </div>
            <div className="pdf_preview_text" style={pdf_preview_label}>
              {invoiceData &&
                invoiceData?.booking_data
                  ?.filter((item) => item?.rate_type?.remarks !== undefined)
                  .map((item, index) => {
                    return (
                      <div key={index}>
                        {" "}
                        {item?.rate_type?.rate_type} - {item?.rate_type?.remarks}
                      </div>
                    );
                  })}
            </div>
          </div>

          <div className="invoice_info_grid"> </div>

          <div className="invoice_info_grid">
            <div className="pdf_preview_label" style={pdf_preview_label}>
              In Words
            </div>
            <div
              className="pdf_preview_text"
              style={{ ...pdf_preview_text, textTransform: "capitalize" }}
            >
              {numberToWords(invoiceData.total_amount)} only.
            </div>
          </div>
        </div>
        <div className="invoice_info_container">
          <div
            className="invoice_info_grid preview_invoice_footer_content"
            style={{
              position: "absolute",
              bottom: "0px",
              width: "100%",
            }}
          >
            <div className="pdf_preview_text" style={pdf_preview_text}>
              Terms & Conditions
            </div>
            <div className=" pdf_preview_label" style={pdf_preview_label}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec id turpis malesuada nibh.
              Faucibus vitae, blandit aliquet scelerisque faucibus magna volutpat. Vitae aliquet
              maecenas purus sem.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
