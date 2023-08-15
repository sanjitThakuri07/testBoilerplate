import { useTextAnswer } from "globalStates/templates/TextAnswer";
import React, { FC } from "react";
import "./ChooseResponseType.scss";
import TextAnswerIcon from "src/assets/template/icons/Text_answer.png";
import { ReactComponent as RightIcon } from "src/assets/icons/right_arrow.svg";

interface ResponseTypeProps {
  id?: string;
  type?: string;
  responseTypeId?: string | undefined;
}

const TextAnswer: FC<ResponseTypeProps> = ({ responseTypeId, id, type }) => {
  console.log({ responseTypeId, id, type });
  const { setRightSectionTabValue, selectedInputType } = useTextAnswer();
  const [open, setOpen] = React.useState(false);

  const onClick = () => {
    setRightSectionTabValue("2");
    setOpen(!open);
    // setSelectedInputId(responseTypeId);
    return;
  };

  return (
    <div className={`${open && "response_type_border"} response_type_wrapper`} onClick={onClick}>
      <div className="response_type_inner">
        <img src={TextAnswerIcon} style={{ height: "26px", width: "26px" }} alt="text_answer" />
        <div className="inner_text">{selectedInputType?.name || "Choose Response Type"}</div>
      </div>
      <div
        style={{
          transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          transition: "all duration 0.2s ease",
        }}
      >
        <RightIcon />
      </div>
    </div>
  );
};

export default TextAnswer;
