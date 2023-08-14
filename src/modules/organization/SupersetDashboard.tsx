import { Box } from "@mui/material";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { useEffect } from "react";

const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImZpcnN0X25hbWUiOiJCQVMiLCJ1c2VybmFtZSI6ImJhcyIsImxhc3RfbmFtZSI6IlVzZXIifSwicmVzb3VyY2VzIjpbeyJpZCI6IjY5NmRhYzM2LTA4MzMtNDE5Yi05ZDhiLTdlOWIzYWVlNmZjMiIsInR5cGUiOiJkYXNoYm9hcmQifV0sInJsc19ydWxlcyI6W10sImlhdCI6MTY4OTc1MzE1My4wMDYyMTUsImV4cCI6MTY5NDA3MzE1My4wMDYyMTUsImF1ZCI6Imh0dHA6Ly8wLjAuMC4wOjgwODAvIiwidHlwZSI6Imd1ZXN0In0.06FutbvZ6Nnmj1eES93mSAcKeBZrOriWMQ1ArFHUdkw";
// const fetchGuestTokenFromBackend = async (userInfo: any) => {
//   let guestJwtToken: string;
//   const payload = {
//     user: userInfo,
//     resources: [{ type: 'dashboard', id: process.env.VITE_SUPERSET_UUID }],
//     rls: [{ clause: `clientId=${userInfo?.clientId}` }],
//   };
//   const { data, status } = await postAPI(
//     process.env.VITE_GUEST_TOKEN_API || 'http://default_guest_token_url',
//     payload,
//   );
//   if (status === 200 || (status > 200 && status < 300)) {
//     guestJwtToken = data?.token;
//   }
//   console.log('guestJwtToken Received', guestJwtToken);
// };

// const fetchGuestTokenFromSuperset = async () => {
//   try {
//     const { data, status } = await axios.post(
//       'https://superset-bas-dev.bridge.propelmarine.com/security/guest_token/',
//       {
//         user: {
//           first_name: 'BAS',
//           last_name: 'User',
//           username: 'bas',
//         },
//         rls: [],
//         resources: [
//           {
//             type: 'dashboard',
//             id: '696dac36-0833-419b-9d8b-7e9b3aee6fc2',
//           },
//         ],
//       },
//       {
//         headers: {
//           // 'Content-Type': 'application/json',
//           Authorization: `Bearer ${access_token}`, // das ist ist das Token aus dem ersten Request
//         },
//       },
//     );
//     console.log({ data, status });
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

async function fetchGuestToken() {
  // console.log('fetch guest token');
  return process.env.VITE_GUEST_TOKEN || "";
}

function SupersetDashboard() {
  const { userName, userType, clientId, ...rest } = userDataStore();

  useEffect(() => {
    embedDashboard({
      id: "696dac36-0833-419b-9d8b-7e9b3aee6fc2", // given by the Superset embedding UI
      supersetDomain: "https://superset-bas-dev.bridge.propelmarine.com",
      mountPoint: document.getElementById("superset-container") as HTMLElement, // any html element that can contain an iframe
      // fetchGuestToken: async () => {
      //   const token = await fetchGuestTokenFromBackend({ userName, userType, clientId });
      //   console.log('token', token);
      //   return token;
      // },
      fetchGuestToken,
      dashboardUiConfig: {
        // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional)
        hideTitle: true,
        filters: {
          expanded: false,
        },
      },
    });
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            border: "4px solid #283352",
            width: "100%",
            "&>iframe": {
              width: "100%",
              height: "90vh",
              border: "none",
            },
          }}
          id="superset-container"
        >
          <iframe id="superset-container" title="BAS Dashboard" />
        </Box>
      </div>

      {/* <button
        onClick={() =>
          embedDashboard({
            id: '696dac36-0833-419b-9d8b-7e9b3aee6fc2', // given by the Superset embedding UI
            supersetDomain: 'https://superset-bas-dev.bridge.propelmarine.com',
            mountPoint: document.getElementById('superset-container') as HTMLElement, // any html element that can contain an iframe
            // fetchGuestToken: async () => {
            //   const token = await fetchGuestTokenFromBackend({ userName, userType, clientId });
            //   console.log('token', token);
            //   return token;
            // },
            fetchGuestToken: async () => {
              console.log('fetch');
              return token;
            },
            dashboardUiConfig: {
              // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional)
              hideTitle: true,
              filters: {
                expanded: false,
              },
            },
          })
        }>
        start chart
      </button> */}

      {/* <button
        onClick={async () => {
          const result = await fetchGuestTokenFromBackend({ userName, userType, clientId });
          console.log({ result });
        }}>
        FetchGuestTokenTest
      </button> */}

      {/* <button onClick={fetchGuestTokenFromSuperset}>FetchGuestTokenFromSuperset</button> */}
    </div>
  );
}

export default SupersetDashboard;
