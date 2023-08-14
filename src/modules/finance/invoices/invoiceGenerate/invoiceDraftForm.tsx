import { Grid, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Field, Formik, FormikProps } from "formik";
import React from "react";
import "./invoiceGenerate.scss";
import FileUploader from "src/components/upload";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import {
  useBillingInvoceData,
  useDraftTriggered,
  useInvoiceFile,
  useInvoiceTableDatas,
  useInvoiceTriggred,
} from "globalStates/invoice/invoice";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import * as Yup from "yup";

interface InvoiceProps {
  invoice_number: string;
  due_date: string;
  name: string;
  invoice_for: string;
  customer_name: string;
  customer_invoice_email: string;
  invoice_date: string;
}

const validateSchema = Yup.object().shape({
  invoice_number: Yup.string().required("Required"),
  invoice_for: Yup.string().nullable(),
});

const InvoiceDraftForm = () => {
  const { invoiceId } = useParams();
  const { invoiceData, setInvoiceData } = useBillingInvoceData();

  const [disableEntireField, setDisableEntireField] = React.useState<boolean>(false);
  const [initialValues, setInitialValues] = React.useState<InvoiceProps>({
    invoice_number: "",
    due_date: "",
    name: "",
    invoice_for: "",
    customer_name: "",
    customer_invoice_email: "",
    invoice_date: "",
  });

  const [file, setFile] = React.useState<any>(null);

  const { isSendTriggered, setIsSendTriggered, isPrintTriggered } = useInvoiceTriggred();
  const { invoiceFile, setInvoiceFile } = useInvoiceFile();
  const { isDraftTriggered, setIsDraftTriggered } = useDraftTriggered();
  const { invoiceTableData, setInvoiceTableData } = useInvoiceTableDatas();
  const [testValue, setTestValue] = React.useState("");

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setFile(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const populateData = () => {
    if (invoiceData?.base_data !== undefined) {
      setInitialValues({
        invoice_number: invoiceData?.invoice_number,
        due_date: invoiceData?.due_date,
        name: invoiceData?.name,
        invoice_for: invoiceData?.invoice_for,
        customer_name: invoiceData?.customer_name,
        invoice_date: invoiceData?.invoice_date,
        customer_invoice_email: invoiceData?.customer_invoice_email[0],
      });
    }
  };

  // console.log('invoiceData', invoiceData);

  React.useEffect(() => {
    if (invoiceData) populateData();
  }, [invoiceData]);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const submitHandler = (values: any, actions: any) => {
    let payload = {
      invoice_number: initialValues.invoice_number,
      due_date: initialValues.due_date,
      name: initialValues.name,
      invoice_for: initialValues.invoice_for,
      customer_name: initialValues.customer_name,
      invoice_date: initialValues.invoice_date,
      customer_invoice_email: [initialValues.customer_invoice_email],
      // invoice_file: invoiceFile,
      net_amount: invoiceData?.net_amount,
      currency: invoiceData?.currency,
      tax: invoiceData?.tax,
      discount: invoiceData?.discount,
      total_amount: invoiceData?.total_amount,
      // booking_data: invoiceData?.booking_data,
      is_draft: false,
      booking_data: invoiceTableData,
    };

    try {
      if (isSendTriggered) {
        putAPI(`invoice/${invoiceId}`, payload).then((res) => {
          navigate("send");
        });
        setIsSendTriggered(false);
      }

      if (isDraftTriggered) {
        payload.is_draft = true;
        putAPI(`invoice/${invoiceId}`, payload).then((res) => {
          enqueueSnackbar("Invoice saved as draft!", {
            variant: "success",
          });
        });
        setIsDraftTriggered(false);
      }
    } catch (error: any) {
      enqueueSnackbar("Something went wrong!", {
        variant: "error",
      });
      setIsSendTriggered(false);
    }
  };

  React.useEffect(() => {
    if (isSendTriggered) {
      submitHandler(initialValues, null);
    }
  }, [isSendTriggered]);

  React.useEffect(() => {
    if (isDraftTriggered) {
      submitHandler(initialValues, null);
    }
  }, [isDraftTriggered]);

  // React.useEffect(() => {
  //   setInvoiceData({
  //     ...invoiceData,
  //     invoice_for: initialValues.invoice_for,
  //     invoice_number: initialValues.invoice_number,
  //     due_date: initialValues.due_date,
  //     customer_name: initialValues.customer_name,
  //     invoice_date: initialValues.invoice_date,
  //     customer_invoice_email: [initialValues.customer_invoice_email],
  //   });
  // }, [testValue]);

  return (
    <div id="InvoiceDraftForm">
      <Box
        sx={{
          p: 2,
        }}
      >
        <div className="invoice_draft_form_heading">
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "500",
            }}
          >
            Invoice - Draft
          </Typography>
        </div>

        <div className="invoice_draft_form">
          <Formik
            // key={key}
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              console.log("values", values);

              // submitHandler(values, actions);
            }}
            validationSchema={validateSchema}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleSubmit,
                handleChange,
                setFieldValue,
                setFieldTouched,
                isSubmitting,
                initialTouched,
              } = props;
              setTestValue(values.invoice_for);
              // eslint-disable-next-line react-hooks/rules-of-hooks
              React.useEffect(() => {
                setInitialValues(values);
                setInvoiceFile({
                  ...values,
                  customer_invoice_email: [values.customer_invoice_email],
                });
              }, [values]);

              return (
                <>
                  <>
                    {/* form top */}
                    <form onSubmit={handleSubmit}>
                      <div className="generate_invoices-page-container">
                        <Box borderTop={"none"} className="setting-form-group">
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={12}>
                              <Grid container spacing={2} className="formGroupItem">
                                <Grid item xs={4}>
                                  <InputLabel htmlFor="invoice_number">
                                    <div className="label-heading  align__label">
                                      Invoice Number <sup>*</sup>
                                    </div>
                                  </InputLabel>
                                  <Field
                                    as={OutlinedInput}
                                    name="invoice_number"
                                    id="invoice_number"
                                    type="text"
                                    placeholder="Enter here"
                                    size="small"
                                    data-testid="invoice_number"
                                    fullWidth
                                    autoComplete="off"
                                    disabled={true}
                                    value={values?.invoice_number || ""}
                                    error={
                                      errors?.invoice_number && touched?.invoice_number
                                        ? true
                                        : false
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />

                                  {errors?.invoice_number && touched?.invoice_number && (
                                    <div className="input-feedback" style={{ color: "red" }}>
                                      {errors?.invoice_number}
                                    </div>
                                  )}
                                </Grid>
                                <Grid item xs={4}>
                                  <InputLabel htmlFor="due_date">
                                    <div className="label-heading  align__label">Due on</div>
                                  </InputLabel>
                                  <Field
                                    as={OutlinedInput}
                                    name="due_date"
                                    id="due_date"
                                    type="date"
                                    placeholder="Enter here"
                                    size="small"
                                    data-testid="due_date"
                                    fullWidth
                                    autoComplete="off"
                                    disabled={disableEntireField}
                                    value={values?.due_date || ""}
                                    error={errors?.due_date && touched?.due_date ? true : false}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />

                                  {errors?.due_date && touched?.due_date && (
                                    <div className="input-feedback" style={{ color: "red" }}>
                                      {errors?.due_date}
                                    </div>
                                  )}
                                </Grid>
                                <Grid item xs={4}>
                                  <InputLabel htmlFor="customer_name">
                                    <div className="label-heading  align__label">Customer Name</div>
                                  </InputLabel>
                                  <Field
                                    as={OutlinedInput}
                                    name="customer_name"
                                    id="customer_name"
                                    type="text"
                                    placeholder="Enter here"
                                    size="small"
                                    data-testid="customer_name"
                                    fullWidth
                                    autoComplete="off"
                                    disabled={disableEntireField}
                                    value={values?.customer_name || ""}
                                    error={
                                      errors?.customer_name && touched?.customer_name ? true : false
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />

                                  {errors?.customer_name && touched?.customer_name && (
                                    <div className="input-feedback" style={{ color: "red" }}>
                                      {errors?.customer_name}
                                    </div>
                                  )}
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={4}>
                                  <InputLabel htmlFor="invoice_date">
                                    <div className="label-heading  align__label">Invoice Date</div>
                                  </InputLabel>
                                  <Field
                                    as={OutlinedInput}
                                    name="invoice_date"
                                    id="invoice_date"
                                    type="date"
                                    placeholder="Enter here"
                                    size="small"
                                    data-testid="invoice_date"
                                    fullWidth
                                    autoComplete="off"
                                    disabled={disableEntireField}
                                    value={values?.invoice_date || ""}
                                    error={
                                      errors?.invoice_date && touched?.invoice_date ? true : false
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />

                                  {errors?.invoice_date && touched?.invoice_date && (
                                    <div className="input-feedback" style={{ color: "red" }}>
                                      {errors?.invoice_date}
                                    </div>
                                  )}
                                </Grid>
                                <Grid item xs={4}>
                                  <InputLabel htmlFor="invoice_for">
                                    <div className="label-heading  align__label">Remarks</div>
                                  </InputLabel>
                                  <Field
                                    as={OutlinedInput}
                                    name="invoice_for"
                                    id="invoice_for"
                                    type="text"
                                    placeholder="Enter here"
                                    size="small"
                                    data-testid="invoice_for"
                                    fullWidth
                                    autoComplete="off"
                                    disabled={disableEntireField}
                                    value={values?.invoice_for || ""}
                                    error={
                                      errors?.invoice_for && touched?.invoice_for ? true : false
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />

                                  {errors?.invoice_for && touched?.invoice_for && (
                                    <div className="input-feedback" style={{ color: "red" }}>
                                      {errors?.invoice_for}
                                    </div>
                                  )}
                                </Grid>

                                <Grid item xs={4}>
                                  <InputLabel htmlFor="customer_invoice_email">
                                    <div className="label-heading  align__label">
                                      Customer Invoice Email
                                    </div>
                                  </InputLabel>
                                  <Field
                                    as={OutlinedInput}
                                    name="customer_invoice_email"
                                    id="customer_invoice_email"
                                    type="text"
                                    placeholder="Enter here"
                                    size="small"
                                    data-testid="customer_invoice_email"
                                    fullWidth
                                    autoComplete="off"
                                    disabled={disableEntireField}
                                    value={values?.customer_invoice_email || ""}
                                    error={
                                      errors?.customer_invoice_email &&
                                      touched?.customer_invoice_email
                                        ? true
                                        : false
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />

                                  {errors?.customer_invoice_email &&
                                    touched?.customer_invoice_email && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors?.customer_invoice_email}
                                      </div>
                                    )}
                                </Grid>
                              </Grid>

                              <Grid container spacing={2} className="formGroupItem"></Grid>
                            </Grid>
                            {/* <Grid item xs={4}>
                              {file ? (
                                <>
                                  <div
                                    className="image-renderer"
                                    style={{
                                      maxHeight: '315px',
                                      width: '100%',
                                      marginTop: '50px',
                                    }}>
                                    <img
                                      src={file}
                                      alt=""
                                      style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'cover',
                                      }}
                                    />
                                  </div>
                                </>
                              ) : (
                                <FileUploader
                                  onUpload={handleUpload}
                                  maxCount={1}
                                  allowMultiple={false}
                                  disabled={disableEntireField}
                                  alternativeHeading={false}
                                />
                              )}
                            </Grid> */}
                          </Grid>
                        </Box>
                      </div>
                    </form>

                    {/* <Grid
                      container
                      spacing={4}
                      className="formGroupItem"
                      style={{
                        marginTop: '20px',
                      }}></Grid> */}
                  </>
                </>
              );
            }}
          </Formik>
        </div>
      </Box>
    </div>
  );
};

export default InvoiceDraftForm;
