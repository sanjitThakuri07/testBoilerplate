import React, { useState } from "react";
import { useTemplateFieldsStore } from "src/modules/template/store/templateFieldsStore";
import { InputLabel, TextField } from "@mui/material";
import TextEditor from "src/components/TextEditor/TextEditor";
import BASTooltip from "src/components/BASTooltip/BASTooltip";
// import DeleteIcon from "src/assets/DeleteI";
import RefreshIcon from "src/assets/template/icons/refresh.svg";
import DeleteIcon from "src/assets/template/icons/trash.svg";

export default function TemplateImageContainer({
  imgPreview,
  imageLabel,
  setImageLabel,
  replaceImageHandler,
  removeImageHandler,
  dataItem,
  editorKey,
}: any) {
  const [isQuestionFocused, setIsQuestionFocused] = useState<boolean>(false);
  return (
    <>
      <div id="TextAnswer">
        <div className="TextAnswer_wrapper">
          <div className="template-image-flex-items">
            <div className="draggable_icon">
              <img src="/src/assets/icons/dots.svg" alt="Drag" />
            </div>

            <div className="image-container-template">
              <div className="image-container-template-inner">
                <div className="image-title-container">
                  {!isQuestionFocused ? (
                    <InputLabel
                      htmlFor="Question"
                      onClick={() => {
                        setIsQuestionFocused(true);
                      }}
                    >
                      <div className="label-heading">{imageLabel ? imageLabel : "Label"}</div>
                    </InputLabel>
                  ) : (
                    <div className="image-text-field">
                      <TextField
                        variant="standard"
                        autoFocus
                        name="annotationLabel"
                        value={imageLabel}
                        sx={{ backgroundColor: "#f9fafb", width: "100%" }}
                        InputProps={{
                          disableUnderline: true,
                        }}
                        onChange={(event) => setImageLabel(event.target.value)}
                        onBlur={(event) => setIsQuestionFocused(false)}
                      />
                    </div>
                  )}
                </div>
                <div className="image-container">
                  <div className="template-looping-image">
                    <img className="template-inner-image" src={imgPreview ?? null} alt="image" />
                  </div>
                  {/* image actions */}
                  <div className="image-container-actions">
                    {/* replace */}
                    <BASTooltip label="Replace" tooltipPlacement="top">
                      <img
                        onClick={replaceImageHandler}
                        src={RefreshIcon}
                        alt="replace"
                        className="refresh-icon"
                      />
                    </BASTooltip>
                    {/* delete img */}
                    <BASTooltip label="Delete" tooltipPlacement="top">
                      <img
                        onClick={removeImageHandler}
                        src={DeleteIcon}
                        alt="delete"
                        className="delete-icon"
                      />
                    </BASTooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="image-des-field">
            <TextEditor
              placeholder="Description (optional)"
              templateHeight={true}
              item={dataItem}
              editorKey={editorKey}
            />
          </div>
        </div>
      </div>
    </>
  );
}
