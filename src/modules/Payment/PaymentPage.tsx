import { Button, Divider, Typography } from '@mui/material';
import React from 'react';
import card from '../../assets/images/card.png';
import Paypal from '../../assets/images/paypal.png';
import Stripe from '../../assets/images/stripe.webp';

const PaymentPage: React.FC = () => {
  return (
    <div id="BillingPlans">
      <div className="billing_plan_container">
        <div className="billing_plan__heading">
          <div className="billing_plan__title">
            <Typography variant="h3" gutterBottom>
              Payment Methods
            </Typography>
          </div>
          <div className="billing_plan__text">
            <div> Add or remove payment methods.</div>
          </div>
        </div>
      </div>

      <Divider variant="middle" sx={{ mt: 3, mb: 3 }} />
      {/* <h1>Payment Page</h1> */}
      <div style={cardContainerStyle}>
        <div style={paymentCardStyle}>
          <h2
            style={{
              margin: '0 0 10px 0',
            }}>
            Card Payment
          </h2>
          <img src={card} alt="" style={PaymentCardImageStyle} />
          {/* Add card payment content here */}
          <p>Accepting all major credit cards.</p>
          {/* <button style={paymentButtonStyle}>Pay with Card</button> */}
        </div>
        <div style={paymentCardStyle}>
          <h2
            style={{
              margin: '0 0 10px 0',
            }}>
            Stripe Payment
          </h2>
          <img src={Stripe} alt="" style={PaymentCardImageStyle} />
          {/* Add Stripe payment content here */}
          <p>Secure payment with Stripe.</p>
          {/* <button style={paymentButtonStyle}>Pay with Stripe</button> */}
        </div>
        <div style={paymentCardStyle}>
          <h2
            style={{
              margin: '0 0 10px 0',
            }}>
            Paypal Payment
          </h2>
          <img src={Paypal} alt="" style={PaymentCardImageStyle} />
          {/* Add Stripe payment content here */}
          <p>Secure payment with Stripe.</p>
          {/* <button style={paymentButtonStyle}>Pay with Stripe</button> */}
        </div>
      </div>
    </div>
  );
};

const paymentPageStyle: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
};

const cardContainerStyle: React.CSSProperties = {
  display: 'flex',
  // justifyContent: 'center',
  padding: '20px',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '20px',
};

const paymentCardStyle: React.CSSProperties = {
  width: '300px',
  height: '240px',
  background: '#f0f0f0',
  borderRadius: '10px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
};

const PaymentCardImageStyle: React.CSSProperties = {
  width: '200px',
  height: '120px',
  margin: '0 auto',
};

const paymentButtonStyle: React.CSSProperties = {
  background: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '10px',
  cursor: 'pointer',
};

export default PaymentPage;
