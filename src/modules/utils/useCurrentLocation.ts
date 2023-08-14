// import React, { useState, useEffect } from "react";

import { useEffect, useState } from "react";

// interface Location {
//   lat: number;
//   lng: number;
// }

// interface Props {}

// const Map: React.FC<Props> = () => {
//   const [map, setMap] = useState<google.maps.Map>();
//   const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();
//   const [browserHasGeolocation, setBrowserHasGeolocation] =
//     useState<boolean>(true);

//   useEffect(() => {
//     const initMap = (): void => {
//       const googleMap = new google.maps.Map(
//         document.getElementById("map") as HTMLElement,
//         {
//           center: { lat: -34.397, lng: 150.644 },
//           zoom: 6,
//         }
//       );

//       const googleInfoWindow = new google.maps.InfoWindow();

//       const locationButton = document.createElement("button");

//       locationButton.textContent = "Pan to Current Location";
//       locationButton.classList.add("custom-map-control-button");

//       googleMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
//         locationButton
//       );

//       locationButton.addEventListener("click", () => {
//         // Try HTML5 geolocation.
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             (position: GeolocationPosition) => {
//               const pos: Location = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude,
//               };

//               googleInfoWindow.setPosition(pos);
//               googleInfoWindow.setContent("Location found.");
//               googleInfoWindow.open(googleMap);
//               googleMap.setCenter(pos);
//             },
//             () => {
//               handleLocationError(
//                 true,
//                 googleInfoWindow,
//                 googleMap.getCenter()!
//               );
//             }
//           );
//         } else {
//           // Browser doesn't support Geolocation
//           handleLocationError(false, googleInfoWindow, googleMap.getCenter()!);
//         }
//       });

//       setMap(googleMap);
//       setInfoWindow(googleInfoWindow);
//     };

//     const handleLocationError = (
//       browserHasGeolocation: boolean,
//       infoWindow: google.maps.InfoWindow,
//       pos: google.maps.LatLng
//     ) => {
//       infoWindow.setPosition(pos);
//       infoWindow.setContent(
//         browserHasGeolocation
//           ? "Error: The Geolocation service failed."
//           : "Error: Your browser doesn't support geolocation."
//       );
//       infoWindow.open(map!);
//       setBrowserHasGeolocation(false);
//     };

//     if (!window.google) {
//       const script = document.createElement("script");
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
//       script.async = true;
//       script.defer = true;

//       document.head.appendChild(script);

//       script.addEventListener("load", () => {
//         initMap();
//       });
//     } else {
//       initMap();
//     }
//   }, []);

//   return <div id="map" style={{ height: "100vh", width: "100%" }}></div>;
// };

// export default Map;

// import React, { useState, useEffect } from "react";

// interface Location {
//   latitude: number;
//   longitude: number;
// }

// const MyComponent: React.FC = () => {

//   return (
//     <div>
//       {currentLocation ? (
//         <p>
//           Your current location is: {currentLocation.latitude},{" "}
//           {currentLocation.longitude}
//         </p>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default MyComponent;

interface Location {
  latitude: null | number;
  longitude: null | number;
}

export const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<any>({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator?.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          setCurrentLocation({ latitude, longitude });
        },
        (error) => {
          console.error(error);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return currentLocation;
};
