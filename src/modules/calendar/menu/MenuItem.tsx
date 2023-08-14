import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface CustomMenuItemProps {
  repeatEvent: string;
}

const ITEM_HEIGHT = 48;

const CustomMenuItem = (repeatEvent: CustomMenuItemProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [value, setValue] = React.useState('1');
  const open = Boolean(anchorEl);

  let options: string[] = [];
  let monthOptions: string[] = [];

  const numberOptions = () => {
    for (let i = 0; i < 99; i += 1) {
      options.push(`${i + 1}`);
    }

    for (let i = 0; i < 31; i += 1) {
      monthOptions.push(`${i + 1}`);
    }
  };

  numberOptions();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
    setValue(e.currentTarget.innerText);
  };

  const handleMenuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
      }}>
      Repeat every {value}
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}>
        <KeyboardArrowDownIcon
          style={{
            fontSize: '19px',
          }}
        />
      </IconButton>
      {repeatEvent.repeatEvent === 'week'
        ? 'week on'
        : repeatEvent.repeatEvent === 'month'
        ? 'of month'
        : repeatEvent.repeatEvent === 'year'
        ? 'year on'
        : null}
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onChange={(e: any) => {
          handleMenuChange(e);
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '10ch',
          },
        }}>
        {repeatEvent.repeatEvent === 'week'
          ? options.map((option) => (
              <MenuItem key={option} onClick={handleClose}>
                {option}
              </MenuItem>
            ))
          : repeatEvent.repeatEvent === 'month'
          ? monthOptions.map((option) => (
              <MenuItem key={option} onClick={handleClose}>
                {option}
              </MenuItem>
            ))
          : repeatEvent.repeatEvent === 'year'
          ? null
          : null}
      </Menu>
    </div>
  );
};

export default CustomMenuItem;
