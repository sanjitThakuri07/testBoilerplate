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
import React, { FC, useEffect, useState } from 'react';
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
import { HeadCell } from './BASDataTable';
import SortableItem from 'containers/setting/auditLogs/SortableItem';
import { defaultDisable } from './BASDataTable';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const leadcellsLocal = localStorage.getItem('headCells');
const LocalHeadcells = leadcellsLocal ? JSON.parse(leadcellsLocal) : leadcellsLocal;

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

const TableColumns: FC<{
  modelOpen?: boolean;
  onHide: () => void;
  headCells: HeadCell[];
  onUpdate: (headCells: HeadCell[]) => void;
}> = ({ modelOpen = true, onHide, headCells, onUpdate }) => {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
  const [items, setItems] = useState<HeadCell[]>(headCells);

  const handleClose = () => {
    onHide();
  };

  const handleDragStart = (props: any) => {};
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    // const disableDrop =
    //   over.data.current.sortable.index === headCells.find((hc) => hc.action !== undefined)?.index;

    if (active?.id && over?.id && active?.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((it) => it.id === active.id);
        const newIndex = items.findIndex((it) => it.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragCancel = () => {};

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setItems(
      items.map((it) => {
        if (it.id === id) {
          return {
            ...it,
            show: !it.show,
          };
        }
        return it;
      }),
    );

    localStorage.setItem('headCells', JSON.stringify(items));
  };

  const handleReset = () => {
    setItems((prev: any) => {
      return prev?.map((data: any) => ({
        ...data,
        show: defaultDisable?.includes(data?.id) ? false : true,
      }));
    });
  };

  const handleUpdate = () => {
    const updateCellsIndex = [...items]?.map((it, index) => {
      return {
        ...it,
        index,
      };
    });
    onUpdate(updateCellsIndex);
    // localStorage.setItem('headCells', JSON.stringify(updateCellsIndex));
  };

  useEffect(() => {
    // if (LocalHeadcells) {
    //   setItems(LocalHeadcells);
    // } else {
    //   setItems(headCells);
    // }
    if (headCells) {
      setItems(headCells);
    }
  }, [headCells]);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      className="dialog-box config-head-cells"
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
              <SortableItem
                key={x?.id}
                id={x?.id}
                handleSwitchChange={handleSwitchChange}
                item={x}
                disabled={!!x?.action}
              />
            ))}
          </SortableContext>

          {/* <SortableContext items={LocalHeadcells}>
            {LocalHeadcells &&
              LocalHeadcells.map((x: any) => (
                <SortableItem
                  key={x.id}
                  id={x.id}
                  handleSwitchChange={handleSwitchChange}
                  item={x}
                  disabled={!!x.action}
                />
              ))}
          </SortableContext> */}
        </DndContext>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button variant="outlined" size="large" fullWidth onClick={handleReset}>
              Reset
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" size="large" fullWidth onClick={handleUpdate}>
              Update
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default TableColumns;
