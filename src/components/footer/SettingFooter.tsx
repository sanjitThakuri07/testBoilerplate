import { Button, Grid } from '@mui/material';
import { ActionButtonProps, FormikFormHelpers } from 'interfaces/utils';
import React, {
  // MouseEvent,
  FC,
} from 'react';
import { CSSProperties } from '@mui/styles';

interface IProps {
  isViewOnly: boolean;
  loading: boolean;
  handleViewOnly: () => void;
  formikHelpers: FormikFormHelpers;
  actionButtonsText?: ActionButtonProps;
  handleSubmit?: Function;
}
/**
 * @author &copy;shankardesigner
 * @description Utility component that binds view and edit buttons
 * @param isViewOnly accepts as boolean
 * @param loading accepts as boolean
 * @param handleViewOnly utility function to toggle edit and view mode
 * @param formikHelpers FormikFormHelpers to enable and disable buttons
 * @param actionButtonsText Buttons text to display
 * @returns JSX.ELEMENT
 */
const SettingFooter: FC<IProps> = ({
  isViewOnly = true,
  loading = false,
  handleViewOnly,
  formikHelpers: { isValid = false, dirty = false, touched },
  actionButtonsText,
  handleSubmit,
}) => {
  const { edit, submit, cancel }: ActionButtonProps = {
    edit: actionButtonsText?.edit || 'Edit',
    submit: actionButtonsText?.submit || 'Update Details',
    cancel: actionButtonsText?.cancel || 'Cancel',
  };
  const handleButtonClick = (): // ev: MouseEvent<HTMLButtonElement>
  void => {
    handleViewOnly();
  };

  const location = window.location.pathname;

  const organizationStyle: CSSProperties = {
    // display: 'block',
  };

  const otherStyle: CSSProperties = {
    // position: 'fixed',
    // background: '#fff',
    // zIndex: 999,
    // bottom: '0%',
    // paddingBottom: '15px',
    // right: '13%',
  };

  const selectedStyle: CSSProperties =
    location === '/organization' ? { ...organizationStyle } : { ...otherStyle };

  return (
    <Grid container spacing={2} justifyContent="flex-end" style={selectedStyle}>
      {isViewOnly ? (
        <Grid item>
          <Button variant="contained" disabled={loading} onClick={handleButtonClick}>
            {edit}
          </Button>{' '}
        </Grid>
      ) : (
        <React.Fragment>
          <Grid item>
            <Button variant="outlined" onClick={handleButtonClick}>
              {cancel}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              type="submit"
              onClick={() => {
                handleSubmit?.();
              }}>
              {submit}
            </Button>
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
};

export default SettingFooter;
