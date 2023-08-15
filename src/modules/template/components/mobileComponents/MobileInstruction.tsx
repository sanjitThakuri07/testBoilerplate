import { TextField } from "@mui/material";
import ErrorComponent from "src/components/Error";
import { errorValue } from "src/modules/template/validation/inputLogicCheck";
import ExtraUserFields from "src/modules/template/components/mobileComponents/ReusableMobileComponent/ExtraUserFields";

const MobileInstruction = ({
  value,
  onChange,
  item,
  errors,
  handleFormikFields,
  disabled,
}: any) => {
  const extension = item.file_path?.split("/").pop()?.split(".")[1];
  const fileName = item.file_path?.split("/").pop();
  return (
    <div id="MobileInstruction">
      <div className="mobile_component_box_wrapper_heading">
        <i>{item.label}</i>
      </div>

      {item.file_path && ["pdf"].includes(extension) ? (
        <a
          href={`${process.env.VITE_HOST_URL}/${item?.file_path}`}
          target="_blank"
          style={{ color: "steelblue" }}
        >
          {fileName}
        </a>
      ) : item.file_path ? (
        <img
          src={`${process.env.VITE_HOST_URL}/${item?.file_path}`}
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
      {/* <div>
        <ExtraUserFields item={item} handleFormikFields={handleFormikFields} disabled={disabled}/>
      </div> */}
      {/* <TextField fullWidth id="fullWidth" value={value} onChange={onChange} /> */}
    </div>
  );
};

export default MobileInstruction;
