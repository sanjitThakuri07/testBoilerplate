import { Typography } from '@mui/material';
import React from 'react';
import './Calendar.scss';
import CoreCalendar from './CoreCalendar';

const Calendar = () => {
  return (
    <div id="Calendar">
      <div className="calendar__container">
        <div className="calendar__heading">
          <div className="calendar__title">
            <Typography variant="h3" gutterBottom>
              Calendar
            </Typography>
          </div>
          <div className="calendar__text">
            <div>View all the inspection and other calender overview here.</div>
            <div>
              <CoreCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
