// import CloseIcon from '@mui/icons/Close';
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { converText } from "src/modules/table/BASDataTable";
import { RadioOptions } from "src/utils/FindingsUtils";

interface CustomPopUpProps extends ButtonProps {
  // Define any additional props for your component here
  title?: string;
  children?: any;
  openModal: boolean;
  setOpenModal: Function;
  headers?: any;
  viewData?: any;
  chipOptions?: string[];
  field?: any;
}

export const checkValue = ({ value, skipColumn, currentColumn }: any) => {
  const dateString = value;
  const timestamp = Date.parse(dateString);
  if (skipColumn?.includes(currentColumn)) return value;

  if (!value) return "---";
  if (isNaN(timestamp)) {
    if (typeof value === "boolean") {
      return value ? "True" : "False";
    } else {
      return value;
    }
  } else if (!isNaN(timestamp)) {
    const date = new Date(timestamp);

    const options: any = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  }
};

export const ChipComponent = ({ value, maxCharacters = 1000000000000000000000 }: any) => {
  return (
    <div
      style={{
        display: "inline-block",
        background: RadioOptions?.[`${value}`]
          ? RadioOptions?.[`${value}`]?.backgroundColor
          : RadioOptions?.[`default`]?.backgroundColor || "transparent",
        padding: "4px 19px 4px 30px",
        paddingLeft: "30px",
        border: RadioOptions?.[`${value}`]
          ? RadioOptions?.[`${value}`]?.border
          : RadioOptions?.[`default`]?.border || "none",
        borderRadius: "20px",
        position: "relative",
        color: RadioOptions?.[`${value}`]
          ? RadioOptions?.[`${value}`]?.textColor
          : RadioOptions?.[`default`]?.textColor || "#000",
        justifySelf: "flex-start",
      }}
      className="badge__creator"
    >
      <span
        style={{
          background: RadioOptions?.[`${value}`]
            ? RadioOptions?.[`${value}`]?.dotColor
            : RadioOptions?.[`default`]?.dotColor,
        }}
      ></span>
      {converText(value, maxCharacters)}
    </div>
  );
};

const ObjectData = (data: any, field?: any) => {
  return data?.[field?.label];
};

export const GetValue = ({ data, field, isChip, columnKey }: any) => {
  if (!data) {
    return <>---</>;
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    return (
      <>{isChip ? <ChipComponent value={ObjectData(data, field)} /> : ObjectData(data, field)}</>
    );
  } else if (typeof data === "object" && Array.isArray(data)) {
    // normal string or array
    return (
      <div className="multi__block">
        {data?.map((it: any, index: number) => {
          if (it instanceof Object) {
            return (
              <div key={index}>
                {" "}
                <>
                  {isChip ? (
                    <ChipComponent
                      value={checkValue({
                        value: ObjectData(it, field),
                        skipColumn: ["id"],
                        currentColumn: columnKey,
                      })}
                    />
                  ) : (
                    <span className="user__value">
                      {checkValue({
                        value: ObjectData(it, field),
                        skipColumn: ["id"],
                        currentColumn: columnKey,
                      })}
                    </span>
                  )}
                </>
              </div>
            );
          } else {
            return (
              <div key={it}>
                <>
                  {isChip ? (
                    <ChipComponent
                      value={checkValue({
                        value: ObjectData(it),
                        skipColumn: ["id"],
                        currentColumn: columnKey,
                      })}
                    />
                  ) : (
                    <span className="user__value">
                      {checkValue({ value: it, skipColumn: ["id"], currentColumn: columnKey })}
                    </span>
                  )}
                </>
              </div>
            );
          }
        })}
        {!data?.length && "---"}
      </div>
    );
  }

  return (
    <>
      {isChip ? (
        <ChipComponent
          value={checkValue({ value: data, skipColumn: ["id"], currentColumn: columnKey })}
        />
      ) : (
        <span className="user__value">
          {checkValue({ value: data, skipColumn: ["id"], currentColumn: columnKey })}
        </span>
      )}
    </>
  );
};

const CustomPopUp = ({
  title,
  children,
  openModal,
  setOpenModal,
  headers,
  viewData,
  chipOptions,
  field,
}: CustomPopUpProps) => {
  const handleClose = () => {
    setOpenModal();
  };

  const handleOpen = () => {
    setOpenModal();
  };

  return (
    <>
      {/* {openModal && <FullPageLoader />} */}
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Dialog
          open={openModal}
          onClose={handleClose}
          fullWidth={true}
          className="popup__list-styling"
        >
          <DialogTitle className="popup__heading">
            View {title || ""} Detail
            <span>{title}</span>
            <IconButton onClick={handleClose} className="close__icon">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="popup__content custom___popup-content">
            <div className="children">{children}</div>
            {!!Object.keys(headers || {})?.length && (
              <ol className="box view__block">
                {Object.keys(headers || {})
                  ?.filter((dt: any) => dt !== "id" || dt !== "attachments")
                  .map((key: any) => {
                    return (
                      <li key={key}>
                        <div className="view__block-individual">
                          <span className="key">{headers?.[key]}</span>
                          <span className="value">
                            <span>:</span>
                            <GetValue
                              data={viewData?.[key]}
                              field={field}
                              columnKey={key}
                              isChip={chipOptions?.includes(key)}
                            ></GetValue>{" "}
                          </span>
                        </div>
                      </li>
                    );
                  })}
              </ol>
            )}
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
