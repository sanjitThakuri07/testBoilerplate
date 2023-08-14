import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { Box } from '@mui/material';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
import './GeoLocation.scss';

export default function GeoLocationMap({
  handleMapClick,
  setMapStates,
  mapStates,
  mapWidth = '260px',
}) {
  return (
    <>
      <Box className="GeoLocationMapContainer" sx={{ width: mapWidth }}>
        <Box className="locate-near-by" onClick={() => mapStates?.map?.panTo(mapStates?.center)}>
          <Box className="locate-near-by-inner">
            <NearMeRoundedIcon sx={{ fontSize: '22px' }} />
          </Box>
        </Box>
        {/* map */}
        <GoogleMap
          className="map-main-container"
          onClick={handleMapClick}
          center={mapStates?.center}
          mapContainerStyle={{ height: '100%', width: '100%' }}
          zoom={10}
          // options={{
          //   mapTypeControl: false,
          //   streetViewControl: false,
          // }}

          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
          onLoad={(map) => {
            setMapStates((prev) => {
              return {
                ...prev,
                map,
              };
            });
          }}>
          {/* markers and places components will be renderere here */}
          <MarkerF position={mapStates?.center} />
        </GoogleMap>
      </Box>
    </>
  );
}
