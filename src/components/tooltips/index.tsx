/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Tooltip, TooltipProps } from '@mui/material';
export const CommonTooltip = ({
  children,
  placement = 'bottom',
  ...rest
}: TooltipProps) => {
  return (
    <Tooltip {...{ placement, ...rest }} arrow>
      {children}
    </Tooltip>
  );
};
