import { useTextAnswer } from "src/store/zustand/globalStates/templates/TextAnswer";
import { Button, Divider, Grid, TextField, Slider } from "@mui/material";
import React, { FC } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SliderIcon from "assets/template/icons/slider.png";
import ModalLayout from "components/ModalLayout";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import ComponentWrapper, {
  LabelWrapper,
  BodyWrapper,
} from "containers/template/components/Wrapper";

type SliderProps = {
  responseTypeId?: any;
  dataItem?: any;
};

const SliderInput = ({ responseTypeId, dataItem, questionLogicShow }: any) => {
  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );
  const { selectedDataset } = useTemplateFieldsStore();

  const [open, setOpen] = React.useState<boolean>(false);
  const [isAddLogicClicked, setIsAddLogicClicked] = React.useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const [step, setStep] = React.useState<number>(dataItem?.variables?.step);
  const [minValue, setMinValue] = React.useState<number>(dataItem?.variables?.min_value);
  const [maxValue, setMaxValue] = React.useState<number>(dataItem?.variables?.max_value);
  const [sliderValue, setSliderValue] = React.useState<number>(8);

  const { setRightSectionTabValue, selectedInputType, setSelectedInputId } = useTextAnswer();

  const onClick = () => {
    setRightSectionTabValue("2");
    setOpen(!open);
    setSelectedInputId(responseTypeId);

    return;
  };

  return {
    body: (
      <>
        {questionLogicShow?.getActiveLogicQuestion()?.includes(dataItem.id) && (
          <BodyWrapper>
            <div className="question__answer-type">
              Slider -{" "}
              <span
                id="document-number-positioned-button"
                onClick={() => {
                  setOpenModal(true);
                }}
                style={{
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
              >
                {`${dataItem?.variables?.min_value} - ${dataItem?.variables?.max_value}`}
              </span>{" "}
            </div>
          </BodyWrapper>
        )}
        <ModalLayout
          id="MCRModal"
          children={
            <>
              <div className="config_modal_form_css user__department-field">
                <div className="config_modal_heading">
                  <div className="config_modal_title">Slider</div>
                  <div className="config_modal_text">
                    <div>You can define the range with the slider.</div>
                  </div>
                  <Divider />
                  <div
                    className="document_number_format"
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <div className="document_number_format_heading">Increment</div>
                    <TextField
                      variant="standard"
                      autoFocus
                      placeholder="Increment"
                      value={step}
                      sx={{ backgroundColor: "#f9fafb", width: "100%" }}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      onChange={(e: any) => setStep(e.target.value)}
                    />
                  </div>
                  <br />
                  <Slider
                    aria-label="Slider"
                    value={sliderValue}
                    style={{ width: "100%" }}
                    valueLabelDisplay="auto"
                    onChange={(e: any, value: any) => setSliderValue(value)}
                    min={Number(minValue)}
                    max={Number(maxValue)}
                    step={Number(step)}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>{minValue}</div>
                    <div>{sliderValue}</div>
                    <div>{maxValue}</div>
                  </div>
                  <div
                    className="document_number_format"
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <div className="document_number_format_heading">Range</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      <TextField
                        variant="standard"
                        autoFocus
                        placeholder="Min"
                        value={minValue}
                        sx={{ backgroundColor: "#f9fafb", width: "100%" }}
                        InputProps={{
                          disableUnderline: true,
                        }}
                        onChange={(e: any) => setMinValue(e.target.value)}
                      />
                      <TextField
                        variant="standard"
                        autoFocus
                        placeholder="Max"
                        value={maxValue}
                        sx={{ backgroundColor: "#f9fafb", width: "100%" }}
                        InputProps={{
                          disableUnderline: true,
                        }}
                        onChange={(e: any) => setMaxValue(e.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    className="document_number_format_footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <Button variant="outlined" className="buttonContainer">
                      Reset All
                    </Button>
                    <Button
                      variant="contained"
                      className="buttonContainer"
                      onClick={() => {
                        updateTemplateDatasets(dataItem, "variables", {
                          ...dataItem.variables,
                          step,
                          min_value: minValue,
                          max_value: maxValue,
                        });
                        setOpenModal(false);
                      }}
                    >
                      {" "}
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </>
          }
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </>
    ),
    label: <LabelWrapper img={SliderIcon} title="Slider" />,
  };
};

export default SliderInput;
