import { Box, Button, Grid, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import RevCard from 'containers/finance/invoices/Form/Card';
import InvoiceForm from 'containers/finance/invoices/Form';
import IndexStack from 'containers/finance/invoices/indexstack';
import { useLocation } from 'react-router-dom';
import useInvoiceStore from 'store/invoice';

const Index = () => {
  const location = useLocation();
  const { changeInvoiceStatus, getAnalytics, analytics, loading }: any = useInvoiceStore();

  useEffect(() => {
    if (location.pathname.includes('/invoice/invoices')) {
      (async () => {
        console.log('here');
        await getAnalytics({});
      })();
    }
  }, []);
  return (
    <>
      <IndexStack />
      <Box sx={{ width: '100%', marginTop: '0px', marginLeft: '10px' }}>
        {!(location?.pathname === '/finance/invoice/to-be-invoiced') && (
          <Grid container spacing={2} style={{ marginLeft: '10px' }}>
            <Grid item xs={4}>
              <RevCard
                content="0"
                title="Total Receivables Received"
                sidepill={`Overdue: $${loading ? '0' : analytics?.overdue || 0}`}
                numerator={`$${loading ? '0' : analytics?.total_paid || 0}`}
                denominator={`$${loading ? '0' : analytics?.total_amount || 0}`}
                // subpill="+1.50% /month"
                progressvalue={
                  (Number(analytics?.total_paid) / Number(analytics?.total_amount || 0)) * 100
                }
                progressbar={true}
              />
            </Grid>
            <Grid item xs={2}>
              <RevCard
                content="0"
                title="Total Invoices"
                // pill="+1.50% /month"
                numerator={`$${loading ? '0' : analytics?.total_amount || 0}`}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h1">
                <RevCard
                  content="0"
                  title="Paid Invoices"
                  numerator={`$${loading ? '0' : analytics?.total_paid || 0}`}
                />
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>

      <InvoiceForm />
    </>
  );
};
export default Index;
