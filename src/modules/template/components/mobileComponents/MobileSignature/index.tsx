import { Button, Divider, TextField } from "@mui/material";
import { Box } from "@mui/system";
import SignaturePad from "react-signature-canvas";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ModalLayout from "src/components/ModalLayout";
import { useEffect, useRef, useState } from "react";
import UploadImage from "../MobileMedia/UploadImage";
import { useTemplateFieldsStore } from "src/store/zustand/templates/templateFieldsStore";
import { postAPI } from "src/lib/axios";
import ErrorComponent from "src/components/Error";
import { errorValue } from "src/modules/template/validation/inputLogicCheck";
import ExtraUserFields from "../ReusableMobileComponent/ExtraUserFields";

const MobileSignature = ({
  value,
  onChange,
  item,
  handleFormikFields,
  errors,
  disabled,
  ...rest
}: any) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [signatureType, setSignatureType] = useState<string>("");
  const [imageURL, setImageURL] = useState<any>(""); // create a state that will contain our image url
  // const templatesMedia = useTemplateStore((state: any) => state?.templatesMedia);
  const { updateTemplateDatasets } = useTemplateFieldsStore();
  const [templatesMedia, setTemplatesMedia] = useState<any>([]); // create a state that will contain our image url
  const sigCanvas: any = useRef({});
  const clear = () => sigCanvas.current.clear();
  // const save = () => setImageURL(sigCanvas.current.getTrimmedCanvas().toBlob('image/png'));

  const save = () => {
    const signatureData = sigCanvas.current.toDataURL("image/png");
    const binaryData = atob(signatureData.split(",")[1]);
    const array = [];
    for (let i = 0; i < binaryData.length; i++) {
      array.push(binaryData.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: "image/png" });
    setImageURL(blob);
  };

  const getBlob = () => {
    const signatureData = sigCanvas.current.toDataURL("image/png");
    const binaryData = atob(signatureData.split(",")[1]);
    const array = [];
    for (let i = 0; i < binaryData.length; i++) {
      array.push(binaryData.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: "image/png" });
    return blob;
  };

  const handleImage = (imagePreview: any, file: any) => {
    postTemplateMedia({ id: item.id, files: file });
    setImageURL(imagePreview);
  };
  const postTemplateMedia = async (values: any) => {
    const formData = new FormData();
    formData.append("id", values.id);
    formData.append("files", values.files);
    const response = await postAPI("/templates/upload-media/", formData);
    if (response) {
      setSignatureType("");
      setOpenModal(false);
    }

    // setTemplatesMedia(response.data?.media);
    handleFormikFields.setFieldValue(
      `${item?.component}__${item.id}.file_value`,
      response.data?.media,
    );
  };

  useEffect(() => {
    updateTemplateDatasets(item, "file_value", templatesMedia[0]);
  }, [templatesMedia]);

  return (
    <div id="MobileSignature">
      <div style={{ width: "100%" }}>
        <ModalLayout
          id="MCRModal"
          children={
            <div className="config_modal_form_css user__department-field">
              <div className="config_modal_heading">
                <div className="config_modal_title">Signature</div>

                <Divider />
                {signatureType === "" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div
                      onClick={() => setSignatureType("upload")}
                      style={{ padding: "0.5rem", cursor: "pointer" }}
                    >
                      Upload Signature
                    </div>
                    <div
                      onClick={() => setSignatureType("draw")}
                      style={{ padding: "0.5rem", cursor: "pointer" }}
                    >
                      Draw Signature
                    </div>
                  </div>
                )}
                {signatureType === "upload" && (
                  <div style={{ padding: "3rem 1rem" }}>
                    <UploadImage handleImage={handleImage} />
                  </div>
                )}
                {signatureType === "draw" && (
                  <div style={{ width: "100%" }}>
                    <SignaturePad
                      ref={sigCanvas}
                      canvasProps={{
                        width: "430%",
                        className: "signatureCanvas",
                      }}
                    />
                    <div
                      className="document_number_format_footer"
                      style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}
                    >
                      <Button
                        variant="contained"
                        className="buttonContainer"
                        onClick={() => {
                          save();
                          handleImage(getBlob(), getBlob());
                          setOpenModal(false);
                          setSignatureType("");
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        className="buttonContainer"
                        onClick={() => {
                          clear();
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                    {/* <button onClick={close}>Close</button> */}
                  </div>
                )}
              </div>
            </div>
          }
          openModal={openModal}
          setOpenModal={() => {
            setOpenModal(false);
            setSignatureType("");
          }}
        />
      </div>

      <div className="mobile_component_box_wrapper_heading">{item.label}</div>
      <TextField
        fullWidth
        id="fullWidth"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={disabled ? "disabled" : ""}
        {...rest}
      />
      {!disabled && (
        <Box sx={{ mt: 1 }}>
          <Button
            variant="contained"
            className="buttonContainer my-3"
            onClick={() => {
              setOpenModal(true);
              // updateTemplateDatasets(dataItem, 'variables', {
              //   ...dataItem.variables,
              //   step,
              //   min_value: minValue,
              //   max_value: maxValue,
              // });
              // setOpenModal(false);
            }}
          >
            {" "}
            <BorderColorOutlinedIcon /> Sign
          </Button>
        </Box>
      )}
      {imageURL.length ||
      handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.file_value ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <a
            href={`${process.env.VITE_HOST_URL}/${
              handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.file_value
            }`}
            target="_blank"
            style={{ color: "steelblue" }}
          >
            <img
              src={
                `${process.env.VITE_HOST_URL}/${
                  handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.file_value
                }?timestamp=${Date.now()}` || `${imageURL}`
              }
              alt="my signature"
              style={{
                display: "block",
                border: "1px solid #777",
                padding: "0.3rem",
                margin: "0.5rem",
                width: "50px",
                height: "50px",
              }}
            />
          </a>
          <span
            style={{ color: "red", textDecoration: "underline", fontSize: "0.7rem" }}
            onClick={() => {
              setImageURL([]);
              setTemplatesMedia([]);
              handleFormikFields.setFieldValue(`${item?.component}__${item.id}.file_value`, "");
            }}
          >
            Remove
          </span>
        </div>
      ) : null}
      <>
        {errors &&
          errorValue?.map((err: any) => {
            return Object?.keys(errors || [])?.includes(err) ? (
              <ErrorComponent>{errors?.[err]}</ErrorComponent>
            ) : (
              <></>
            );
          })}
      </>
      <div>
        <ExtraUserFields item={item} handleFormikFields={handleFormikFields} disabled={disabled} />
      </div>
    </div>
  );
};

export default MobileSignature;
