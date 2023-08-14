import { fetchApI } from "src/modules/apiRequest/apiRequest";
import { Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material";
import React from "react";

const MobileOptions = ({ item, apiItem }: any) => {
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
    checkedC: false,
    checkedD: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div id="MobileOptions">
      <div className="mobile_component_box_wrapper_heading">{item.label}</div>

      <FormGroup>
        <FormControlLabel
          control={<Checkbox name="checkedA" onChange={handleChange} checked={state.checkedA} />}
          label="Option 1"
        />
        <FormControlLabel
          control={<Checkbox name="checkedB" onChange={handleChange} checked={state.checkedB} />}
          label="Option 2"
        />
        <FormControlLabel
          control={<Checkbox name="checkedC" onChange={handleChange} checked={state.checkedC} />}
          label="Option 3"
        />
        <FormControlLabel
          control={<Checkbox name="checkedD" onChange={handleChange} checked={state.checkedD} />}
          label="Others"
        />
      </FormGroup>
      {state.checkedD && <TextField fullWidth id="fullWidth" />}
    </div>
  );
};

export default MobileOptions;
