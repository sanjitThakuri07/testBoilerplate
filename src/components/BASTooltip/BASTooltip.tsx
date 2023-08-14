import styled from "@emotion/styled";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { Box, Stack } from "@mui/material";

interface TooltipInterface {
  label?: string;
  tooltipPlacement?: any;
  children?: React.ReactNode;
}

export default function BASTooltip({ label, tooltipPlacement, children }: TooltipInterface) {
  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: `#384874`,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: `#384874`,
      borderRadius: "8px",
    },
  }));

  // organizations tooltip
  const toolTipHandler = () => {
    return (
      <Box sx={{ p: 0.3, px: 1 }}>
        <Stack direction="column">
          <Box sx={{ fontWeight: 500, fontSize: "11px" }}>{label}</Box>
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <BootstrapTooltip
        placement={tooltipPlacement}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        arrow
        title={toolTipHandler()}
      >
        <Box
          color="#475467"
          // sx={{
          //   '&:hover': {
          //     textDecoration: 'underline #475467',
          //   },
          // }}
        >
          {children}
        </Box>
      </BootstrapTooltip>
    </>
  );
}
