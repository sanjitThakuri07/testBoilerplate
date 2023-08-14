import { userDataStore } from "globalStates/userData";
import { Button, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Create from "../../assets/icons/create_icon.svg";

export default function DashboardHeader() {
  const { userType, userName } = userDataStore();
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (userType === "Platform_owner") {
      navigate("/add-tenant");
    } else {
      navigate("/add-organization");
    }
  };
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Stack direction="column">
            <Typography variant="h1" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
              Welcome,
            </Typography>
            <Box sx={{ fontSize: "17px", fontWeight: 500 }}>{userName}</Box>
          </Stack>
        </Box>
        <Box sx={{ zIndex: 1, cursor: "pointer" }}>
          <Button
            variant="contained"
            className="login_button"
            sx={{ padding: "10px 20px" }}
            onClick={() => handleRedirect()}
            fullWidth
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              onClick={() => handleRedirect()}
            >
              <Box>
                <Box>Create New</Box>
              </Box>
              <Box>
                <img src={Create} alt="add" />
              </Box>
            </Stack>
          </Button>
        </Box>
      </Stack>
    </>
  );
}
