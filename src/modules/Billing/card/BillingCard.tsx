import { Button, Card, Checkbox, FormControlLabel, IconButton, Typography } from "@mui/material";
import React from "react";
import BillingIcon from "src/assets/icons/billingIcon.svg";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";

interface BillingCardProps {
  id?: number;
  is_active: boolean;
  plan: string;
  planName: string;
  price: string;
  planDescription: string;
  featureList: string[];
  onClick?: () => void;
  learnMore: () => void;
  ediTPlan: () => void;
  onDelete: () => void;
  viewPlan: () => void;
}

const BillingCard = ({
  id,
  is_active = false,
  plan,
  price,
  planDescription,
  featureList,
  onClick,
  learnMore,
  ediTPlan,
  planName,
  onDelete,
  viewPlan,
}: BillingCardProps) => {
  // const checkboxItems = Object.keys(planDescription).filter((item) => {
  //   return item.includes('analytics');
  // });

  const {
    booking,
    finance,
    form,
    analytics,
    quotation,
    calendar,
    pricing_type,
    quarterly_price,
    semiyearly_price,
    yearly_price,
    monthly_price,
    account_type,
  }: any = planDescription;

  const checkboxItems: any = {
    booking,
    finance,
    form,
    analytics,
    quotation,
    calendar,
  };

  const pricing =
    pricing_type === "monthly"
      ? monthly_price
      : pricing_type === "yearly"
      ? yearly_price
      : pricing_type === "quarterly"
      ? quarterly_price
      : pricing_type === '"halfYearly"'
      ? semiyearly_price
      : "";

  // Object.keys(pricing)..forEach((item) => {
  //   if (pricing[item] === 0) {
  //     delete pricing[item];
  //   }

  // console.log(pricing, 'pricing');

  return (
    <div id="BillingCard">
      <div className={`BillingCard_container  ${is_active && "BillingCard_container_active"}`}>
        <div className="Billingdiv_card">
          <div
            className="Billingdiv_card_heading"
            style={{
              position: "relative",
            }}
          >
            {plan}{" "}
            <IconButton
              onClick={onDelete}
              style={{
                position: "absolute",
                top: "-15px",
                right: "0",
              }}
            >
              <ClearIcon
                style={{
                  border: "1px solid #C1C6D4",
                  borderRadius: "50%",
                  color: "#C1C6D4",
                }}
              />
            </IconButton>
          </div>

          <div className="BillingCard_inner_card">
            <div className="BillingCard inner_card_heading">
              <div className="BillingCard inner_card_img">
                <img src={BillingIcon} alt="" />
              </div>
              {/* <div className="BillingCard_inner_card_title">{planName}</div> */}
            </div>

            <div className="BillingCard_inner_card_container">
              <div className="BillingCard_inner_card_price">
                {account_type === "free" ? (
                  <>
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: 600,
                        marginRight: "5px",
                      }}
                    >
                      FREE
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: 600,
                        marginRight: "5px",
                      }}
                    >
                      ${pricing}
                    </span>{" "}
                    {pricing_type === "monthly"
                      ? "per month"
                      : pricing_type === "yearly"
                      ? "per year"
                      : pricing_type === "quarterly"
                      ? "per quarter"
                      : pricing_type === '"halfYearly"'
                      ? "per half year"
                      : ""}
                  </>
                )}
              </div>

              <div className="BillingCard_inner_card_text">
                {featureList?.map((item, index) => {
                  return (
                    <div className="BillingCard_inner_card_list" key={index}>
                      {" "}
                      <CheckCircleOutlineIcon className="BillingCard_inner_card_text_icon" /> {item}
                    </div>
                  );
                })}
              </div>
              <div className="Billingdiv_card_text">
                {Object.keys(checkboxItems).map((item: any, index: number) => {
                  return (
                    <div
                      className="BillingCard_inner_card_list"
                      key={index}
                      style={{
                        marginTop: "8px",
                      }}
                    >
                      {" "}
                      {checkboxItems[item] ? (
                        <CheckCircleOutlineIcon className="billing_card_checkbox" />
                      ) : (
                        <ClearIcon
                          className="billing_card_checkbox"
                          style={{
                            border: "1px solid #C1C6D4",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                      <span
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
                {/* <FormControlLabel
                  control={<Checkbox checked={true} inputProps={{ 'aria-label': 'controlled' }} />}
                  label="Booking"
                /> */}
              </div>

              <div className="BillingCard_inner_card_btn">
                <Button variant="outlined" color="primary" size="small" onClick={viewPlan}>
                  View
                </Button>
                <Button
                  className="edit_plan_btn"
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    ediTPlan();
                  }}
                  style={{
                    marginLeft: "10px",
                    background: "#C1C6D4",
                  }}
                >
                  Edit Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingCard;
