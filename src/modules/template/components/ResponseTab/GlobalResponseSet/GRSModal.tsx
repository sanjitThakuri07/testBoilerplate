import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import ModalLayout from "src/components/ModalLayout";
import React, { FC, useEffect } from "react";
import GRSForm from "./GRSForm";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BackupIcon from "@mui/icons-material/Backup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import { useSnackbar } from "notistack";
import FullPageLoader from "src/components/FullPageLoader";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useApiOptionsStore from "src/store/zustand/templates/apiOptionsTemplateStore";
import { v4 as uuidv4 } from "uuid";

interface GRSModalProps {
  openModal: boolean;
  setOpenModal: () => void;
  responseSetId: number | null;
  updateState?: Function;
  disabled?: boolean;
}

interface GRSInterface {
  data: string[];
  heading?: string;
}

const GRSModal: FC<GRSModalProps> = ({
  openModal,
  setOpenModal,
  responseSetId,
  updateState,
  disabled,
}) => {
  const [isQuestionFocused, setIsQuestionFocused] = React.useState<boolean>(false);
  const [questionValue, setQuestionValue] = React.useState<string>("Untitled Response Set");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isFormLoading, setIsFormLoading] = React.useState<boolean>(false);

  const { updateGlobalResponseData, postGlobalResponseData }: any = useApiOptionsStore();

  const open = Boolean(anchorEl);
  const { enqueueSnackbar } = useSnackbar();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const [initialValues, setInitialValues] = React.useState<GRSInterface>({
    data: ["New response set"],
  });
  const [altInitialValues, setAltInitialValues] = React.useState<GRSInterface>({
    data: ["New response set"],
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteAll = () => {
    setAnchorEl(null);
    setInitialValues({ data: [] });
    setAltInitialValues({ data: [] });
  };

  const handleUpload = () => {
    setAnchorEl(null);
  };

  // if (questionValue === '' && !isQuestionFocused) {
  //   setQuestionValue('Untitled Response Set');
  // }

  const grsSubmitHandler = async (options: any) => {
    let payload = {
      name: questionValue,
      options: options.data.map((item: any) => ({
        ...item,
        name: item?.name,
        id: item?.id || uuidv4(),
      })),
    };

    if (responseSetId) {
      // (await putApiData({
      //   values: payload,
      //   url: `global-response`,
      //   id: responseSetId,
      //   enqueueSnackbar: enqueueSnackbar,
      //   setterFunction: (data: any) => {
      //     updateState?.(data);
      //   },
      //   domain: 'Global',
      //   setterLoading: setIsFormLoading,
      // })) && setOpenModal?.();
      updateGlobalResponseData({
        values: payload,
        id: responseSetId,
        updateState: updateState,
      }) && setOpenModal();
    } else {
      // (await postApiData({
      //   values: payload,
      //   url: '/global-response/',
      //   enqueueSnackbar: enqueueSnackbar,
      //   domain: 'Global',
      //   setterLoading: setIsFormLoading,
      //   setterFunction: (data: any) => {
      //     updateState?.(data);
      //   },
      // })) && setOpenModal();
      (await postGlobalResponseData({
        values: payload,
        updateState,
        enqueueSnackbar,
      })) && setOpenModal();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div id="GRSModal">
          {isFormLoading && <FullPageLoader></FullPageLoader>}
          <ModalLayout
            id="GRSModal"
            children={
              <>
                <div className="config_modal_form_css user__department-field">
                  <div className="config_modal_heading">
                    <div
                      className="top_heading"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: "10px",
                      }}
                    >
                      <div className="config_modal_title">
                        {!isQuestionFocused ? (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="h3"
                              gutterBottom
                              onClick={() => {
                                !disabled && setIsQuestionFocused(true);
                              }}
                            >
                              {questionValue}
                            </Typography>
                            {!disabled && (
                              <IconButton onClick={() => setIsQuestionFocused(true)}>
                                <DriveFileRenameOutlineIcon
                                  sx={{ fontSize: "25px", marginTop: "-5px", color: "#475467" }}
                                />
                              </IconButton>
                            )}
                          </div>
                        ) : (
                          <div className="TextAnswer_input">
                            <TextField
                              variant="standard"
                              autoFocus
                              fullWidth
                              value={questionValue}
                              sx={{ backgroundColor: "#f9fafb", width: "340px" }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                              onChange={(event) => setQuestionValue(event.target.value)}
                              onBlur={(event) => setIsQuestionFocused(false)}
                            />
                          </div>
                        )}
                      </div>

                      {!disabled && (
                        <div className="more_setting_icon">
                          <IconButton aria-label="settings" onClick={handleClick}>
                            <MoreVertIcon />
                          </IconButton>
                        </div>
                      )}
                    </div>
                    <div className="config_modal_text">
                      <div>This will be your response set name.</div>
                    </div>
                  </div>
                  <Divider />
                  <GRSForm
                    data={[]}
                    grsSubmitHandler={grsSubmitHandler}
                    responseSetId={responseSetId}
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    setAltInitialValues={setAltInitialValues}
                    altInitialValues={altInitialValues}
                    setQuestionValue={setQuestionValue}
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

        <Menu
          id="GRSModal_menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {/* <MenuItem onClick={handleUpload}>
            <ListItemIcon sx={{ mr: 1 }}>
              <BackupIcon />
            </ListItemIcon>
            Upload
          </MenuItem> */}
          <MenuItem onClick={handleDeleteAll}>
            <ListItemIcon sx={{ mr: 1 }}>
              <DeleteOutlineIcon />
            </ListItemIcon>
            Delete All
          </MenuItem>
        </Menu>
      </div>
    </DndProvider>
  );
};

export default GRSModal;
