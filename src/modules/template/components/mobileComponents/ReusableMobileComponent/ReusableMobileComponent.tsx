import { Button, Chip, IconButton, ListItemIcon, Menu, MenuItem, TextField } from "@mui/material";
import React from "react";
import NoteIcon from "src/assets/template/mobileIcons/notes.png";
import MediaIcon from "src/assets/template/mobileIcons/media.png";
import ActionIcon from "src/assets/template/mobileIcons/action.png";
import UploadImage from "../MobileMedia/UploadImage";
import EditIcon from "src/assets/template/mobileIcons/edit.png";
import DeleteIcon from "src/assets/template/mobileIcons/delete.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface ReusableMobileComponentProps {
  children: React.ReactNode;
  label: string;
  item?: any;
}

const ReusableMobileComponent = ({ children, label, item }: ReusableMobileComponentProps) => {
  const [state, setState] = React.useState({
    addNote: false,
    addMedia: false,
    addAction: false,
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isActionCreated, setIsActionCreated] = React.useState(false);
  const [action, setAction] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const open = Boolean(anchorEl);

  const handleNotes = () => {
    setState({ ...state, addNote: !state.addNote });
  };

  const handleMedia = () => {
    setState({ ...state, addMedia: !state.addMedia });
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

  const handleActionCreate = () => {
    if (action === "") {
      setErrorMessage("Please enter action name");
    } else {
      setIsActionCreated(true);
      setState({ ...state, addAction: false });
      return;
    }
  };

  const handleActionOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div id="ReusableMobileComponent">
      <div className="mobile_component_box">
        <div className="mobile_component_box_wrapper">
          <div className="mobile_component_box_wrapper_heading">{label}</div>
          <div className="mobile_component_box_wrapper_input">{children}</div>

          {/* Footer action */}
          <div className="footer_items_action">
            {state.addNote && (
              <>
                <div className="footer_items_action_menu">
                  <div className="mobile_component_box_wrapper_heading">
                    {" "}
                    <p>Notes</p>{" "}
                  </div>
                  <div className="mobile_component_box_wrapper_input">
                    <TextField fullWidth id="fullWidth" />
                  </div>

                  <div className="action_buttons">
                    <Button variant="outlined" fullWidth onClick={handleNotes}>
                      Cancel
                    </Button>
                    <Button fullWidth variant="contained">
                      Save
                    </Button>
                  </div>
                </div>
              </>
            )}

            {state.addMedia && (
              <>
                <div className="footer_items_action_menu">
                  <div className="mobile_component_box_wrapper_heading">Booking ID</div>
                  <div className="mobile_component_box_wrapper_input">
                    <UploadImage />
                  </div>
                </div>
              </>
            )}

            {state.addAction && (
              <>
                <div className="footer_items_action_menu">
                  <div className="mobile_component_box_wrapper_heading">
                    {" "}
                    <p>Create Action</p>{" "}
                  </div>
                  <div className="mobile_component_box_wrapper_input">
                    <TextField
                      fullWidth
                      value={action}
                      id="fullWidth"
                      onChange={(e) => setAction(e.target.value)}
                    />
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                  </div>

                  <div className="action_buttons">
                    <Button variant="outlined" fullWidth onClick={handleNotes}>
                      Cancel
                    </Button>
                    <Button fullWidth variant="contained" onClick={handleActionCreate}>
                      Save
                    </Button>
                  </div>
                </div>
              </>
            )}

            {isActionCreated && (
              <>
                <div className="footer_items_action_menu">
                  <div className="mobile_component_box_wrapper_heading">
                    {" "}
                    <p>Create Action</p>{" "}
                  </div>

                  <div className="create_action_">
                    <div
                      className="create_action_left"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {action}
                    </div>
                    <div className="create_action_right">
                      <div className="create_action_status">
                        <Chip
                          label="TODO"
                          size="small"
                          sx={{
                            backgroundColor: "#FFFAEB",
                            color: "#FFC107",
                          }}
                        />
                      </div>
                      <div className="create_action_icon">
                        <IconButton aria-label="settings" onClick={handleActionOpen}>
                          <MoreVertIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleActionClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={handleActionEdit}>
                    <ListItemIcon sx={{ mr: 1 }}>
                      <img src={EditIcon} alt="" />
                    </ListItemIcon>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={handleActionDelete}>
                    <ListItemIcon sx={{ mr: 1 }}>
                      <img src={DeleteIcon} alt="" />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>

          {item.response_type === 1003 ? (
            ""
          ) : (
            <div className="mobile_component_box_wrapper_footer">
              <div className="footer_item" onClick={handleNotes}>
                <div className="footer_item_icon">
                  <img src={NoteIcon} alt="" />
                </div>
                <div className="footer_item_text">Notes</div>
              </div>
              {/* ---Next Item */}
              <div className="footer_item" onClick={handleMedia}>
                <div className="footer_item_icon">
                  <img src={MediaIcon} alt="" />
                </div>
                <div className="footer_item_text">Media</div>
              </div>
              {/* ---Next Item */}
              <div className="footer_item" onClick={handleAction}>
                <div className="footer_item_icon">
                  <img src={ActionIcon} alt="" />
                </div>
                <div className="footer_item_text">Action</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReusableMobileComponent;
