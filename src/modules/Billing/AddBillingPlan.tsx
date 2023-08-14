import { Alert, Button, Snackbar } from "@mui/material";
import { Divider } from "@mui/material";
import { Form, Formik, useFormik } from "formik";
import React from "react";
import { BillingValidation } from "validationSchemas/BillingSchema";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { AddBillingPlanProps, BillingInitialValues } from "src/interfaces/billingPlan";
import MultiStepProgressBar from "containers/customers/customer/FormProgress";

import {
  BillingPlanStepFour,
  BillingPlanStepOne,
  BillingPlanStepThree,
  BillingPlanStepTwo,
} from "./BillingPlanForms";
import { FormikFormHelpers } from "src/interfaces/utils";
import SettingFooter from "src/components/footer/SettingFooter";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useParams } from "react-router-dom";

import useBillingPlanStore from "src/store/zustand/billingPlan";
import { LoadingButton } from "@mui/lab";
import BackButton from "src/components/buttons/back";

// import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

interface ProgressStep {
  id: string;
  page: string;
  title?: string;
  subText?: string;
  start?: number;
}
type CasesType = {
  [key: string]: string;
};

const ProgressDataSets: ProgressStep[] = [
  {
    id: "1",
    page: "pageone",
    title: "Basic Info",
    subText: "Provide plan name and description",
  },
  {
    id: "2",
    page: "pagetwo",
    title: "Pricing",
    subText: "Set pricing options for this plan",
  },
  {
    id: "3",
    page: "pagethree",
    title: "Selection",
    subText: "Upgrade/Downgrade options",
  },
  {
    id: "4",
    page: "pagefour",
    title: "Features",
    subText: "Set features for this plan",
  },
];

