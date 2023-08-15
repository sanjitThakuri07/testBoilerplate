import { TextField } from "@mui/material";
import ErrorComponent from "src/components/Error";
import { errorValue } from "containers/template/validation/inputLogicCheck";
import ExtraUserFields from "../ReusableMobileComponent/ExtraUserFields";

const MobileNumber = ({
  value,
  onChange,
  item,
  errors,
  keyName,
  handleFormikFields,
  disabled,
  ...attr
}: any) => {
  return (
    <div id="MobileNumber">
      <div className="mobile_component_box_wrapper_heading">{item.label}</div>
      <TextField
        fullWidth
        id="fullWidth"
        value={value}
        onChange={onChange}
        onWheel={(e: any) => e.target.blur()}
        type={"number"}
        {...attr}
      />
      <>
        {errors &&
          errorValue?.map((err: any) => {
            return Object?.keys(errors || [])?.includes(err) ? (
              <ErrorComponent>{errors?.[err]}</ErrorComponent>
            ) : (
              <></>
            );
          })}

        <ExtraUserFields item={item} handleFormikFields={handleFormikFields} disabled={disabled} />
      </>
    </div>
  );
};

export default MobileNumber;
