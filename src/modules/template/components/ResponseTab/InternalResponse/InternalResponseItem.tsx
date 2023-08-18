import { Typography } from "@mui/material";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ComponentWrapper, {
  MultipleResponseWrapper,
  LabelWrapper,
} from "src/modules/template/components/Wrapper";

export interface InternalResponseItemProps {
  open?: any;
  internalResponseItem?: any;
  onClick?: any;
}

const InternalResponseItem = ({
  open,
  internalResponseItem,
  onClick,
}: InternalResponseItemProps) => {
  return {
    body: <></>,
    label: <LabelWrapper title={internalResponseItem?.name} onClick={onClick}></LabelWrapper>,
  };
};

export default InternalResponseItem;
