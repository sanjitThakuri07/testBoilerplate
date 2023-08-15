import React, { forwardRef, useState, ForwardedRef } from "react";

// import CloseIcon from '@mui/icons/Close';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullPageLoader from "src/components/FullPageLoader/index";
import { ClassNames } from "@emotion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { tableIndicatorProps } from "./BASDataTable";
import { IndividualFile } from "src/components/MultiFileUploader/index";
import { Link } from "react-router-dom";
import { CustomChipComponent } from "src/components/CustomBadgeCreator/index";

interface CustomPopUpProps extends ButtonProps {
  // Define any additional props for your component here
  data?: any[];
  title?: string;
  domain?: string;
  showNumber?: number;
  ID?: number | undefined;
  row?: any;
  setTableConfig?: Function;
  tableIndicator?: tableIndicatorProps;
  openInNewWindow?: boolean;
}
// domain to identify to which i should forward to
// for findings and recommendations title is enough

interface IndividualListProps {
  id?: number;
  domain?: string;
  navigate?: any;
  children?: any;
  handleClose?: any;
  individualData?: any;
}

export const IndividualListDisplay = ({
  id,
  domain,
  navigate,
  children,
  handleClose,
  individualData,
}: IndividualListProps) => {
  let nestedDomain = domain?.toString().toLowerCase();
  return (
    <li
      className={`${
        nestedDomain?.toLowerCase() === "findings" ? "hover__effect-underline " : ""
      }description__tab `}
      onClick={(e) => {
        e.stopPropagation();
        if (domain?.toString().toLowerCase() === "findings") {
          handleClose?.();
          navigate?.(`/config/findings-recommendations?findings=${id}`);
        }
      }}
    >
      {children !== undefined ? children : ""}
    </li>
  );
};

const CustomPopUp = (props: CustomPopUpProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  function getRedirectionLink() {
    const link = props?.ID
      ? props?.title?.split(" ").reverse()[0]?.toString()?.toLowerCase() !== "attachments"
        ? props?.tableIndicator?.subSectionUrl && props?.tableIndicator?.subSectionUrl(props?.ID)
        : props?.tableIndicator?.editFrontEndUrlGetter?.(props?.ID)
      : location?.pathname;

    return link;
  }

  // getRedirectionLink();

  return (
    <>
      {open && <FullPageLoader />}
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {!!props?.data?.length ? (
          <Typography
            variant="subtitle1"
            sx={{ fontSize: "small", cursor: "pointer" }}
            component="div"
            onClick={handleOpen}
            //   sx={{ display: 'none' }}
            //   ref={ref}
          >
            {props?.title?.toString()?.toLowerCase().includes("attachments") ? (
              <Button variant="outlined">View Attachments</Button>
            ) : props?.tableIndicator?.popUpField?.componentType !== "custom__chip" ? (
              "View More"
            ) : (
              "View More"
            )}
          </Typography>
        ) : (
          <Link to={getRedirectionLink()} style={{ textDecoration: "none" }}>
            {!!props?.tableIndicator?.showAddButton ? (
              <Button variant="outlined">
                Add{" "}
                {props?.title
                  ? props?.title?.split(" ").reverse()[0]?.toString()
                  : "Findings & Recommendations"}
              </Button>
            ) : (
              <>----</>
            )}
          </Link>
        )}
        <Dialog open={open} onClose={handleClose} fullWidth={true} className="popup__list-styling">
          <DialogTitle className="popup__heading">
            {props?.title || ""} here.
            <span>View all {props?.title?.split(" ").reverse()[0]}</span>
            <IconButton onClick={handleClose} className="close__icon">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="popup__content">
            <ol
              className={`${
                props?.title?.toString()?.toLowerCase().includes("attachments")
                  ? "remove__list-count"
                  : ""
              }`}
            >
              {props?.tableIndicator?.popUpField?.componentType === "custom__chip" && (
                <div className="chip__container-table">
                  {
                    // CustomChipComponent
                    props?.data?.length &&
                      props?.data?.map((item: any) => {
                        if (item instanceof Object) {
                          return (
                            <CustomChipComponent
                              value={item?.[props?.tableIndicator?.popUpField?.fieldName || ""]}
                              {...item}
                            />
                          );
                        }
                      })
                  }
                </div>
              )}
              {props?.tableIndicator?.popUpField?.componentType !== "custom__chip" &&
                props?.data?.length &&
                props?.data?.map((item: any) => {
                  if (item instanceof Object) {
                    const keyName = props?.tableIndicator?.popUpField?.fieldName || "description";
                    return (
                      <IndividualListDisplay
                        key={item?.id}
                        handleClose={handleClose}
                        id={item?.id}
                        navigate={navigate}
                        individualData={item}
                        domain={props?.title?.split(" ").reverse()[0]}
                      >
                        <p>{item?.[`${keyName}`]}</p>
                      </IndividualListDisplay>
                    );
                  } else {
                    if (props?.title?.toLowerCase()?.includes("attachment")) {
                      return (
                        <IndividualListDisplay
                          key={item}
                          handleClose={handleClose}
                          id={item}
                          navigate={navigate}
                          individualData={item}
                          domain={props?.title?.split(" ").reverse()[0]}
                        >
                          <IndividualFile file={item} openInNewWindow={props?.openInNewWindow} />
                        </IndividualListDisplay>
                      );
                    }
                  }
                })}
            </ol>
          </DialogContent>
          <DialogActions className="actions__container">
            <Button onClick={handleClose} variant="outlined" className="close__button">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default CustomPopUp;
