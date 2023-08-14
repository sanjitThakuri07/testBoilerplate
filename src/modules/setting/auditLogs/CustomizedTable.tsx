import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React, { FC, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const CustomizedTable: FC<{
  modelOpen?: boolean;
  onHide: (key: 'datepicker' | 'location' | 'customizedTable') => void;
}> = ({ modelOpen = true, onHide }) => {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
  const [items, setItems] = useState<{ id: number; label: string; checked: boolean }[]>([
    {
      id: 1,
      label: 'Name',
      checked: true,
    },
    {
      id: 2,
      label: 'Location',
      checked: true,
    },
    {
      id: 3,
      label: 'Time Stamp',
      checked: true,
    },
    {
      id: 4,
      label: 'Event Description',
      checked: false,
    },
    {
      id: 5,
      label: 'Example',
      checked: false,
    },
    {
      id: 6,
      label: 'Example',
      checked: true,
    },
    {
      id: 7,
      label: 'Example',
      checked: false,
    },
    {
      id: 8,
      label: 'Example',
      checked: false,
    },
    {
      id: 9,
      label: 'Example',
      checked: false,
    },
  ]);

  const handleClose = () => {
    onHide('customizedTable');
  };

  const handleDragStart = (props: any) => {};
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active?.id && over?.id && active?.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((it) => it.id === active.id);
        const newIndex = items.findIndex((it) => it.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragCancel = () => {};

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    setItems(
      items.map((it) => {
        if (it.id === id) {
          return {
            ...it,
            checked: !it.checked,
          };
        }
        return it;
      }),
    );
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      className="dialog-box"
      open={modelOpen}>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        <Grid container spacing={2}>
          <Grid item>
            <div className="icon-holder">
              <img src="/assets/icons/featured.svg" alt="" />
            </div>
          </Grid>
        </Grid>
      </BootstrapDialogTitle>
      <DialogContent>
        <Typography variant="h6" component="h6">
          Customize Table
        </Typography>
        <Typography variant="body1" component="p">
          Show/Hide columns in the table.
        </Typography>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          sensors={sensors}>
          <SortableContext items={items}>
            {items.map((x) => (
              <SortableItem key={x.id} id={x.id} handleSwitchChange={handleSwitchChange} item={x} />
              // <Stack direction="row" spacing={1} alignItems="center">
              //   <img src="/assets/icons/dots.svg" />
              //   <IOSSwitch
              //     defaultChecked={x.checked}
              //     onChange={ev => handleSwitchChange(ev, x.id)}
              //   />
              //   <Typography variant="subtitle2">{x.label}</Typography>
              // </Stack>
              //   </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button variant="outlined" size="large" fullWidth>
              Reset
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" size="large" fullWidth>
              Update
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default CustomizedTable;
