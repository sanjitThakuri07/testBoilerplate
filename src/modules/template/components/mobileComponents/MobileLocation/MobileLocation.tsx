import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GeoLocationMap from "src/components/GeoLocationMap/GeoLocationMap";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import { useTemplateFieldsStore } from "src/modules/template/store/templateFieldsStore";

const MobileLocation = ({ dataItem, disabled }: any) => {
  const { updateTemplateDatasets, templateDatasets } = useTemplateFieldsStore();

  const [showInitialMap, setShowInitialMap] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [mapComponents, setMapComponents] = useState<string | number>("map");
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [prevsSearch, setPrevSearch] = useState<string>("");
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAev649XX6K6piIjUCtkw7YHWJb6OS09Fg",
    libraries: ["places"],
  });
  const [open, setOpen] = useState<boolean>(false);

  // map states
  const [mapStates, setMapStates] = useState<any>({
    searchResults: null,
    map: null,
    center: {
      lat: -32.1040861,
      lng: 115.811615,
    },
    address: {
      name: "",
      formatted_address: "",
    },
  });

  const [resetFilter, setResetFilter] = useState<any>(null);
  const [locateMe, setLocateMe] = useState<boolean>(false);
  const [mapValue, setMapValue] = useState<string>("Propel Marine");

  const placeChangeHandler = () => {
    if (mapStates?.searchResults !== null) {
      const place = mapStates?.searchResults?.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      setMapStates((prev: any) => {
        return {
          ...prev,
          center: {
            lat,
            lng,
          },
          address: {
            name: place?.name,
            formatted_address: place?.formatted_address,
          },
        };
      });
      setResetFilter({
        lat,
        lng,
      });
    } else {
      console.log("please enter text...");
    }
  };

  //   get current location
  const getCurrentLocation = () => {
    if (locationSearch) {
      setLocationSearch("");
    }
    setLocateMe(true);

    if (navigator?.geolocation) {
      setButtonLoader(true);
      navigator?.geolocation.getCurrentPosition((position) => {
        const {
          coords: { latitude, longitude },
        } = position;
        console.log(position);
        setMapStates((prev: any) => {
          return {
            ...prev,
            center: {
              lat: latitude,
              lng: longitude,
            },
            address: {
              name: "",
              formatted_address: "",
            },
          };
        });
        setButtonLoader(false);
      });
    }
  };

  const handleReverseGeocode = (result: any) => {
    if (result[0]) {
      // setAddress(result[0].formatted_address);
      console.log(result[0].formatted_address);
      setMapStates((prev: any) => {
        return {
          ...prev,
          address: {
            name: "",
            formatted_address: result[0]?.formatted_address,
          },
        };
      });
    } else {
      // setAddress("No address found");
      console.log("Address Not Found");
    }
  };

  // when map is clicked
  const handleMapClick = (event: any) => {
    // getting the coordinates whent the marker is set
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMapStates((prev: any) => {
      return {
        ...prev,
        center: {
          lat,
          lng,
        },
      };
    });
    // reversing the coordinates into address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: mapStates.center.lat, lng: mapStates.center.lng } },
      handleReverseGeocode,
    );
  };

  const cancelHandler = () => {
    setLocationSearch(prevsSearch);
    if (locateMe) {
      setButtonLoader(false);
      setMapStates((prev: any) => {
        return {
          ...prev,
          center: { ...resetFilter },
        };
      });
      return;
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Data Updated Successfully
        </Alert>
      </Snackbar>

      <div id="MobileLocation">
        {!showInitialMap && (
          <Box mt={1}>
            <Button
              fullWidth
              sx={{ py: 1.5 }}
              variant="contained"
              onClick={() => setShowInitialMap(true)}
            >
              Add Location
            </Button>
          </Box>
        )}

        {/* hidden maps contents */}
        {showInitialMap &&
          (mapComponents === "map" ? (
            <Box>
              {!isLoaded && <div>Loading...</div>}
              {/* search locations */}
              <Autocomplete
                onPlaceChanged={placeChangeHandler}
                onLoad={(autocomplete: any) => {
                  setMapStates((prev: any) => {
                    return {
                      ...prev,
                      searchResults: autocomplete,
                    };
                  });
                }}
              >
                <TextField
                  fullWidth
                  value={locationSearch}
                  placeholder="Enter address"
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setPrevSearch(e.target.value);
                  }}
                  id="fullWidth"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Autocomplete>

              {/* map component */}
              <div className="mobile_map_location" style={{ marginTop: "10px" }}>
                <GeoLocationMap
                  handleMapClick={handleMapClick}
                  mapStates={mapStates}
                  setMapStates={setMapStates}
                />
              </div>

              {/* actions button */}
              <div className="mobile_map_buttons" style={{ marginTop: "10px" }}>
                <div className="map_buttons_container">
                  <Stack spacing={2} direction="row" sx={{ width: "100%" }}>
                    <Button variant="outlined" fullWidth onClick={cancelHandler}>
                      Cancel
                    </Button>
                    <Button
                      onClick={getCurrentLocation}
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#C1C6D4",
                        color: "#283352",
                        "&:hover": {
                          color: "#fff",
                        },
                      }}
                      disabled={buttonLoader ? true : false}
                    >
                      {buttonLoader ? <ButtonLoaderSpinner /> : "Locate me"}
                    </Button>
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    style={{ marginTop: "10px" }}
                    onClick={() => setMapComponents("map-apply")}
                  >
                    Save and Apply
                  </Button>
                </div>
              </div>
            </Box>
          ) : (
            <Box>
              <Stack direction="column">
                {/* input state */}
                <TextareaAutosize
                  minRows={2.6}
                  placeholder="Update Address"
                  className={`text__area-style geomap-text-area`}
                  onChange={(ev) => setMapValue(ev.target.value)}
                  value={mapStates?.address?.formatted_address}
                />

                {/* actions buttons */}
                <Stack direction="row" spacing={2} mt={2}>
                  <Button variant="outlined" fullWidth onClick={() => setMapComponents("map")}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      updateTemplateDatasets(dataItem, "value", mapStates);
                      setOpen(true);
                    }}
                    sx={{
                      backgroundColor: "#C1C6D4",
                      color: "#283352",
                      "&:hover": {
                        color: "#fff",
                      },
                    }}
                  >
                    Apply
                  </Button>
                </Stack>
              </Stack>
            </Box>
          ))}
      </div>
    </>
  );
};

export default MobileLocation;
