import React, { forwardRef, useRef, useState } from 'react';

import ReactToPrint from 'react-to-print';

function PrintButton({ setIsPrinting, buttonName, setIsPrintAll, children }: any, ref: any) {
  const printRef = useRef<any>();

  const [render, setRender] = useState(false);

  return (
    <div
      style={{
        display: 'flex',

        flexDirection: render ? 'column' : 'row',

        justifyContent: 'center',

        alignItems: 'center',

        gap: 10,

        marginTop: 10,
      }}>
      <div ref={printRef} style={{ display: render ? '' : 'none' }}>
        <div>{children}</div>
      </div>

      <div style={{ display: 'block', gap: 10 }}>
        <ReactToPrint
          trigger={() => <button>{buttonName ?? ' Print'}</button>}
          content={() => printRef.current}
          onBeforeGetContent={async () => {
            setIsPrinting(true);

            setRender(true);
          }}
          onAfterPrint={() => {
            setIsPrinting(false);

            setRender(false);
          }}
          documentTitle="Main Form"
          pageStyle="

                    @page { size: A4; margin: 4mm; }

                    @media print {

                      body { -webkit-print-color-adjust: exact; padding: 4px !important;}

                      .pagebreak { page-break-before: avoid; }

                    } "
        />
      </div>
    </div>
  );
}

export default forwardRef(PrintButton);
