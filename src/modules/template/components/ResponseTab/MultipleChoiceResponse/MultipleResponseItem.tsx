import { Button, Chip, Grid } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ComponentWrapper, { MultipleResponseWrapper } from "src/modules/template/components/Wrapper";

export interface MultitpleResponseItemProps {
  open?: any;
  multipleResponseItem?: any;
  onClick?: any;
}

const MultipleResponseItem = ({
  open,
  multipleResponseItem,
  onClick,
}: MultitpleResponseItemProps) => {
  return {
    body: (
      <>
        <Grid container id="MultipleResponseItem" spacing={2}>
          <Grid item xs={3}>
            {/* <Button
            variant="outlined"
            onClick={() => {
              // setIsAddLogicClicked(!isAddLogicClicked);
            }}>
            Add Logic
          </Button> */}
          </Grid>
        </Grid>
      </>
    ),
    label: (
      <MultipleResponseWrapper onClick={onClick}>
        <div className="label-chips-container" style={{ display: "flex", gap: "8px" }}>
          {multipleResponseItem?.options.slice(0, 2).map((option: any, index: number) => (
            <div className="label-chips" key={index}>
              <Chip
                className="label-chips__block"
                icon={
                  <FiberManualRecordIcon
                    style={{
                      fontSize: "10px",
                      marginLeft: "3px",
                      color: option.color_code === "#FFFFFF" ? "#000000" : option.color_code,
                    }}
                  />
                }
                style={{
                  // backgroundColor: option.color_code,
                  color: option.color_code === "#FFFFFF" ? "#000000" : option.color_code,
                }}
                label={option.name}
                size="small"
                variant="outlined"
              />{" "}
            </div>
          ))}
          {multipleResponseItem?.options?.length > 2 ? (
            <span>+{multipleResponseItem?.options?.length - 2}</span>
          ) : (
            <></>
          )}
        </div>
      </MultipleResponseWrapper>
    ),
  };
};

export default MultipleResponseItem;
