import {
  Button,
  FormGroup,
  Grid,
  InputLabel,
  OutlinedInput,
  Switch,
  TextField,
} from '@mui/material';
import React from 'react';
import './TextField.scss';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTextAnswer } from 'globalStates/templates/TextAnswer';

const CustomTextField = () => {
  const { setRightSectionTabValue, selectedInputType } = useTextAnswer();

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  const goToResponse = () => {
    setRightSectionTabValue('2');
  };
  return (
    <div>
      <div id="CustomTextField">
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <InputLabel htmlFor="Question">
              <div className="label-heading">Display Name</div>
            </InputLabel>
          </Grid>
          <Grid item>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="Question"
                type="text"
                placeholder="Question"
                // size="small"
                fullWidth
                name="Question"

                // onChange={handleChange}
                // onBlur={handleBlur}
                // value={values.Question}
                // error={Boolean(touched.Question && errors.Question)}
              />
              {/* {Boolean(touched.Question && errors.Question) && (
                <FormHelperText error>{errors.Question}</FormHelperText>
              )} */}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" spacing={2} sx={{ marginTop: '10px' }}>
          <Grid item>
            <InputLabel htmlFor="help_text">
              <div className="label-heading">Help Text</div>
            </InputLabel>
          </Grid>
          <Grid item>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="help_text"
                type="text"
                placeholder="Help Text"
                // size="small"
                fullWidth
                name="help_text"

                // onChange={handleChange}
                // onBlur={handleBlur}
                // value={values.help_text}
                // error={Boolean(touched.help_text && errors.help_text)}
              />
              {/* {Boolean(touched.help_text && errors.help_text) && (
                <FormHelperText error>{errors.help_text}</FormHelperText>
              )} */}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" spacing={2} sx={{ marginTop: '10px' }}>
          <Grid item>
            <InputLabel htmlFor="placeholder">
              <div className="label-heading">Placeholder</div>
            </InputLabel>
          </Grid>
          <Grid item>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="placeholder"
                type="text"
                placeholder="Placeholder"
                // size="small"
                fullWidth
                name="placeholder"

                // onChange={handleChange}
                // onBlur={handleBlur}
                // value={values.placeholder}
                // error={Boolean(touched.placeholder && errors.placeholder)}
              />
              {/* {Boolean(touched.placeholder && errors.placeholder) && (
                <FormHelperText error>{errors.placeholder}</FormHelperText>
              )} */}
            </FormGroup>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ marginTop: '10px' }}
          className="required_switch">
          <Grid item>
            <Switch {...label} defaultChecked />{' '}
          </Grid>{' '}
          <Grid item>
            <InputLabel htmlFor="placeholder">
              <div className="label-heading">Required</div>
            </InputLabel>
          </Grid>
          <Grid item>
            <HelpOutlineIcon sx={{ marginBottom: '-5px', color: '#C1C6D4' }} />
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ marginTop: '10px', marginLeft: '5px', width: '100%' }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: ' #C1C6D4' }}
            onClick={goToResponse}>
            Choose Response Type
          </Button>
        </Grid>
      </div>
    </div>
  );
};

export default CustomTextField;
