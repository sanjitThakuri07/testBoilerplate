import { Button, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import NotFoundImage from "src/assets/images/404Image.svg";
import { ReactComponent as LeftArrowIcon } from "src/assets/icons/left_arrow.svg";
import { useNavigate } from "react-router-dom";
import { userDataStore } from "src/store/zustand/globalStates/userData";

export default function _401() {
  const navigate = useNavigate();
  const { userType } = userDataStore();

  const redirectHandler = () => {
    if (userType === "Platform_owner") {
      navigate("/dashboard");
    } else if (userType === "Tenant") {
      navigate("/dashboard");
    } else if (userType === "Organization") {
      navigate("/organization/no-data");
    } else if (userType === "Customer") {
      navigate("/organization/no-data");
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", height: "100vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" height="100%">
        {/* left section */}
        <Box sx={{ display: "flex", alignItems: "center", p: 3, width: "100%" }}>
          <Stack direction="column">
            <Box>
              <span style={{ color: "#283352", fontWeight: "600" }}>401 Error</span>
            </Box>
            <Box sx={{ color: "#384874", fontSize: "50px", mt: 1, fontWeight: "600" }}>
              Not Authorized
            </Box>
            <Box sx={{ color: "#475467", fontSize: "16px", mt: 2, fontWeight: "300" }}>
              <Box>
                <div>Sorry, you're not authorized to view the requested page.</div>
              </Box>
              <Box>
                <div>Here are some helpful links:</div>
              </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<LeftArrowIcon />}
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
                <Button variant="contained" onClick={() => redirectHandler()}>
                  Take me home
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
        {/* image section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            px: 3,
          }}
        >
          <Box>
            <h1 style={{ fontSize: "8rem" }}>401</h1>
            {/* <img src={NotFoundImage} alt="page_not_found" /> */}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
