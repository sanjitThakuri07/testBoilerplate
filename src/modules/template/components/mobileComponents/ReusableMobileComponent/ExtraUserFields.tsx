import { Button, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import DeleteIconImage from "src/assets/template/mobileIcons/delete.png";
import MultiUploader from "src/components/MultiFileUploader/index";
import { postAPI } from "src/lib/axios";
import FileDataModal from "src/components/FileDataModal";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAssignActivity from "src/modules/AssignActivities/AddAssignActivity";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { deleteHandler } from "./extraUserApiRequest";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import AddIcon from "@mui/icons-material/Add";
import { fileExtensions } from "src/utils/fileExtensionChecker";
import FullPageLoader from "src/components/FullPageLoader";

interface ExtraUserFieldsProps {
  onChangeNotes?: any;
  item?: any;
  handleFormikFields?: any;
  disabled?: boolean;
}

function AssignActionModal({ handleClose, open, children, title, disabled }: any) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      className="popup__list-styling assign__modal"
    >
      <DialogTitle className="popup__heading">
        {!!title && title}
        <IconButton onClick={handleClose} className="close__icon">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="popup__content">{children}</DialogContent>
    </Dialog>
  );
}

const Media = ({
  setOpenMultiImage,
  openMultiImage,
  clearData,
  setClearData,
  handleFormikFields,
  item,
  setState,
}: any) => {
  const [fd, setFD] = useState<any>("");
  return (
    <MultiUploader
      setOpenMultiImage={setOpenMultiImage}
      openMultiImage={openMultiImage}
      initialData={handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.media || []}
      clearData={openMultiImage}
      setClearData={setClearData}
      maxFileSize={"Infinite"}
      requireDescription={false}
      accept={{
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "application/pdf": [".pdf"],
      }}
      icon={
        <div className="attach__files-icon common__button-comp">
          {/* <AttachFileIcon></AttachFileIcon> */}
          Add Media
        </div>
      }
      defaultViewer={false}
      getFileData={async (files: any = []) => {
        setState?.((prev: any) => {
          return { ...prev, loading: true };
        });
        const formData: any = new FormData();
        formData.append("id", item.id);
        let linkFiles: any = [];
        files[0]?.documents.map(async (doc: any) => {
          if (doc.file) {
            let fileFormData = new FormData(); // Create a new FormData instance
            fileFormData.append("id", item.id);
            doc.compressedFile && formData.append("files", doc.compressedFile);
          } else {
            linkFiles.push(doc);
          }
        });
        const { data } = await postAPI("/templates/upload-media/", formData);

        let previousValue =
          handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.[
            item?.type === "media" ? "value" : "media"
          ]?.[0]?.documents || [];

        try {
          const mediaKey =
            item?.type === "media"
              ? `${item?.component}__${item.id}.value`
              : `${item?.component}__${item.id}.media`;

          if (data) {
            handleFormikFields?.setFieldValue(mediaKey, [
              {
                documents: previousValue.length
                  ? [...previousValue, ...(data?.media || [])]
                  : data?.media,
                title: "",
              },
            ]);
          } else {
            handleFormikFields?.setFieldValue(mediaKey, [{ documents: previousValue, title: "" }]);
          }
          setClearData(true);
        } catch (e: any) {
          alert("Media upload failed !please try again");
          setState?.((prev: any) => ({ ...prev, loading: false }));
        }
        setState?.((prev: any) => ({ ...prev, loading: false }));
      }}
    />
  );
};

