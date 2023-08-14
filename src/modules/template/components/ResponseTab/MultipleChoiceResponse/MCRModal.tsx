import { Checkbox, Divider, FormControlLabel, FormGroup } from "@mui/material";
import ModalLayout from "src/components/ModalLayout";
import React from "react";
import MCRForm from "./MCRForm";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface MCRModalProps {
  openModal: boolean;
  setOpenModal: () => void;
  responseSetId: number | null;
  updateState?: Function;
  disabled?: boolean;
}

const MCRModal = ({
  openModal,
  setOpenModal,
  responseSetId,
  updateState,
  disabled,
}: MCRModalProps) => {
  const [scoring, setScoring] = React.useState<boolean>(false);
  const handleTextValue = (value: string) => {};

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div id="MCRModal">
          <ModalLayout
            id="MCRModal"
            children={
              <>
                <div className="config_modal_form_css user__department-field">
                  <div className="config_modal_heading">
                    <div className="config_modal_title">Multiple Choice Responses</div>
                    <div className="config_modal_text">
                      <div>For example : Yes, No or N/A.</div>
                      <div>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={scoring}
                                onChange={(e) => setScoring(e.target.checked)}
                              />
                            }
                            label="Scoring"
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <MCRForm
                    responseSetId={responseSetId}
                    scoringData={scoring}
                    setOpenModal={setOpenModal}
                    updateState={updateState}
                    disabled={disabled}
                  />
                </div>
              </>
            }
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default MCRModal;
