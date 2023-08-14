import { Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { LabelWrapper } from 'containers/template/components/Wrapper';

export interface GlobalResponseItemProps {
  open?: any;
  globalResponseItem?: any;
  onClick?: any;
}

const GlobalResponseItem = ({ open, globalResponseItem, onClick }: GlobalResponseItemProps) => {
  return {
    body: <></>,
    label: <LabelWrapper title={globalResponseItem?.name} onClick={onClick} />,
  };
};

export default GlobalResponseItem;