const AddBillingPlan = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = React.useState("pageone");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [ProgressDataSet, setProgressDataSet] = React.useState(ProgressDataSets);
  const [isViewOnly, setIsViewOnly] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [disableNextButton, setDisableNextButton] = React.useState(false);

  const [initialValues, setInitialValues] =
    React.useState<AddBillingPlanProps>(BillingInitialValues);

  const { billingId } = useParams();
  const { fetchBillingPlans, billingPlans }: any = useBillingPlanStore();

  const [featuresCheckbox, setFeaturesCheckbox] = React.useState([
    {
      id: "7",
      title: "Activity",
      checked: true,
      disabled: true,
    },
    {
      id: "8",
      title: "Configurations",
      checked: true,
      disabled: true,
    },
    {
      id: "1",
      title: "Quotation",
      checked: false,
      disabled: false,
    },
    {
      id: "2",
      title: "Bookings",
      checked: false,
      disabled: false,
    },
    {
      id: "3",
      title: "Form and Inspections",
      checked: false,
      disabled: false,
    },
    {
      id: "4",
      title: "Calendar",
      checked: false,
      disabled: false,
    },
    {
      id: "5",
      title: "Finance",
      checked: false,
      disabled: false,
    },
    {
      id: "6",
      title: "Advanced Analytics",
      checked: false,
      disabled: false,
    },
  ]);

  const [items, setItems] = React.useState(billingPlans);

  const navigate = useNavigate();

  const location = window.location.href;

  const getPlanDetails = async () => {
    await fetchBillingPlans({ changeFormat: true });
  };

  React.useEffect(() => {
    getPlanDetails().then(() => {
      setItems(
        billingPlans.map((item: any) => ({
          content: item.title,

          pre_selected: false,
          checked: false,
          id: item.id,
        })),
      );
    });
  }, []);

  const handleFormSubmit = async (values: AddBillingPlanProps, actions: any) => {
    setLoading(true);

    let payload = {
      ...values,
      ordering: items,

      quotation: featuresCheckbox.some(
        (item) => item.title === "Quotation" && item.checked === true,
      )
        ? true
        : false,
      booking: featuresCheckbox.some((item) => item.title === "Bookings" && item.checked === true)
        ? true
        : false,
      form: featuresCheckbox.some(
        (item) => item.title === "Form and Inspections" && item.checked === true,
      )
        ? true
        : false,
      calendar: featuresCheckbox.some((item) => item.title === "Calendar" && item.checked === true)
        ? true
        : false,
      finance: featuresCheckbox.some((item) => item.title === "Finance" && item.checked === true)
        ? true
        : false,
      analytics: featuresCheckbox.some(
        (item) => item.title === "Advanced Analytics" && item.checked === true,
      )
        ? true
        : false,
    };

    if (billingId) {
      await putAPI(`billings/${billingId}`, payload)
        .then((res) => {
          enqueueSnackbar(res.data.message, { variant: "success" });
          actions.setSubmitting(false);
          setLoading(false);
          navigate("/billing");

          // fetchBillingPlans();
        })
        .catch((err) => {
          enqueueSnackbar("Something went wrong", { variant: "error" });
          actions.setSubmitting(false);
          setLoading(false);
        });
    } else {
      await postAPI("/billings/", [payload])
        .then((res) => {
          enqueueSnackbar("Billing plan created successfully", { variant: "success" });
          actions.setSubmitting(false);
          actions.resetForm();
          setLoading(false);
          navigate("/billing");

          // fetchBillingPlans();
        })
        .catch((err) => {
          enqueueSnackbar("Something went wrong", { variant: "error" });
          actions.setSubmitting(false);
          setLoading(false);
        });
    }
  };

  React.useEffect(() => {
    if (location.includes("view")) {
      setIsViewOnly(true);
    }
    if (billingId) {
      const getPlanDetails = async () => {
        await getAPI(`billings/${billingId}`)
          .then((res) => {
            setInitialValues(res?.data);
            setItems(res?.data.ordering);
            setFeaturesCheckbox([
              {
                id: "7",
                title: "Activity",
                checked: res?.data?.activity ?? false,
                disabled: true,
              },
              {
                id: "8",
                title: "Configurations",
                checked: res?.data?.configurations ?? false,
                disabled: true,
              },
              {
                id: "1",
                title: "Quotation",
                checked: res?.data?.quotation,
                disabled: false,
              },
              {
                id: "2",
                title: "Bookings",
                checked: res?.data?.booking,
                disabled: false,
              },
              {
                id: "3",
                title: "Form and Inspections",
                checked: res?.data?.form,
                disabled: false,
              },
              {
                id: "4",
                title: "Calendar",
                checked: res?.data?.calendar,
                disabled: false,
              },
              {
                id: "5",
                title: "Finance",
                checked: res?.data?.finance,
                disabled: false,
              },
              {
                id: "6",
                title: "Advanced Analytics",
                checked: res?.data?.analytics,
                disabled: false,
              },
            ]);
          })
          .catch((err) => {
            enqueueSnackbar("Something went wrong", { variant: "error" });
          });
      };
      getPlanDetails();
    }
  }, [billingId]);

  const cases: CasesType = {};
  for (let i = 0; i < ProgressDataSet.length; i++) {
    const progress = ProgressDataSet[i];
    cases[`${i + 1}`] = `setPage("${progress.page}");`;
  }

  // creating dynamic switch cases
  const nextPageNumber = (pageNumber: string) => {
    const page: number = Number(pageNumber);

    setCurrentPage(Number(page - 1));
    let switchStatement = "switch(pageNumber) {\n";
    for (const [key, value] of Object.entries(cases)) {
      switchStatement += `  case "${key}":\n`;
      switchStatement += `    ${value}\n`;
      switchStatement += "    break;\n";
    }
    switchStatement += `  default:\n`;
    switchStatement += `    setPage("${ProgressDataSet[0].page}");\n`;
    switchStatement += "}";
    // eslint-disable-next-line no-eval
    eval(switchStatement);
  };

  const handleNextPage = () => {
    if (currentPage < ProgressDataSets.length - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Define your custom CSS styles
  //   const customStyles = `
  // /* Change the color of disabled input text */
  // input:disabled {
  //   -webkit-text-fill-color: #000000 !important;
  //   color: #000000 !important;
  // }

  // /* Change the color of disabled select text */
  // .MuiInputBase-input.Mui-disabled {
  //   -webkit-text-fill-color: #000000 !important;
  //   color: #000000 !important;
  //   WebkitTextFillColor: #000000 !important;
  // }

  //  .MuiFormControlLabel-label.Mui-disabled{
  //   -webkit-text-fill-color: #000000 !important;
  //   color: #000000 !important;
  // }

  // .Mui-disabled{
  //   -webkit-text-fill-color: #000000 !important;
  //   color: #000000 !important;
  // }

  // /* Change the color of disabled radio buttons */
  // .MuiRadio-colorSecondary.Mui-disabled ~ .MuiRadio-colorSecondary.Mui-checked{
  //   -webkit-text-fill-color: #000000 !important;
  //   color: #000000 !important;
  // }

  // /* Change the color of disabled checkboxes */
  // .MuiCheckbox-colorSecondary.Mui-disabled ~ .MuiIconButton-label .MuiSvgIcon-root {
  //   -webkit-text-fill-color: #000000 !important;
  //   color: #000000 !important;
  // }
  // `;

  // Create a style element
  // const styleElement = document.createElement('style');
  // styleElement.type = 'text/css';
  // styleElement.appendChild(document.createTextNode(customStyles));

  // React.useEffect(() => {
  //   if (isViewOnly) {

  //     document.head.appendChild(styleElement);
  //   }
  // }, [isViewOnly]);

  return (
    <div id="AddBillingPlan">
      <div className="AddBillingPl_container">
        <div
          className="config_modal_form_csss usesr__department-field"
          style={{
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          <div className="config_modal_heading">
            <div className="config_modal_title"> {billingId ? "Update" : "Add"} Billing Plans</div>
            <div className="config_modal_text">
              <div>Here you can {billingId ? "Update" : "create new"} billing plans.</div>
            </div>

            <BackButton />
          </div>

          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={BillingValidation}
            onSubmit={handleFormSubmit}
          >
            {(formikBags) => {
              const dublicateError: any = formikBags?.errors;
              const firstErrorKey = Object.keys(formikBags?.errors)[0];
              const firstError = dublicateError[firstErrorKey] as unknown as string;

              currentPage === 0 &&
              (formikBags.values.title === "" || formikBags.values.description === "")
                ? setDisableNextButton(true)
                : currentPage === 1 &&
                  formikBags.values.account_type === "free" &&
                  formikBags.values.pricing_type === ""
                ? setDisableNextButton(false)
                : currentPage === 1 &&
                  (formikBags.values.account_type === "" || formikBags.values.pricing_type === "")
                ? setDisableNextButton(true)
                : currentPage === 2 && items.length <= 1
                ? setDisableNextButton(true)
                : setDisableNextButton(false);

              console.log("formikBags", formikBags.errors);

              return (
                <Form>
                  <div className="body-wrapper">
                    <MultiStepProgressBar
                      ProgressDataSet={ProgressDataSets}
                      onPageNumberClick={nextPageNumber}
                      page={ProgressDataSets[currentPage].page}
                      key={"page1"}
                    />
                    {(() => {
                      switch (ProgressDataSets[currentPage].page) {
                        case "pageone":
                          return (
                            <BillingPlanStepOne
                              formikBag={formikBags}
                              isViewOnly={isViewOnly}
                              loading={false}
                            />
                          );
                        case "pagetwo":
                          return (
                            <BillingPlanStepTwo
                              formikBag={formikBags}
                              isViewOnly={isViewOnly}
                              loading={false}
                            />
                          );
                        case "pagethree":
                          return (
                            <BillingPlanStepThree
                              setItems={setItems}
                              items={items}
                              formikBag={formikBags}
                              isViewOnly={isViewOnly}
                              loading={false}
                            />
                          );
                        case "pagefour":
                          return (
                            <BillingPlanStepFour
                              setFeaturesCheckbox={setFeaturesCheckbox}
                              featuresCheckbox={featuresCheckbox}
                              formikBag={formikBags}
                              isViewOnly={isViewOnly}
                              loading={false}
                            />
                          );
                        default:
                          return null;
                      }
                    })()}

                    <div
                      className="btn-wrapper"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0px 40px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        className="btn-save"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                        startIcon={<WestIcon />}
                      >
                        Previous
                      </Button>

                      {currentPage === ProgressDataSets.length - 1 && !isViewOnly && (
                        <LoadingButton
                          endIcon={<SendIcon />}
                          type={"submit"}
                          loading={loading}
                          disabled={isViewOnly || loading}
                          loadingPosition="end"
                          variant="contained"
                        >
                          <span>Save</span>
                        </LoadingButton>
                      )}

                      {currentPage !== ProgressDataSets.length - 1 && (
                        <Button
                          variant="contained"
                          color="primary"
                          className="btn"
                          endIcon={<EastIcon />}
                          disabled={
                            currentPage === ProgressDataSets.length - 1 || disableNextButton
                          }
                          onClick={handleNextPage}
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddBillingPlan;
