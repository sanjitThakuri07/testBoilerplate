import { Button, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import NotFoundImage from "src/assets/images/404Image.svg";
import LeftArrowIcon from "src/assets/icons/left_arrow.svg";
import { useNavigate } from "react-router-dom";
import { userDataStore } from "src/store/zustand/globalStates/userData";

export default function PageNotFound() {
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

  function StartIcon() {
    return <img src={LeftArrowIcon} alt="" />;
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", height: "100vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" height="100%">
        {/* left section */}
        <Box sx={{ display: "flex", alignItems: "center", p: 3, width: "100%" }}>
          <Stack direction="column">
            <Box>
              <span style={{ color: "#283352", fontWeight: "600" }}>404 Error</span>
            </Box>
            <Box sx={{ color: "#384874", fontSize: "50px", mt: 1, fontWeight: "600" }}>
              Page not found
            </Box>
            <Box sx={{ color: "#475467", fontSize: "16px", mt: 2, fontWeight: "300" }}>
              <Box>
                <div>Sorry, the page you are looking for doesn't exist.</div>
              </Box>
              <Box>
                <div>Here are some helpful links:</div>
              </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<StartIcon />} onClick={() => navigate(-1)}>
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
            <img src={NotFoundImage} alt="page_not_found" />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
