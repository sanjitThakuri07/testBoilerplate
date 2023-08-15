import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  ListItem,
  OutlinedInput,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { Field, FieldArray, Form, Formik } from "formik";
import DotGrid from "src/assets/icons/dotGrid2by2.svg";
import AddIcon from "@mui/icons-material/Add";
import InvoiceRateFields from "./InvoiceRateFields";
import {
  useAdjustmentData,
  useBillingInvoceData,
} from "src/store/zustand/globalStates/invoice/invoice";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import InvoicePreview from "./InvoicePreview";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

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
  PrintElem("InvoicePreview"); // Replace 'myElement' with the ID of the element you want to print
};

const CustomTextField = ({
  isItemDraggable,
  isItemAddable,
  onClickItemAddadble,
  field,
  form,
  ref,
  ...props
}: any) => {
  return (
    <TextField
      {...field}
      {...props}
      ref={ref}
      InputProps={{
        startAdornment: (
          <>
            {isItemDraggable && (
              <InputAdornment position="start">
                <IconButton aria-label="dotGrid">
                  <img src={DotGrid} alt="" />
                </IconButton>
              </InputAdornment>
            )}
          </>
        ),
        endAdornment: (
          <>
            {isItemAddable && (
              <InputAdornment position="end">
                <IconButton aria-label="add" onClick={onClickItemAddadble}>
                  <AddIcon
                    sx={{
                      fontSize: "18px",
                    }}
                  />
                </IconButton>
              </InputAdornment>
            )}
          </>
        ),
      }}
    />
  );
};

