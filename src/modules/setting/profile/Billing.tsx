import { Box, FormGroup, Grid, InputLabel, Typography } from "@mui/material";
import { getAPI } from "src/lib/axios";
import { FormikProps } from "formik";
import { MenuOptions, TenantProfile } from "interfaces/profile";
import React, { useState } from "react";
import { FC } from "react";
import DynamicSelectField from "./DynamicSelectField";
import { useEffect } from "react";

interface IProps {
  formikBag: FormikProps<TenantProfile>;
  isViewOnly: boolean;
}

const Billing: FC<IProps> = ({ formikBag, isViewOnly }) => {
  const { handleChange, handleBlur, values, errors, touched, setFieldTouched } = formikBag;
  const [billingOptions, setBillingOptions] = useState<MenuOptions[]>([]);
  const handleSelectTouch = (key: string): void => {
    setFieldTouched(key);
  };

  const fetchBillingOptions = async () => {
    const { status, data } = await getAPI("billings/");
    if (status === 200) {
      const options = data.items;
      const menuOptions: MenuOptions[] = options.map((opt: MenuOptions) => {
        return {
          value: opt.id,
          label: opt.title,
        };
      });
      setBillingOptions(menuOptions);
    }
  };

  useEffect(() => {
    fetchBillingOptions();
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h3" color="primary">
        Billing Information
      </Typography>
      <Typography variant="body1" component="p">
        Update your billing plan details here.
      </Typography>
      <Box className="setting-form-group">
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="fullName">
              <div className="label-heading">
                Plan <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={7}>
            <DynamicSelectField
              isViewOnly={isViewOnly}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="billing_plan"
              menuOptions={billingOptions}
              value={values.billing_plan}
              error={errors.billing_plan}
              touched={touched.billing_plan}
            />
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default Billing;
