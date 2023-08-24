import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
// import './index.scss';

const FullPageLoader = ({ className, style = {} }: any) => {
  return (
    <Box
      className={`fullpage__loader ${className ? className : ""}`}
      sx={{ display: "flex", ...style }}
    >
      <CircularProgress />
    </Box>
  );
};

export default FullPageLoader;
