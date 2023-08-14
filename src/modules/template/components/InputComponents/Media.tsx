import { Chip, Grid, Menu, MenuItem, TextField } from '@mui/material';
import React, { FC } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AddIcon from '@mui/icons-material/Add';
import MediaIcon from 'assets/template/icons/media.png';
import { useTemplateFieldsStore } from 'containers/template/store/templateFieldsStore';

type MediaProps = {
  responseTypeId?: any;
  dataItem?: any;
};

const Media = ({ responseTypeId, dataItem, isQuestionFocused }: any) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [isAddLogicClicked, setIsAddLogicClicked] = React.useState<boolean>(false);
  const { selectedDataset } = useTemplateFieldsStore();

  const [blankChip, setBlankChip] = React.useState<boolean>(true);
  const [blankValue, setBlankValue] = React.useState<string>('Blank');

  const [triggerValue, setTriggerValue] = React.useState<string[]>([]);

  const [isAnswerLogic, setIsAnswerLogic] = React.useState<string>('is');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElIsAnswerLogic, setAnchorElIsAnswerLogic] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElTrigger, setAnchorElTrigger] = React.useState<null | HTMLElement>(null);

  const openMenu = Boolean(anchorEl);
  const openMenuIsAnswerLogic = Boolean(anchorElIsAnswerLogic);
  const openMenuTrigger = Boolean(anchorElTrigger);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClickIsAnswerLogic = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElIsAnswerLogic(event.currentTarget);
  };

  const handleMenuClickTrigger = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTrigger(event.currentTarget);
  };

  const handleMenuCloseIsAnswerLogic = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLLIElement;
    setAnchorElIsAnswerLogic(null);
    setIsAnswerLogic(target.innerText);
  };

  const handleMenuCloseTrigger = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLLIElement;
    if (triggerValue.includes(target.innerText)) {
      setTriggerValue([...triggerValue]);
    } else {
      setTriggerValue([...triggerValue, target.innerText]);
    }
    setAnchorElTrigger(null);
  };

  const handleMenuCloseAction = () => {
    setAnchorEl(null);
  };

  const onClick = () => {
    setOpen(!open);
    return;
  };

  const triggerActions = ['Require Action', 'Require Evidence', 'Notify', 'Ask Question'];

  return {
    body: (
      <div>
        <Grid container spacing={2}>
          {/* <Grid item xs={12}>
            <div
              className={`fake_custom_select_field_wrapper ${
                selectedDataset?.id === dataItem?.id ? 'active' : ''
              }`}
              onClick={onClick}>
              <div className="fake_custom_select_field_input_type">
                <div className="select_icon_styling">
                  <img src={MediaIcon} alt="Text answer" />
                </div>
                <div className="inner_field_component_styling_in_template">Media</div>
              </div>
              <div className="fake_custom_select_field_input_type_icon">
                <KeyboardArrowUpIcon className="select_item_icon" />
              </div>
            </div>
          </Grid> */}

          {isAddLogicClicked && (
            <Grid
              item
              xs={12}
              sx={{
                backgroundColor: '#F4F6FA;',
                paddingBottom: '15px',
                marginLeft: '30px',
                marginTop: '10px',
              }}>
              <div className="text_answer_add_logic">
                <div className="text_answer_add_logic_inner">
                  If the answer
                  <Chip
                    label={isAnswerLogic}
                    onClick={handleMenuClickIsAnswerLogic}
                    size="small"
                    sx={{ marginRight: '6px', marginLeft: '8px', borderRadius: '5px' }}
                    deleteIcon={<DriveFileRenameOutlineIcon />}
                    variant="outlined"
                  />
                  {blankChip ? (
                    <Chip
                      label={blankValue}
                      size="small"
                      sx={{ marginRight: '10px', marginLeft: '5px', borderRadius: '5px' }}
                      onDelete={() => setBlankChip(false)}
                      deleteIcon={<DriveFileRenameOutlineIcon />}
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      variant="standard"
                      autoFocus
                      value={blankValue}
                      sx={{ backgroundColor: '#f9fafb', height: '25px', marginRight: '10px' }}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      onChange={(event) => setBlankValue(event.target.value)}
                      onBlur={(event) => setBlankChip(true)}
                    />
                  )}
                  then{' '}
                  <div className="trigger_value">
                    {triggerValue.length > 0
                      ? triggerValue.map((item, index) => {
                          return (
                            <Chip
                              label={item}
                              size="small"
                              sx={{
                                border: 'none',
                                marginLeft: '5px',
                                transform: 'scale(0.9)',
                                backgroundColor: '#FFFAEB',
                                color: '#B14608',
                              }}
                              variant="outlined"
                              onDelete={() => {
                                const newTriggerValue = triggerValue.filter(
                                  (item, i) => i !== index,
                                );
                                setTriggerValue(newTriggerValue);
                              }}
                            />
                          );
                        })
                      : ''}
                  </div>
                  <AddIcon
                    sx={{
                      fontSize: '17px',
                      marginLeft: '5px',
                    }}
                  />{' '}
                  <span onClick={handleMenuClickTrigger}>Trigger</span>
                </div>

                <Menu
                  id="format-positioned-menu"
                  aria-labelledby="format-positioned-button"
                  anchorEl={anchorElIsAnswerLogic}
                  open={openMenuIsAnswerLogic}
                  sx={{ marginTop: '23px' }}
                  onClose={handleMenuCloseAction}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}>
                  <MenuItem onClick={handleMenuCloseIsAnswerLogic}>is</MenuItem>
                  <MenuItem onClick={handleMenuCloseIsAnswerLogic}>is not</MenuItem>
                </Menu>

                <Menu
                  id="format-positioned-menu"
                  aria-labelledby="format-positioned-button"
                  anchorEl={anchorElTrigger}
                  open={openMenuTrigger}
                  sx={{ marginTop: '23px' }}
                  onClose={handleMenuCloseAction}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}>
                  {triggerActions.map((item, index) => {
                    return (
                      <MenuItem onClick={handleMenuCloseTrigger} key={index}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </Menu>
              </div>
            </Grid>
          )}
        </Grid>
      </div>
    ),
    label: (
      <div className="response__label-block" onClick={onClick}>
        <div>
          <div className="select_icon_styling">
            <img src={MediaIcon} alt="Media" />
          </div>
          <div className="inner_field_component_styling_in_template">Media</div>
        </div>
        <div className="fake_custom_select_field_input_type_icon">
          {/* <KeyboardArrowUpIcon className="select_item_icon" /> */}
        </div>
      </div>
    ),
  };
};

export default Media;
