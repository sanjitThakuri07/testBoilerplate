import { Box } from '@mui/system';
import React from 'react';
import DragAndDrop from './DragAndDrop';
import InvoiceBillingForm from './InvoiceBillingForm';
import InvoiceDraftForm from './invoiceDraftForm';
import './invoiceGenerate.scss';
import InvoiceGenerateHeading from './invoiceGenerateHeading';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@mui/material';
import { useAdjustmentModal } from 'globalStates/invoice/invoice';

const InvoiceGenerate = () => {
  const [isInvoiceSend, setIsInvoiceSend] = React.useState<boolean>(false);
  const { adjustmentModal, setAdjustmentModal } = useAdjustmentModal();

  // console.log(isInvoiceSend, 'isInvoiceSend');
  return (
    <div id="invoiceGenerate">
      <Box
        sx={{
          p: 2,
        }}>
        {/* <DragAndDrop /> */}
        <InvoiceGenerateHeading />
      </Box>
      <Box
        sx={{
          m: 2,
          backgroundColor: '#FCFCFD',
        }}>
        <InvoiceDraftForm />

        <Button
          variant="outlined"
          sx={{
            mr: 2,
            float: 'right',
            mb: 2,
          }}
          onClick={() => setAdjustmentModal(true)}>
          Add Price Adjustment{' '}
        </Button>
        <DndProvider backend={HTML5Backend}>
          <InvoiceBillingForm />
        </DndProvider>
      </Box>
    </div>
  );
};

export default InvoiceGenerate;
