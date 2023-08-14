import React from 'react';
import DateTime from '../InputComponents/DateTime';

const ChooseResponseLable = ({ dataItem }: any) => {
  const testObj: any = {
    // TEXT_001: <TextAnswer dataItem={dataItem} />,
    // INSPECT_001: <InspectionDate dataItem={dataItem} />,
    DATE_001: DateTime({ dataItem: dataItem }),
    // DOC_001: <DocumentNumber dataItem={dataItem} />,
    // SLID_001: <Slider dataItem={dataItem} />,
    // TEMP_001: <Temperature dataItem={dataItem} />,
    // ANNOT_001: <Annotation dataItem={dataItem} />,
    // CHECK_001: <Checkbox dataItem={dataItem} />,
    // SPEECH_001: <SpeechRecognition dataItem={dataItem} />,
    // LOC_001: <Location dataItem={dataItem} />,
    // NUM_001: <Number dataItem={dataItem} />,
    // SIGN_001: <Signature dataItem={dataItem} />,
    // INSTRUCT_001: <Instruction dataItem={dataItem} />,
    // MEDIA_001: <Media dataItem={dataItem} />,

    // multiple: (
    //   <>
    //     <MultipleResponseItem
    //       multipleResponseItem={multipleResponseItem}
    //       open={open}
    //       onClick={onClick}
    //     />
    //   </>
    // ),
    // global: (
    //   <>
    //     <GlobalResponseItem globalResponseItem={globalResponseItem} open={open} onClick={onClick} />
    //   </>
    // ),
    // internal: (
    //   <>
    //     <InternalResponseItem
    //       internalResponseItem={internalResponseItem}
    //       open={open}
    //       onClick={onClick}
    //     />
    //   </>
    // ),
    // external: (
    //   <>
    //     <ExternalResponseItem
    //       externalResponseItem={externalResponseItem}
    //       open={open}
    //       onClick={onClick}
    //     />
    //   </>
    // ),
  };
  return (
    <div>
      {' '}
      {dataItem.response_choice === 'default' && testObj?.[`${dataItem?.response_type}`]}
      {testObj?.[`${dataItem?.response_choice}`]}
    </div>
  );
};

export default ChooseResponseLable;
