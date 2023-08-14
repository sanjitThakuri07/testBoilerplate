import {
  Box,
  CircularProgress,
  CircularProgressProps,
  circularProgressClasses,
} from "@mui/material";

// Inspired by the former Facebook spinners.

function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ position: "relative", width: "fit-content" }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
          }}
          size={16}
          thickness={6}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: (theme) => (theme.palette.mode === "light" ? "#2b89fc" : "#0c69dc"),
            animationDuration: "450ms",
            position: "absolute",
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
          size={16}
          thickness={6}
          {...props}
        />
      </Box>
    </div>
  );
}

export default FacebookCircularProgress;