const InvoiceBillingForm = () => {
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

  const { invoiceData } = useBillingInvoceData();
  const { adjustmentData } = useAdjustmentData();

  const discountAmount =
    adjustmentData?.type?.value === "amount" ? adjustmentData?.adjustment : null;
  const discountPercentage =
    adjustmentData?.type?.value === "percentage" ? adjustmentData?.adjustment : null;

  const populateBillingData = () => {
    if (invoiceData.booking_data !== undefined) {
      setInvoiceBillingData({ invoiceBillingData: invoiceData?.booking_data[0]?.items });
    }
  };

  // console.log(invoiceData, 'invoiceData');

  React.useEffect(() => {
    populateBillingData();
  }, [invoiceData]);

  const totalSum = invoiceBillingData.invoiceBillingData?.map((item: any) =>
    item.locations?.map((location: any) =>
      location.rate_types
        ?.map((rateType: any) => rateType.rate)
        .reduce((accumulator: any, currentValue: any) => {
          return accumulator + currentValue;
        }),
    ),
  );

  let sum = 0;

  for (let i = 0; i < totalSum.length; i++) {
    for (let j = 0; j < totalSum[i].length; j++) {
      sum += totalSum[i][j];
    }
  }

  const taxPercentage = "10";

  return (
    <div id="InvoiceBillingForm">
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
          <div className="invoice_Bl_Fm_header">
            <Grid container spacing={1}>
              <Grid item xs={0.5}></Grid>
              <Grid item xs={1.5}>
                Booking Number
              </Grid>
              <Grid item xs={2}>
                Location
              </Grid>
              {/* <Grid item xs={2}>
                Billing Agreement Type
              </Grid> */}
              <Grid item xs={3.5}>
                Inspection
              </Grid>
              <Grid item xs={2.5}>
                Rate Type
              </Grid>
              <Grid item xs={2}>
                Rate
              </Grid>
            </Grid>
          </div>

          <Formik
            key={"key"}
            enableReinitialize
            initialValues={invoiceBillingData}
            onSubmit={(values, actions) => {
              // submitHandler(finalValue, actions);
              console.log("values", values);
            }}
            // validationSchema={[]}
          >
            {(props) => {
              const { values, handleBlur, handleChange, setFieldValue } = props;

              // let individualBookingSum = 0;

              // const itemSum = values.invoiceBillingData?.map((item: any) =>
              //   item.locations?.map((location: any) =>
              //     location.rate_types
              //       ?.map((rateType: any) => rateType.rate)
              //       .reduce((accumulator: any, currentValue: any) => accumulator + currentValue),
              //   ),
              // );

              // console.log('itemSum', itemSum);

              return (
                <>
                  <Form>
                    <FieldArray
                      name="invoiceBillingData"
                      render={(arrayHelpers: any) => (
                        <>
                          {values.invoiceBillingData?.map((item: any, index: number) => (
                            <div className="invoiceBillingData_row">
                              <div>
                                <Grid
                                  container
                                  spacing={1}
                                  sx={{
                                    marginTop: "10px",
                                  }}
                                >
                                  <Grid item xs={0.5}>
                                    <div className="draggable_icon">
                                      <IconButton>
                                        <img
                                          src="/src/assets/icons/dots.svg"
                                          alt="Drag"
                                          height={20}
                                          width={20}
                                        />
                                      </IconButton>
                                    </div>
                                  </Grid>

                                  <Grid item xs={1.5}>
                                    <Field
                                      as={CustomTextField}
                                      name={`invoiceBillingData.${index}.booking_id`}
                                      id={`invoiceBillingData.${index}.booking_id`}
                                      type="text"
                                      placeholder="Booking Number"
                                      size="small"
                                      data-testid="booking_id"
                                      fullWidth
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={values?.invoiceBillingData[index]?.booking_id || ""}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Grid>

                                  {item.locations &&
                                    item.locations?.map((location: any, locationIndex: number) => (
                                      <>
                                        {locationIndex === 0 ? (
                                          <></>
                                        ) : (
                                          <>
                                            {" "}
                                            <Grid item xs={0.5} />
                                            <Grid item xs={1.5} />
                                          </>
                                        )}
                                        <Grid item xs={2}>
                                          <Field
                                            as={CustomTextField}
                                            name={`invoiceBillingData.${index}.locations.${locationIndex}.location`}
                                            id={`invoiceBillingData.${index}.locations.${locationIndex}.location`}
                                            type="text"
                                            placeholder="Location"
                                            size="small"
                                            data-testid="location"
                                            fullWidth
                                            autoComplete="off"
                                            isItemDraggable={true}
                                            disabled={disableEntireField}
                                            value={
                                              values?.invoiceBillingData[index]?.locations[
                                                locationIndex
                                              ]?.location || ""
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                        </Grid>

                                        <Grid item xs={3.5}>
                                          <Field
                                            as={CustomTextField}
                                            name={`invoiceBillingData.${index}.locations.${locationIndex}.inspection`}
                                            id={`invoiceBillingData.${index}.locations.${locationIndex}.inspection`}
                                            type="text"
                                            placeholder="Inspection"
                                            size="small"
                                            data-testid="inspection"
                                            fullWidth
                                            autoComplete="off"
                                            disabled={disableEntireField}
                                            value={
                                              values?.invoiceBillingData[index]?.locations[
                                                locationIndex
                                              ]?.inspection || ""
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                        </Grid>

                                        {location.rate_types &&
                                          location.rate_types.map(
                                            (rate: any, rateIndex: number) => (
                                              <>
                                                {rateIndex === 0 ? (
                                                  <></>
                                                ) : (
                                                  <>
                                                    <Grid item xs={0.5} />
                                                    <Grid item xs={1.5} />
                                                    <Grid item xs={2} />
                                                    <Grid item xs={3.5} />
                                                  </>
                                                )}

                                                <Grid item xs={2.5}>
                                                  <Field
                                                    as={CustomTextField}
                                                    name={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.rate_type`}
                                                    id={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.rate_type`}
                                                    type="text"
                                                    placeholder="Rate Type"
                                                    size="small"
                                                    data-testid="rate_type"
                                                    fullWidth
                                                    autoComplete="off"
                                                    isItemDraggable={true}
                                                    isItemAddable={true}
                                                    disabled={disableEntireField}
                                                    value={
                                                      values?.invoiceBillingData[index]?.locations[
                                                        locationIndex
                                                      ]?.rate_types[rateIndex]?.rate_type || ""
                                                    }
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                </Grid>

                                                <Grid item xs={2}>
                                                  <Field
                                                    as={CustomTextField}
                                                    name={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.rate`}
                                                    id={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.rate`}
                                                    type="text"
                                                    placeholder="Rate"
                                                    size="small"
                                                    data-testid="rate"
                                                    fullWidth
                                                    autoComplete="off"
                                                    disabled={disableEntireField}
                                                    value={
                                                      values?.invoiceBillingData[index]?.locations[
                                                        locationIndex
                                                      ]?.rate_types[rateIndex]?.rate || ""
                                                    }
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                </Grid>
                                              </>
                                            ),
                                          )}

                                        {location.rate_types &&
                                          location.rate_types.map(
                                            (rate: any, rateIndex: number) => (
                                              <>
                                                {rate.description === undefined ||
                                                rate.description === "" ? (
                                                  <></>
                                                ) : (
                                                  <>
                                                    <Grid item xs={0.5} />
                                                    <Grid item xs={1.5} />
                                                    <Grid item xs={2} />
                                                    <Grid item xs={3.5} />
                                                    <Grid item xs={2.5}>
                                                      <div className="custom_description_box_invoice">
                                                        <input
                                                          type="text"
                                                          name={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.description`}
                                                          id={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.description`}
                                                          placeholder="Rate Type description"
                                                          data-testid="description"
                                                          key={index}
                                                          autoComplete="off"
                                                          disabled={disableEntireField}
                                                          value={
                                                            values?.invoiceBillingData[index]
                                                              ?.locations[locationIndex]
                                                              ?.rate_types[rateIndex]
                                                              ?.description || ""
                                                          }
                                                          onChange={handleChange}
                                                          onBlur={handleBlur}
                                                        />

                                                        <div className="description_control_input">
                                                          <IconButton
                                                            size="small"
                                                            aria-label="edit"
                                                          >
                                                            <EditIcon
                                                              fontSize="small"
                                                              onClick={() => {
                                                                document
                                                                  .getElementById(
                                                                    `invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.description`,
                                                                  )
                                                                  ?.focus();
                                                              }}
                                                            />
                                                          </IconButton>
                                                          <IconButton
                                                            size="small"
                                                            aria-label="delete"
                                                          >
                                                            <Delete
                                                              fontSize="small"
                                                              onClick={() => {
                                                                setFieldValue(
                                                                  `invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.description`,
                                                                  "",
                                                                );
                                                              }}
                                                            />
                                                          </IconButton>
                                                        </div>
                                                      </div>
                                                    </Grid>
                                                    <Grid item xs={2} />
                                                  </>
                                                )}
                                              </>
                                            ),
                                          )}
                                      </>
                                    ))}
                                  {/* <>
                                    <Grid item xs={0.5} />
                                    <Grid item xs={1.5} />
                                    <Grid item xs={2} />
                                    <Grid item xs={3.5} />
                                    <Grid item xs={2.5}>
                                      <div className="invoiceBillingData_grid_row_total">
                                        <Typography variant="button" display="block" gutterBottom>
                                          Total
                                        </Typography>
                                      </div>
                                    </Grid>
                                    <Grid item xs={2}>
                                      <div className="invoiceBillingData_grid_row_total">
                                        <Typography variant="button" display="block" gutterBottom>
                                          AUD ${'123'}
                                        </Typography>
                                      </div>
                                    </Grid>
                                  </> */}
                                </Grid>
                              </div>

                              {/* <Divider variant="middle" /> */}
                            </div>
                          ))}

                          <>
                            <div className="invoice_total_container">
                              <Grid container spacing={2}>
                                <Grid item xs={2}>
                                  <Typography variant="button" display="block" gutterBottom>
                                    Invoice Total
                                  </Typography>
                                </Grid>
                                <Grid item xs={2} />

                                <Grid item xs={3.5} />
                                <Grid item xs={2.5}>
                                  <ListItem>Net Amount (AUD)</ListItem>
                                  <ListItem>Taxes</ListItem>
                                  {/* <ListItem>Discount</ListItem> */}
                                  {invoiceData?.invoice_price_adjustment?.map(
                                    (item: any, index: number) => (
                                      <ListItem key={index}>
                                        {item.adjustment_name}

                                        <Tooltip
                                          key={index}
                                          arrow
                                          TransitionComponent={Zoom}
                                          title={item.description}
                                        >
                                          <HelpOutlineIcon
                                            sx={{
                                              fontSize: "15px",
                                              marginLeft: "5px",
                                            }}
                                          />
                                        </Tooltip>
                                      </ListItem>
                                    ),
                                  )}
                                </Grid>
                                <Grid item xs={2}>
                                  <ListItem>AUD $ {invoiceData.net_amount}</ListItem>
                                  <ListItem>AUD ${taxPercentage}</ListItem>
                                  {/* <ListItem>
                                    AUD $
                                    {discountAmount ??
                                      (discountPercentage * sum) / 100 +
                                        ' (' +
                                        discountPercentage +
                                        '%)'}
                                  </ListItem> */}
                                  {invoiceData?.invoice_price_adjustment?.map(
                                    (item: any, index: number) => (
                                      <ListItem key={index}>
                                        {item.adjustment_type === "amount" ? (
                                          <> AUD ${item.adjustment_amount} </>
                                        ) : (
                                          <>{item.adjustment_amount + " %"} </>
                                        )}
                                      </ListItem>
                                    ),
                                  )}
                                </Grid>
                              </Grid>
                            </div>
                          </>

                          <div className="invoice_grand_total_container">
                            <Grid container spacing={1}>
                              <Grid item xs={2} />
                              <Grid item xs={2} />
                              <Grid item xs={3.5} />
                              <Grid item xs={2.5}>
                                <ListItem>Grand Total</ListItem>
                              </Grid>
                              <Grid item xs={2}>
                                <ListItem>
                                  {/* AUD ${' '}
                                  {Number(sum) -
                                    Number(
                                      discountAmount !== null
                                        ? discountAmount
                                        : (discountPercentage * sum) / 100,
                                    )} */}
                                  AUD $ {invoiceData.total_amount}
                                </ListItem>
                              </Grid>
                            </Grid>
                          </div>
                          <div className="invoiceBillingData_footer">
                            <div className="invoiceBillingData_footer_btn">
                              <div className="invoiceBillingData_footer_btn_left">
                                <Button variant="outlined">Download PDF</Button>
                              </div>

                              <div className="invoiceBillingData_footer_btn_right">
                                <Button variant="outlined" onClick={handlePrint}>
                                  Preview
                                </Button>

                                <Button
                                  variant="contained"
                                  href="/finance/invoice/generate-invoice/send"
                                >
                                  Send Invoice
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    />
                  </Form>
                </>
              );
            }}
          </Formik>
        </Box>
      </div>

      <InvoicePreview />
    </div>
  );
};

export default InvoiceBillingForm;
