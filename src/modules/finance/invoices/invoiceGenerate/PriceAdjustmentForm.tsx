import { PriceAdjustmentSchema } from "src/components/validationSchema";
import {
  Autocomplete,
  Button,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Field, Formik } from "formik";
import React from "react";
import {
  triggerAdjustment,
  useAdjustmentData,
  useBillingInvoceData,
  useUpdatingAdjustment,
} from "globalStates/invoice/invoice";
import { useSnackbar } from "notistack";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useParams } from "react-router-dom";

interface PriceAdjustmentProps {
  id?: number;
  name: string;
  type: string;
  adjustment: string;
  description: string;
  isPriceAdjusted?: (value: any) => void;
}

const PriceAdjustmentForm = (prop: any) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const { setAdjustmentData, adjustmentData } = useAdjustmentData();
  const { setIsAdjustmentTriggered } = triggerAdjustment();
  const { updatingAdjustmentId, setUpdatingAdjustmentId } = useUpdatingAdjustment();
  const { invoiceData, setInvoiceData } = useBillingInvoceData();

  const { invoiceId } = useParams<{ invoiceId: string }>();

  const adjustmentTypeOptions = [
    { value: "percent", label: "Percent" },
    { value: "amount", label: "Amount" },
  ];

  const [initialValues, setInitialValues] = React.useState<PriceAdjustmentProps>({
    id: 0,
    name: "",
    type: "amount",
    adjustment: "",
    description: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  // console.log(adjustmentData?.data?.data[0], 'adjustmentData');

  const submitHandler = async (values: any) => {
    let payload = {
      invoice: Number(invoiceId),
      adjustment_name: values.name,
      adjustment_type: values.type,
      adjustment_amount: values.adjustment,
      description: values.description,
    };
    try {
      setLoading(true);
      if (invoiceId && updatingAdjustmentId) {
        putAPI(`invoice-price-adjustment/${updatingAdjustmentId}`, payload).then((res) => {
          setLoading(false);
          setAdjustmentData(res);
          setInvoiceData({ ...invoiceData, invoice_price_adjustment: res.data });

          prop.afterSubmit(res.data);
          enqueueSnackbar("Price Adjustment updated successfully!", {
            variant: "success",
          });
          setIsAdjustmentTriggered(true);

          prop.modalState("close");
          setLoading(false);
        });
      } else if (invoiceId) {
        postAPI(`/invoice-price-adjustment/`, [payload]).then((res) => {
          setLoading(false);
          setAdjustmentData(res);
          prop.afterSubmit(res.data);
          setInvoiceData({ ...invoiceData, invoice_price_adjustment: res.data });

          enqueueSnackbar("Price Adjustment added successfully!", {
            variant: "success",
          });
          setIsAdjustmentTriggered(true);

          prop.modalState("close");
          setLoading(false);
        });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.detail?.message || "Something went wrong!", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const getAdjustment = () => {
    getAPI(`invoice-price-adjustment/id/${updatingAdjustmentId}`)
      .then((res) => {
        // setAdjustmentData((prev) => [...prev.data?.data[0], res?.data]);
        // setAdjustmentData(res?.data);
        setInitialValues({
          id: res?.data?.id,
          name: res?.data?.adjustment_name,
          type: res?.data?.adjustment_type,
          adjustment: res?.data?.adjustment_amount,
          description: res?.data?.description,
        });
        setIsAdjustmentTriggered(false);
      })
      .catch((err) => {
        console.log(err);
      });

    // const adjustment = totalAmount - (finalAmount + tax);
    // return adjustment;
  };

  React.useEffect(() => {
    if (updatingAdjustmentId) {
      getAdjustment();
    }
  }, [updatingAdjustmentId]);

  return (
    <div id="PriceAdjustmentForm">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={PriceAdjustmentSchema}
        onSubmit={async (values, formikHelpers) => {
          submitHandler(values);
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isValid,
            dirty,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          } = props;

          return (
            <form className="region-form" onSubmit={handleSubmit}>
              {loading && <CircularProgress className="page-loader" />}
              <div className="region-fieldset" id="price_adjustment_form">
                <Grid container direction={"column"} spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="name">
                      <div className="label-heading">
                        Adjustment Name <sup>*</sup>
                      </div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <Field
                        as={TextField}
                        name="name"
                        id="name"
                        placeholder="Enter here"
                        size="small"
                        fullWidth
                        autoComplete="off"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.name && touched.name}
                        helperText={errors.name && touched.name ? errors.name : null}
                      />

                      {errors?.name && touched?.name && (
                        <div className="input-feedback" style={{ color: "red" }}>
                          {errors?.name}
                        </div>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid container direction={"column"} spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="Adjustment_type">
                      <div className="label-heading">Adjustment Type</div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder custom-select-search-field-billing-aggrement">
                      <Select
                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                        name="type"
                        id="type"
                        size="small"
                        fullWidth
                        data-testid="type"
                        placeholder="Select here"
                        autoComplete="off"
                        value={values.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {adjustmentTypeOptions.map((item: any, index: number) => (
                          <MenuItem key={index} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormGroup>
                  </Grid>
                </Grid>

                <Grid container direction={"column"} spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="adjustment">
                      <div className="label-heading">
                        Adjustment <sup>*</sup>
                      </div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <Field
                        as={TextField}
                        id="adjustment"
                        type="number"
                        placeholder="Enter here"
                        size="small"
                        fullWidth
                        name="adjustment"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.adjustment}
                        error={Boolean(touched.adjustment && errors.adjustment)}
                      />
                      {errors?.adjustment && touched?.adjustment && (
                        <div className="input-feedback" style={{ color: "red" }}>
                          {errors?.adjustment}
                        </div>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid container direction={"column"} spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="description">
                      <div className="label-heading">Description</div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <OutlinedInput
                        id="description"
                        type="text"
                        placeholder="Enter here"
                        size="small"
                        fullWidth
                        name="description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        error={Boolean(touched.description && errors.description)}
                      />
                      {Boolean(touched.description && errors.description) && (
                        <FormHelperText error>{errors.description}</FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
              </div>

              <div className="action-button-holder">
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!isValid || !dirty || isSubmitting}
                    >
                      {invoiceId && updatingAdjustmentId ? "Update" : "Add"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        prop.afterSubmit("close");
                      }}
                      sx={{
                        marginRight: "10px",
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PriceAdjustmentForm;
