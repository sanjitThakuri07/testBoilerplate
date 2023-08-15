import { Box, Checkbox, Stack } from "@mui/material";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import ErrorComponent from "src/components/Error";
import { errorValue } from "containers/template/validation/inputLogicCheck";
import ExtraUserFields from "containers/template/components/mobileComponents/ReusableMobileComponent/ExtraUserFields";

export default function MobileCheckbox({
  dataItem,
  value,
  errors,
  handleFormikFields,
  onChange,
  ...attr
}: any) {
  const { updateTemplateDatasets } = useTemplateFieldsStore();
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Checkbox
          color="primary"
          checked={Boolean(value)}
          checkedIcon={<img src="src/assets/icons/icon-check.svg" alt="check" />}
          icon={<img src="src/assets/icons/icon-uncheck.svg" alt="uncheck" />}
          indeterminateIcon={
            <img src="src/assets/icons/icon-check-remove.svg" alt="indeterminate" />
          }
          // onChange={(e) => {
          //   updateTemplateDatasets(dataItem, 'value', e.target.checked);
          //   onChange(e);
          // }}
          onChange={onChange}
          inputProps={{
            "aria-label": "select all desserts",
          }}
          {...attr}
        />
        <Box>{dataItem?.label}</Box>
      </Stack>
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
      <div>
        <ExtraUserFields item={dataItem} handleFormikFields={handleFormikFields} />
      </div>
    </>
  );
}
