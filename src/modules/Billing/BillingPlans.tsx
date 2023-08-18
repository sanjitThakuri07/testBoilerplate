import { Backdrop, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import BillingCard from "./card/BillingCard";
import "./BillingPlans.scss";
import AddIcon from "@mui/icons-material/Add";
import AddBillingPlan from "./AddBillingPlan";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { deleteAPI, getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { AddBillingPlanProps, BillingInitialValues } from "src/interfaces/billingPlan";
import BackButton from "src/components/buttons/back";
import { useNavigate } from "react-router-dom";
import useBillingPlanStore from "src/store/zustand/billingPlan";

interface BillingProps {
  title: string;
  description: string;
  pricing_type: string;
  account_type: string;
  monthly_price: number;
  yearly_price: number;
  quarterly_price: number;
  semiyearly_price: number;
  setup_price: number;
  ordering: any[]; // Replace 'any' with the appropriate type for the 'items' array
  no_of_organizations: number;
  no_of_users: number;
  quotation: boolean;
  booking: boolean;
  form: boolean;
  calendar: boolean;
  finance: boolean;
  analytics: boolean;
}

const initialData: BillingProps[] = [
  {
    title: "Your Product Title",
    description: "Your product description goes here",
    pricing_type: "Fixed", // Replace with 'Fixed' or 'Flexible' as per your needs
    account_type: "Premium", // Replace with the desired account type
    monthly_price: 49.99,
    yearly_price: 499.99,
    quarterly_price: 149.99,
    semiyearly_price: 299.99,
    setup_price: 29.99,
    ordering: [], // Replace '[]' with the initial array of items as per the data type you decide
    no_of_organizations: 100,
    no_of_users: 5000,
    quotation: false,
    booking: true,
    form: false,
    calendar: true,
    finance: true,
    analytics: true,
  },
];
const BillingPlans = () => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openConfirmationModal, setOpenConfirmationModal] = React.useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = React.useState<number>(0);
  const [billingPlanData, setBillingPlanData] = React.useState<BillingProps[]>(initialData);
  const [deletePlanId, setDeletePlanId] = React.useState<number>(0);
  const [initialValues, setInitialValues] =
    React.useState<AddBillingPlanProps>(BillingInitialValues);

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { fetchBillingPlans, billingPlans, loading }: any = useBillingPlanStore();

  const openDeleteConfirmation = (id: number) => {
    setDeletePlanId(id);
    setOpenConfirmationModal(true);
  };
  const handleDeleteConfirmation = () => {
    const payload = {
      config_ids: [deletePlanId],
    };
    deleteAPI(`billings/`, payload)
      .then((res) => {
        enqueueSnackbar("Billing plan deleted successfully", { variant: "success" });
      })
      .then(() => {
        setOpenConfirmationModal(false);
        getPlanDetails();
      })
      .catch((err) => {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      });
  };

  const handleEditPlan = (id: number) => {
    setOpenModal(true);
    setSelectedPlan(id);
    navigate(`/billing/edit/${id}`);
  };

  const getPlanDetails = async () => {
    await fetchBillingPlans({ changeFormat: true });
  };

  React.useEffect(() => {
    getPlanDetails().then(() => {
      setBillingPlanData(billingPlans);
    });
  }, []);

  console.log(billingPlans, "fwefew");

  return (
    <div id="BillingPlans">
      {loading && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <div className="billing_plan_container">
        <div className="billing_plan__heading">
          <div className="billing_plan__title">
            <Typography variant="h3" gutterBottom>
              Billing Plans
            </Typography>

            <div className="create_billing_plan_btn">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/billing/add");
                }}
                endIcon={<AddIcon />}
              >
                Create New
              </Button>
            </div>
          </div>
          <div className="billing_plan__text">
            <div>Create billing plans for your Tenants.</div>
          </div>
          <BackButton />
        </div>

        <Divider variant="middle" sx={{ mt: 3, mb: 3 }} />

        <div className="billing_plan_container_body">
          <Grid container spacing={4} className="formGroupItem">
            {billingPlans.map((item: any, index: number) => (
              <Grid item xs={4} key={index}>
                <BillingCard
                  onDelete={() => openDeleteConfirmation(item.id)}
                  planName={""}
                  viewPlan={() => navigate(`/billing/view/${item.id}`)}
                  is_active={false}
                  plan={item.title}
                  price={item.monthly_price}
                  planDescription={item}
                  featureList={item.featureList}
                  // onClick={openDeleteConfirmation}
                  learnMore={() => {}}
                  ediTPlan={() => handleEditPlan(item.id)}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>

      {/* <AddBillingPlan
        openModal={openModal}
        setOpenModal={() => {
          setOpenModal(!openModal);
        }}
        fetchBillingPlans={getPlanDetails}
        planId={selectedPlan}
        initialValues={initialValues}
        setInitialValues={setInitialValues}
      /> */}

      <ConfirmationModal
        openModal={openConfirmationModal}
        setOpenModal={setOpenConfirmationModal}
        confirmationIcon={"/src/assets/icons/icon-feature.svg"}
        handelConfirmation={handleDeleteConfirmation}
        confirmationHeading={`Do you want to delete this plan?`}
        confirmationDesc={`This action will permanently delete this plan. If you want to continue, please click on yes.`}
        status="warning"
      />
    </div>
  );
};

export default BillingPlans;
