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
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getAPI } from "src/lib/axios";
import { useDashboardFilter } from "globalStates/dashboardFilter";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface CountryFilterProps {
  locationModal: boolean;
  setLocationModal: any;
  locations: any;
  setLocations: any;
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

function getStyles(name: string, countryFilters: string[], theme: Theme) {
  return {
    fontWeight:
      countryFilters.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const CountryFilter = ({
  locationModal,
  setLocationModal,
  locations,
  setLocations,
}: CountryFilterProps) => {
  const { setCountryFilters } = useDashboardFilter();

  const theme = useTheme();

  // country list
  const [allCounties, setAllCountries] = React.useState([]);

  const handleDelete = (option: any) => {
    setLocations(locations?.filter((loca: any) => loca.id !== option.id));
  };

  const getAllCountryList = async (): Promise<void> => {
    try {
      const { status, data } = await getAPI("config/country");
      if (status === 200) {
        setAllCountries(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCountryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = (e: any) => {
    e.preventDefault();
    setCountryFilters([...locations]);
    setLocationModal(false);
  };

  return (
    <Dialog
      onClose={() => setLocationModal(false)}
      aria-labelledby="customized-dialog-title"
      className="dialog-box"
      open={locationModal}
    >
      <form onSubmit={submitHandler}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setLocationModal(false)}>
          <Grid container spacing={2}>
            <Grid item>
              <div className="icon-holder">
                <img src="/assets/icons/filter.svg" alt="" />
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
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                className="select-country-pills"
              >
                {allCounties?.map((country: any) => {
                  const { id, name } = country;
                  return (
                    <MenuItem key={id} value={country} style={getStyles(name, allCounties, theme)}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
          </Grid>
          <Typography variant="body1" component="h6">
            Recents
          </Typography>
          <Box className="pill-holder">
            {locations?.map((locat: any) => {
              const { id, name } = locat;
              return (
                <Chip
                  key={id}
                  label={name}
                  onDelete={() => handleDelete(locat)}
                  variant="outlined"
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button variant="outlined" size="large" fullWidth onClick={() => setLocations([])}>
                Reset All
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                Apply
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CountryFilter;
