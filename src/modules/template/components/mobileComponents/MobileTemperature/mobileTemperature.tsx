import { Box, FormGroup, OutlinedInput, Stack } from "@mui/material";
import ExtraUserFields from "../ReusableMobileComponent/ExtraUserFields";
import ErrorComponent from "src/components/Error";
import { errorValue } from "containers/template/validation/inputLogicCheck";

export default function MobileTemperature({
  item,
  onChange,
  value,
  onChangeNotes,
  errors,
  handleFormikFields,
  ...attr
}: any) {
  let tempFormat = item?.variables?.temperatureFormat;
  return (
    <>
      <div id="MobileTemperature">
        <div className="mobile_component_box_wrapper_heading">{item?.label}</div>

        <Box mt={1}>
          <FormGroup>
            <OutlinedInput
              name="block_time_increment"
              id="block_time_increment"
              type="text"
              placeholder="00.00"
              size="small"
              fullWidth
              onChange={onChange}
              // onBlur={handleBlur}
              value={value}
              endAdornment={
                <Stack spacing={0.3} direction="row" className="indorment">
                  {tempFormat?.startsWith("C") && <span>°</span>}
                  <span>{tempFormat?.charAt(0)}</span>
                </Stack>
              }
              {...attr}
            />
          </FormGroup>
        </Box>
      </div>
      <br />
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
      <ExtraUserFields
        item={item}
        onChangeNotes={onChangeNotes}
        handleFormikFields={handleFormikFields}
      />
    </>
  );
}
