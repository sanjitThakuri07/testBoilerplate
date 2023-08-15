import BackButton from "src/components/buttons/back";
import { Box } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs, Button, Divider, Typography } from "@mui/material";
import "./invoiceGenerate.scss";
import ModalLayout from "src/components/ModalLayout";
import PriceAdjustmentForm from "./PriceAdjustmentForm";
import {
  useAdjustmentModal,
  useBillingInvoceData,
  useDraftTriggered,
  useUpdatingAdjustment,
} from "src/store/zustand/globalStates/invoice/invoice";

interface MCRModalProps {
  openModal: boolean;
  setOpenModal: () => void;
  responseSetId: number | null;
  handleDraftSave: () => void;
}
const InvoiceGenerateHeading = () => {
  // const [openModal, setAdjustmentModal] = React.useState<boolean>(false);
  const { invoiceData } = useBillingInvoceData();

  const { adjustmentModal, setAdjustmentModal } = useAdjustmentModal();

  const { setIsDraftTriggered } = useDraftTriggered();

  const { updatingAdjustmentId, setUpdatingAdjustmentId } = useUpdatingAdjustment();

  React.useEffect(() => {
    if (updatingAdjustmentId) {
      setAdjustmentModal(true);
    }
  }, [updatingAdjustmentId]);

  const breadcrumbs = [
    <Link key="0" to="/">
      <img src="src/assets/icons/home.svg" alt="home" height={16} />
    </Link>,

    <Typography key="3" color="text.primary">
      <Link
        to="/finance/invoice"
        style={{
          textDecoration: "none",
        }}
      >
        {" "}
        All invoice
      </Link>
    </Typography>,
    <Typography key="4" color="text.primary">
      Invoice ID : {invoiceData?.invoice_number}
    </Typography>,
  ];
  return (
    <div id="InvoiceGenerateHeading">
      <Box>
        <BackButton />
        <Breadcrumbs
          sx={{
            backgroundColor: "#FCFCFD",
            borderRadius: "8px",
            p: 2,
            display: "table",
          }}
          separator={<img src="src/assets/icons/chevron-right.svg" alt="right" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
        <div className="generate_invoice_heading">
          <div className="generate_invoice_heading_left_side">
            <Typography variant="subtitle1">Generate Invoice</Typography>
            <Typography variant="caption" gutterBottom>
              Add all the fields details here.
            </Typography>
          </div>
          <div className="generate_invoice_heading_right_side">
            {/* <Button
              variant="outlined"
              sx={{
                mr: 2,
              }}
              onClick={() => setAdjustmentModal(true)}>
              Add Price Adjustment{' '}
            </Button> */}
            <Button
              variant="contained"
              onClick={() => {
                setIsDraftTriggered(true);
              }}
            >
              Save as Draft
            </Button>
          </div>
        </div>
        <Divider
          sx={{
            mt: 2.5,
          }}
        />
      </Box>

      <ModalLayout
        id="PriceAdjustmentFormModal"
        children={
          <>
            <div className="config_modal_form_css user__department-field">
              <div className="config_modal_heading">
                <div className="config_modal_title">Add Price Adjustment </div>
                <div className="config_modal_text">
                  <div>Please add your price adjustment details here.</div>
                </div>
              </div>
              <PriceAdjustmentForm
                modalState={(e: any) => {
                  setAdjustmentModal(false);
                }}
                afterSubmit={(e: any) => {
                  setAdjustmentModal(false);
                }}
              />
            </div>
          </>
        }
        openModal={adjustmentModal}
        setOpenModal={setAdjustmentModal}
      />
    </div>
  );
};

export default InvoiceGenerateHeading;
