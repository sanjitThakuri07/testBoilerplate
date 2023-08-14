import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Pdf from 'react-to-pdf';

const App = ({ children }) => {
  const componentRef = useRef(null);

  const generatePDF = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('myDocument.pdf');
    });
  };

  return (
    <div>
      <MyComponent ref={componentRef}>{children}</MyComponent>
      <Pdf targetRef={componentRef} filename="code-example.pdf">
        {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
      </Pdf>
    </div>
  );
};

const MyComponent = React.forwardRef((props, ref) => (
  <div ref={ref}>
    {/* Your custom component JSX here */} {props.children}
  </div>
));

export default App;
