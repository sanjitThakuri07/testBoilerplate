import { Box, Stack } from "@mui/system";
import NoDataFoundImg from "../assets/images/no_data_found.svg";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { userDataStore } from "src/store/zustand/globalStates/userData";

interface NoDataFoundProps {
  link?: string;
  title: string;
  isButtonDisplayed?: boolean;
}

export default function NoDataFound({ link, title, isButtonDisplayed }: NoDataFoundProps) {
  const navigate = useNavigate();
  const { userType } = userDataStore();

  const navigateHandler = () => {
    link && navigate(link);
  };

  return (
    <Stack
      sx={{ width: "100%", mt: 8 }}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Box>
          <img src={NoDataFoundImg} alt="no_data_found" />
        </Box>

        <Box sx={{ color: "#384874", fontSize: "19px", mt: 2.5, fontWeight: 600 }}>
          No {title} Found
        </Box>
        <Box sx={{ color: "#475467;", fontSize: "15px", mt: 1, fontWeight: 300 }}>
          Add Your new {title.charAt(0).toLocaleLowerCase() + title.slice(1)} here
        </Box>

        {isButtonDisplayed && (
          <Button
            onClick={navigateHandler}
            startIcon={<AddIcon />}
            sx={{
              background: "#33426A",
              color: "#fff",
              px: 2,
              mt: 3,
              "&:hover": {
                background: "#283352",
              },
            }}
          >
            {`Create ${title}`}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
