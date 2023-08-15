import { Divider } from "@mui/material";
import React, { useEffect } from "react";
import InstructionIcon from "src/assets/template/icons/instruction.png";
import ModalLayout from "src/components/ModalLayout";
import { useTemplateFieldsStore } from "src/modules/template/store/templateFieldsStore";
import BASTooltip from "src/components/BASTooltip/BASTooltip";
import InfoIcon from "@mui/icons-material/Info";
import UploadImage from "../mobileComponents/MobileMedia/UploadImage";
import { postAPI } from "src/lib/axios";
import { LabelWrapper, BodyWrapper } from "src/modules/template/components/Wrapper";

type InstructionProps = {
  responseTypeId?: any;
  dataItem?: any;
};

const Instruction = ({ dataItem, questionLogicShow }: any) => {
  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );

  const [imageURL, setImageURL] = React.useState<any>(null);
  const [templatesMedia, setTemplatesMedia] = React.useState([]);

  const extension =
    dataItem.file_path?.split("/").pop()?.split(".")[1] ||
    imageURL?.file_path?.split("/").pop()?.split(".")[1];
  const fileName = dataItem.file_path?.split("/").pop() || imageURL?.file_path?.split("/").pop();
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const handleImage = (imagePreview: any, file: any) => {
    setImageURL(imagePreview);
    postTemplateMedia({ id: dataItem.id, files: file });
  };

  const postTemplateMedia = async (values: any) => {
    const formData = new FormData();
    formData.append("id", values.id);
    formData.append("files", values.files);
    const response = await postAPI("/templates/upload-media/", formData);

    setTemplatesMedia(response.data?.media);
  };

  useEffect(() => {
    if (templatesMedia.length) {
      updateTemplateDatasets(dataItem, "file_path", templatesMedia[0]);
    }
  }, [templatesMedia]);

  return {
    body: (
      <>
        {questionLogicShow?.getActiveLogicQuestion()?.includes(dataItem.id) && (
          <BodyWrapper>
            <div
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              className="instruction__component-body"
            >
              <span onClick={() => setOpenModal(true)}>Upload media attachment</span>
              <span className="toolTip__container">
                <BASTooltip
                  label="One image or PDF document can be uploaded."
                  tooltipPlacement={"right"}
                >
                  <InfoIcon />
                </BASTooltip>
              </span>
            </div>
          </BodyWrapper>
        )}

        {(imageURL || dataItem.file_path) && ["pdf"].includes(extension) ? (
          <a
            href={`${process.env.VITE_HOST_URL}/${dataItem?.file_path}`}
            target="_blank"
            style={{ color: "steelblue" }}
          >
            {fileName}
          </a>
        ) : imageURL || dataItem.file_path ? (
          <img
            src={`${process.env.VITE_HOST_URL}/${dataItem?.file_path}` || `${imageURL}`}
            alt="image"
            style={{
              display: "block",
              border: "1px solid #777",
              padding: "0.3rem",
              margin: "0.5rem",
              width: "50px",
              height: "50px",
            }}
          />
        ) : null}

        <ModalLayout
          id="MCRModal"
          children={
            <>
              <div className="config_modal_form_css user__department-field">
                <div className="config_modal_heading">
                  <div className="config_modal_title">Upload Image</div>
                  <div className="config_modal_text">
                    {/* <div>You can define the range with the slider.</div> */}
                  </div>
                  <Divider />
                  <UploadImage handleImage={handleImage} />
                </div>
              </div>
            </>
          }
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </>
    ),
    label: <LabelWrapper img={InstructionIcon} title="Instruction" />,
  };
};

export default Instruction;
