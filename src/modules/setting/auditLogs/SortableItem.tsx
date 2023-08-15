import { IOSSwitch } from "src/components/switch/IosSwitch";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grid, Stack, Typography } from "@mui/material";

function SortableItem(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 5,
  };

  return (
    <div ref={props?.disabled ? null : setNodeRef} style={style} {...attributes}>
      <Grid container spacing={1}>
        <Grid item>
          <img
            src="src/assets/icons/dots.svg"
            alt=""
            {...(props?.disabled ? {} : { ...listeners })}
          />
        </Grid>
        <Grid item>
          <IOSSwitch
            checked={props.item.show}
            onChange={(ev) => props.handleSwitchChange(ev, props.item.id)}
            disabled={props?.disabled}
            disableText
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle2">{props.item.label}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default SortableItem;
