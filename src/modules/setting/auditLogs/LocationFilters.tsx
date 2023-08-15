import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC } from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const LocationFilters: FC<{
  modelOpen?: boolean;
  onHide: (key: "datepicker" | "location" | "customizedTable") => void;
}> = ({ modelOpen = false, onHide }) => {
  const theme = useTheme();
  const handleClose = () => {
    onHide("location");
  };

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleDelete = (option: string) => {
    setPersonName(personName?.filter((pn) => pn !== option));
  };

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      className="dialog-box"
      open={modelOpen}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        <Grid container spacing={2}>
          <Grid item>
            <div className="icon-holder">
              <img src="src/assets/icons/filter.svg" alt="" />
            </div>
          </Grid>
          <Grid item>
            <Typography component="h3" variant="h6">
              Apply Countries
            </Typography>
            <Typography component="p" variant="body1">
              Please select the country.
            </Typography>
          </Grid>
        </Grid>
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Grid
          container
          spacing={4}
          className="formGroupItem"
          sx={{
            pr: 0,
          }}
        >
          <Grid item xs={4}>
            <InputLabel htmlFor="country">
              <div className="label-heading">Select Country</div>
            </InputLabel>
          </Grid>
          <Grid item xs={8}>
            <Select
              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
              id="country"
              multiple
              value={personName}
              onChange={handleChange}
              //   input={<OutlinedInput label="Name" />}
              //   MenuProps={MenuProps}
              className="select-country-pills"
            >
              {names.map((name) => (
                <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <Typography variant="body1" component="h6">
          Recents
        </Typography>
        <Box className="pill-holder">
          {personName?.map((pill) => (
            <Chip key={pill} label={pill} onDelete={() => handleDelete(pill)} variant="outlined" />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button variant="outlined" size="large" fullWidth>
              Reset All
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" size="large" fullWidth>
              Apply
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default LocationFilters;
