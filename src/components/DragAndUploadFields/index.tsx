import { Box, IconButton, Stack } from "@mui/material";
import MouseIcon from "@mui/icons-material/Mouse";

export default function DragAndUploadFields({ title }: any) {
  return (
    <Box sx={{ py: 2 }}>
      {/* fields container */}
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Box>
          <IconButton size="small">
            {/* <DeleteOutlinedIcon /> */}
            <MouseIcon />
          </IconButton>
        </Box>
        <Box>{title ?? "Click to select fields from the left panel"}</Box>
      </Stack>
    </Box>
  );
}
