import { faInfoCircle, faWarning } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogActions, DialogContent, IconButton } from "@mui/material";

import { CommonTooltip } from "src/components/Tooltips/CommonTooltip";

import styles from "./index.module.scss";

type Props = {
  open: boolean;
  icon?: {
    type: string;
    color?: string;
    icon?: any;
  };
  className?: string;
  inputField?: any;
  handleClose?: () => void;
  handleSubmit?: () => void;
  handleSecondarySubmit?: () => void;
  isSubmitDisabled?: boolean;
  isSecondarySubmitDisabled?: boolean;
  messages: {
    title: string;
    text?: string;
    accept?: string;
    subText?: string;
    deny?: string;
    secondarySubmit?: string;
    secondayToolTip?: string;
    error?: string;
    cancelToolTip?: string;
    submitToolTip?: string;
  };
  maxWidthProps?: number;
};

const PopUpModal = ({
  open,
  icon,
  inputField,
  handleClose,
  handleSubmit,
  isSubmitDisabled,
  handleSecondarySubmit,
  messages,
  isSecondarySubmitDisabled,
  className,
  maxWidthProps,
}: Props) => {
  const negative = ["warning", "danger"];
  const positive = ["success", "info"];

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={`alert-dialog ${styles.alertDialog}`}
      >
        <DialogContent
          style={{ maxWidth: maxWidthProps ?? "" }}
          className={` ${styles.alertContent}  ${className} `}
        >
          {icon && (
            <div className={styles.iconBox}>
              <IconButton className={`${icon.type && styles[icon.type]} ${styles.iconItem}`}>
                {negative.includes(icon.type) && <FontAwesomeIcon icon={faWarning} size="1x" />}
                {positive.includes(icon.type) && <FontAwesomeIcon icon={faInfoCircle} size="1x" />}
              </IconButton>
            </div>
          )}
          <h4 className={`title-text ${styles.title}`}>{messages.title}</h4>
          {messages.text && (
            <p
              className={
                inputField
                  ? `light-text ${styles.text} ${styles.textBottom}`
                  : `light-text ${styles.text} `
              }
            >
              {messages.text}
            </p>
          )}
          {messages.subText && (
            <p
              className={
                inputField
                  ? `light-text ${styles.text} ${styles.textBottom} ${styles.custTextMargin}`
                  : `light-text ${styles.text} ${styles.custTextMargin}`
              }
            >
              {messages.subText}
            </p>
          )}

          {inputField && <div className={styles.formContent}>{inputField}</div>}
          <p className="errorText error">{messages.error}</p>
        </DialogContent>

        <DialogActions className={styles.actionBlock}>
          <>
            {handleClose && (
              <CommonTooltip
                title={messages.cancelToolTip ?? "Return to survey."}
                placement="top-end"
              >
                <Button onClick={handleClose} className="secondary-button">
                  {messages.deny}
                </Button>
              </CommonTooltip>
            )}
            {handleSecondarySubmit && (
              <CommonTooltip title={messages?.secondayToolTip ?? ""} placement="top-end">
                <Button
                  onClick={handleSecondarySubmit}
                  className="secondary-button"
                  disabled={isSecondarySubmitDisabled ?? false}
                >
                  {messages.secondarySubmit}
                </Button>
              </CommonTooltip>
            )}
            {handleSubmit && messages.accept && (
              <CommonTooltip
                title={messages.submitToolTip ?? "Submit the survey."}
                placement="top-end"
              >
                <Button
                  className={
                    icon &&
                    (positive.includes(icon.type) ? "primary-button" : "primary-button alert-Btn")
                  }
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled ?? false}
                >
                  {messages.accept}
                </Button>
              </CommonTooltip>
            )}
          </>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PopUpModal;
