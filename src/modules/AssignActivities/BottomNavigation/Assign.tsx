import * as React from 'react';
import {
  AppBar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import CloseIcon from '@mui/icons-material/Close';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function MultipleSelect({ setSelectValues, selectValues, assignUser, selectedData }: any) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <div
        style={{ overflow: 'hidden' }}
        //   className="assign__box-popup"
      >
        <div style={{ width: '320px' }}>
          <DialogTitle className="popup__heading">
            Assign To
            <IconButton onClick={() => {}} className="close__icon">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <div className="content">
            <Typography>Select Asignee</Typography>
            <div className="select__wrapper">
              <Select
                id="my"
                multiple
                value={personName}
                onChange={async (e: any) => {
                  //   setSelectValues((prev: any) => ({
                  //     ...prev,
                  //     assignUser: e.target.value,
                  //   }));
                  //   const values = {
                  //     activities_id: selectedData?.map((data: any) => data?.id),
                  //     users: e.target.value,
                  //   };
                  handleChange(e);
                }}
                MenuProps={{
                  PaperProps: { style: { maxHeight: 200 } },
                }}>
                {names?.map((item: any, index: number) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Name" />}
                MenuProps={MenuProps}>
                {names.map((name) => (
                  <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <DialogActions className="actions__container">
            <Button onClick={() => {}} variant="contained" className="close__button">
              Assign
            </Button>
            <Button onClick={() => {}} variant="outlined" className="close__button">
              Close
            </Button>
          </DialogActions>
        </div>
      </div>
      {/* <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}>
          {names.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
    </div>
  );
}

export default MultipleSelect;
