import { useTextAnswer } from "globalStates/templates/TextAnswer";
import React, { FC, useEffect } from "react";
import "./ChooseResponseType.scss";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import GlobalResponseItem from "../ResponseTab/GlobalResponseSet/GlobalResponseItem";
import MultipleResponseItem from "../ResponseTab/MultipleChoiceResponse/MultipleResponseItem";
import ExternalResponseItem from "../ResponseTab/ExternalResponse/ExternalResponseItem";
import InternalResponseItem from "../ResponseTab/InternalResponse/InternalResponseItem";
import Slider from "../InputComponents/Slider";
import InspectionDate from "../InputComponents/InspectionDate";
import DateTime from "../InputComponents/DateTime";
import DocumentNumber from "../InputComponents/DocumentNumber";
import TextAnswer from "../InputComponents/TextAnswer";
import Temperature from "../InputComponents/Temperature";
import Annotation from "../InputComponents/Annotation";
import Number from "../InputComponents/Number";
import Instruction from "../InputComponents/Instruction";
import Checkbox from "../InputComponents/Checkbox";
import SpeechRecognition from "../InputComponents/SpeechRecognition";
import Location from "../InputComponents/Location";
import Signature from "../InputComponents/Signature";
import Media from "../InputComponents/Media";

export const textFieldStyle = {
  // backgroundColor: '#f9fafb',
  // // height: '100%',
  // borderRadius: '8px',
  // border: '1px solid #e4e6eb',
  // padding: '5px 10px',
  // display: 'flex',
  // alignItems: 'center',
  // cursor: 'pointer',
  // justifyContent: 'space-between',
};

interface ResponseTypeProps {
  id?: string;
  type?: string;
  responseTypeId?: string | undefined;
  dataItem?: any;
}

const ChooseResponseType = ({
  responseTypeId,
  id,
  type,
  dataItem,
  multipleResponseData,
  globalResponseData,
  internalResponseData,
  externalResponseData,
  questionLogicShow,
  logic,
}: any) => {
  const { setRightSectionTabValue, selectedInputType } = useTextAnswer();
  const [open, setOpen] = React.useState(false);

  const onClick = () => {
    setRightSectionTabValue("2");
    setOpen(!open);
    // setSelectedInputId(responseTypeId);
    return;
  };

  if (dataItem?.response_choice === "multiple") {
    var multipleResponseItem = multipleResponseData?.find(
      (multipleResponseItem: any) => multipleResponseItem.id === dataItem?.response_type,
    );
  }
  if (dataItem?.response_choice === "global") {
    var globalResponseItem = globalResponseData?.find(
      (globalResponseItem: any) => globalResponseItem.id === dataItem?.response_type,
    );
  }

  if (dataItem?.response_choice === "internal") {
    var internalResponseItem = internalResponseData?.find(
      (internalResponseItem: any) => internalResponseItem.id === dataItem?.response_type,
    );
  }

  if (dataItem?.response_choice === "external") {
    var externalResponseItem = externalResponseData?.find(
      (externalResponseItem: any) => externalResponseItem.id === dataItem?.response_type,
    );
  }

  const testObj: any = {
    TEXT_001: TextAnswer({ dataItem, questionLogicShow: questionLogicShow }),
    INSPECT_001: InspectionDate({ dataItem, questionLogicShow: questionLogicShow }),
    DATE_001: DateTime({ dataItem, questionLogicShow: questionLogicShow }),
    DOC_001: DocumentNumber({ dataItem, questionLogicShow: questionLogicShow }),
    SLID_001: Slider({ dataItem, questionLogicShow: questionLogicShow }),
    TEMP_001: Temperature({ dataItem, questionLogicShow: questionLogicShow }),
    ANNOT_001: <Annotation dataItem={dataItem} />,
    CHECK_001: Checkbox({ dataItem, questionLogicShow: questionLogicShow }),
    SPEECH_001: SpeechRecognition({ dataItem, questionLogicShow: questionLogicShow }),
    LOC_001: <Location dataItem={dataItem} />,
    NUM_001: Number({ dataItem, questionLogicShow: questionLogicShow }),
    SIGN_001: Signature({ dataItem, questionLogicShow: questionLogicShow }),
    INSTRUCT_001: Instruction({ dataItem, questionLogicShow: questionLogicShow }),
    MEDIA_001: Media({ dataItem, questionLogicShow: questionLogicShow }),

    multiple: MultipleResponseItem({
      multipleResponseItem: multipleResponseItem,
      open: open,
      onClick: onClick,
    }),
    global: GlobalResponseItem({
      globalResponseItem: globalResponseItem,
      open: open,
      onClick: onClick,
    }),
    internal: InternalResponseItem({
      internalResponseItem: internalResponseItem,
      open: open,
      onClick: onClick,
    }),
    external: ExternalResponseItem({
      externalResponseItem: externalResponseItem,
      open: open,
      onClick: onClick,
    }),
  };

  const customCheckClassNames = ["multiple", "global", "internal", "external"];

  return {
    body: (
      <div
        key={id}
        className={`fake_custom_select_field fake_custom_select_field-body ${
          dataItem.response_choice !== "default" &&
          customCheckClassNames.includes(dataItem.response_choice)
            ? "changes__logic-container"
            : ""
        }`}
      >
        {dataItem.response_choice === "default" && testObj?.[`${dataItem?.response_type}`]?.body}
        {/* {testObj?.[`${dataItem?.response_choice}`]?.body} */}
      </div>
    ),
    label: (
      <>
        {dataItem.response_choice === "default" && testObj?.[`${dataItem?.response_type}`]?.label}
        {testObj?.[`${dataItem?.response_choice}`]?.label}
      </>
    ),
  };
};

export default ChooseResponseType;
