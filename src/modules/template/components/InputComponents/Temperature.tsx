import React from 'react';

import TemperatureIcon from 'assets/template/icons/temperature.svg';

import { Menu, MenuItem } from '@mui/material';
import { useTemplateFieldsStore } from 'containers/template/store/templateFieldsStore';
import { LabelWrapper, BodyWrapper } from 'containers/template/components/Wrapper';

export default function Temperature({ questionLogicShow, dataItem }: any) {
  const { updateTemplateDatasets } = useTemplateFieldsStore();

  const [anchorElTrigger, setAnchorElTrigger] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuTrigger = Boolean(anchorElTrigger);

  const handleMenuCloseTrigger = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLLIElement;
    updateTemplateDatasets(dataItem, 'variables', {
      ...dataItem.variables,
      temperatureFormat: target.innerText,
    });

    setAnchorElTrigger(null);
  };

  const handleMenuCloseAction = () => {
    setAnchorEl(null);
  };

  const handleMenuClickTrigger = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTrigger(event.currentTarget);
  };
  return {
    body: (
      <>
        {questionLogicShow?.getActiveLogicQuestion()?.includes(dataItem.id) && (
          <BodyWrapper>
            <div className="question__answer-type">
              Format -{' '}
              <span
                onClick={handleMenuClickTrigger}
                id="document-number-positioned-button"
                style={{
                  textDecoration: 'underline',
                  fontWeight: 500,
                }}>
                {dataItem?.variables?.temperatureFormat}
              </span>
            </div>
          </BodyWrapper>
        )}
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
          <MenuItem onClick={handleMenuCloseTrigger}>Celcius</MenuItem>
          <MenuItem onClick={handleMenuCloseTrigger}>Kelvin</MenuItem>
        </Menu>
      </>
    ),
    label: <LabelWrapper img={TemperatureIcon} title="Temperature" />,
  };
}
