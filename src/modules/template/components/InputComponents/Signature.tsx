import { useTextAnswer } from 'globalStates/templates/TextAnswer';
import { Button, Divider, Grid } from '@mui/material';
import React, { FC } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SignatureIcon from 'assets/template/icons/signature.png';
import ModalLayout from 'components/ModalLayout';
import { useTemplateFieldsStore } from 'containers/template/store/templateFieldsStore';
import ComponentWrapper, {
  LabelWrapper,
  BodyWrapper,
} from 'containers/template/components/Wrapper';

type SignatureProps = {
  responseTypeId?: any;
  dataItem?: any;
};

const Signature = ({ responseTypeId, dataItem, questionLogicShow }: any) => {
  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );
  const { selectedDataset } = useTemplateFieldsStore();

  const [open, setOpen] = React.useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const { setRightSectionTabValue, selectedInputType, setSelectedInputId } = useTextAnswer();

  const onClick = () => {
    setRightSectionTabValue('2');
    setOpen(!open);
    setSelectedInputId(responseTypeId);

    return;
  };

  const textFieldStyle = {
    border: selectedDataset?.id === dataItem?.id ? '1px solid black' : '1px solid #e4e6eb',
  };
  return {
    body: (
      <>
        <BodyWrapper></BodyWrapper>

        <ModalLayout
          id="MCRModal"
          children={
            <>
              <div className="config_modal_form_css user__department-field">
                <div className="config_modal_heading">
                  <div className="config_modal_title">Signature</div>
                  <div className="config_modal_text">
                    <div>You can define the range with the slider.</div>
                  </div>
                  <Divider />
                  <div
                    className="document_number_format"
                    style={{
                      marginTop: '20px',
                    }}>
                    <div className="document_number_format_heading">Increment</div>
                  </div>
                  <br />

                  <div
                    className="document_number_format"
                    style={{
                      marginTop: '20px',
                    }}>
                    <div className="document_number_format_heading">Range</div>
                  </div>

                  <div
                    className="document_number_format_footer"
                    style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <Button variant="outlined" className="buttonContainer">
                      Reset All
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
    label: <LabelWrapper img={SignatureIcon} title="Signature" />,
  };
};

export default Signature;