const ExtraUserFields = ({
  item,
  onChangeNotes,
  handleFormikFields,
  disabled,
}: ExtraUserFieldsProps) => {
  const [state, setState] = React.useState({
    addNote: false,
    addMedia: false,
    addAction: false,
    loading: false,
  });
  const [editNote, setEditNote] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [noteContent, setNoteContent] = React.useState<string>(item?.notes || "");
  const [tempNoteContent, setTempNoteContent] = React.useState<string>(editNote ? item?.notes : "");
  const [isActionCreated, setIsActionCreated] = React.useState(false);
  const [individualAction, setIndividualAction] = React.useState<any>({});
  const [errorMessage, setErrorMessage] = React.useState("");
  const open = Boolean(anchorEl);
  const [clearData, setClearData] = React.useState(false);
  const [openMultiImage, setOpenMultiImage] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);

  const handleNotes = () => {
    setState({ ...state, addNote: !state.addNote });
  };

  const handleAction = () => {
    setState({ ...state, addAction: !state.addAction });
  };

  const handleActionEdit = () => {
    setState({ ...state, addAction: !state.addAction });
    setAnchorEl(null);
    setIsActionCreated(false);
  };

  const handleActionDelete = () => {
    setAnchorEl(null);
    setIsActionCreated(false);
    setState({ ...state, addAction: false });
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  const handleActionOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <>
      {state.loading && <FullPageLoader />}
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={async () => {
          setIsDelete(true);
          const apiResponse = await deleteHandler({
            id: individualAction?.id,
            url: `activity`,
          });
          if (apiResponse) {
            let perviousAction = (
              handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.action || []
            )?.filter((it: any) => it?.id !== individualAction?.id);

            handleFormikFields?.setFieldValue(
              `${item?.component}__${item.id}.action`,
              perviousAction,
            );
          }
          setIsDelete(false);
          setOpenModal(false);
        }}
        confirmationHeading={`Do you want to delete ${individualAction?.title}?`}
        confirmationDesc={`This ${individualAction?.title} activity will be deleted.`}
        status="warning"
        confirmationIcon="/src/assets/icons/icon-feature.svg"
        loader={isDelete}
      />
      <div id="ExtraUserFields">
        {item.type === "media" ? (
          <Media
            setOpenMultiImage={setOpenMultiImage}
            openMultiImage={openMultiImage}
            clearData={clearData}
            setClearData={setClearData}
            handleFormikFields={handleFormikFields}
            item={item}
            setState={setState}
          />
        ) : null}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <i>{noteContent} </i>
          <div>
            {!!noteContent.length && state.addNote && (
              <span
                onClick={() => {
                  setNoteContent("");
                  setTempNoteContent("");
                  handleNotes();
                }}
              >
                <img src={DeleteIconImage} alt="" />{" "}
              </span>
            )}
          </div>
        </div>
        {/* media */}
        {!!(
          handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.[
            item?.type === "media" ? "value" : "media"
          ]?.[0]?.documents || []
        )?.length && (
          <div className="image__container-inspection">
            {handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.[
              item?.type === "media" ? "value" : "media"
            ]?.[0]?.documents?.map((it: any) => {
              let { fileOpen, isFile, fileInModal, isImage } = fileExtensions(it);
              return (
                <>
                  <FileDataModal data={`${process.env.VITE_HOST_URL}/${it}`} openInNewWindow={true}>
                    <div className="inspection__image-report">
                      <img
                        src={`${isImage ? `${process.env.VITE_HOST_URL}/${it}` : `${fileOpen}`}`}
                        alt=""
                      />
                      <div
                        className="delete"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          const mediaValue =
                            handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.[
                              item?.type === "media" ? "value" : "media"
                            ] || {};
                          if (mediaValue?.length) {
                            const newMedia: any[] = [...mediaValue]?.[0]?.documents?.filter(
                              (data: any) => data !== it,
                            );
                            handleFormikFields?.setFieldValue(
                              `${item?.component}__${item.id}.${
                                item?.type === "media" ? "value" : "media"
                              }`,
                              [
                                {
                                  documents: [...(newMedia || [])],
                                },
                              ],
                            );
                          }
                        }}
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  </FileDataModal>
                </>
              );
            })}
          </div>
        )}
        {/* action */}
        {!!(handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.action || [])
          ?.length && (
          <div className="action__container-activity">
            {(handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.action || [])?.map(
              (it: any) => {
                return (
                  <div className="activity__card">
                    <div>
                      <h4>
                        {it?.title} <span>({it?.priority})</span>
                      </h4>
                    </div>
                    <div className="actions">
                      <button
                        type="button"
                        onClick={(e: any) => {
                          setState((prev: any) => ({ ...prev, addAction: true }));
                          setIndividualAction(it);
                        }}
                      >
                        <img src="/src/assets/icons/icon-edit.svg" alt="" />
                      </button>
                      <button
                        onClick={(e: any) => {
                          setOpenModal(true);
                          setIndividualAction(it);
                        }}
                        type="button"
                      >
                        <img src="/src/assets/icons/icon-trash.svg" alt="" />
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
        {/* Footer action */}
        <div className="footer_items_action">
          {state.addNote && (
            <>
              <div className="footer_items_action_menu">
                <div className="mobile_component_box_wrapper_heading">
                  <p>Notes</p>
                </div>
                <div className="mobile_component_box_wrapper_input">
                  <TextField
                    fullWidth
                    id="fullWidth"
                    value={tempNoteContent}
                    onChange={(e: any) => {
                      setTempNoteContent(e.target.value);
                    }}
                  />
                </div>

                <div className="action_buttons">
                  <Button variant="outlined" fullWidth onClick={handleNotes}>
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setNoteContent(tempNoteContent);
                      handleFormikFields?.setFieldValue(
                        `${item?.component}__${item.id}.notes`,
                        tempNoteContent,
                      );
                      handleNotes();
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </>
          )}

          {state.addAction && (
            <>
              <AssignActionModal
                handleClose={() => {
                  setState((prev: any) => ({ ...prev, addAction: false }));
                }}
                open={state.addAction}
                title={"Add Activity"}
              >
                {/* assign activity */}
                <AddAssignActivity
                  getAssignValue={(data: any) => {
                    let perviousAction =
                      handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.action || [];
                    let newValue = Array.isArray(data)
                      ? [...data, ...(perviousAction || [])]
                      : [data, ...(perviousAction || [])];
                    handleFormikFields?.setFieldValue(
                      `${item?.component}__${item.id}.action`,
                      newValue,
                    );
                  }}
                  isEdit={individualAction?.id ? true : false}
                  assignData={individualAction || {}}
                  handleClose={() => {
                    setState((prev: any) => ({ ...prev, addAction: false }));
                  }}
                  className="modal__box-assign"
                />
              </AssignActionModal>
            </>
          )}
        </div>
        {!!!disabled && (
          <div className="mobile_component_box_wrapper_footer">
            <div className="footer_item common__button-comp note__button" onClick={handleNotes}>
              <span>
                <AddIcon />
              </span>
              <div>{noteContent.length ? "Edit Notes" : "Notes"}</div>
            </div>
            {/* ---Next Item */}
            {item.type !== "media" ? (
              <Media
                setOpenMultiImage={setOpenMultiImage}
                openMultiImage={openMultiImage}
                clearData={clearData}
                setClearData={setClearData}
                handleFormikFields={handleFormikFields}
                item={item}
                setState={setState}
              />
            ) : null}

            {/* ---Next Item */}
            <div
              className="footer_item common__button-comp"
              onClick={() => {
                handleAction();
                setIndividualAction({});
              }}
            >
              Add Activity
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExtraUserFields;
