import React from 'react';
import './revenue_card.scss';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

const RevCard = ({
  title = '',
  content = '',
  icon = undefined,
  pill = '',
  numerator = '',
  denominator = '',
  sidepill = '',
  progressvalue = 0,
  progressbar = false,
  subpill = '',
  children = <></>,
}) => {
  return (
    <div className="org-holder">
      <div className="top">
        <Grid container>
          <Grid item xs={7}>
            <Typography variant="body1" className="title">
              {title}
            </Typography>
          </Grid>

          <Grid item xs={5}>
            {sidepill && (
              <div className="org-sidepill-holder">
                <span className="sidepill">{sidepill} </span>
              </div>
            )}
          </Grid>
        </Grid>
        <Typography variant="h2" className="content">
          {numerator}
          {denominator && (
            <>
              <span> / </span>
              <span className="denominator">{denominator}</span>
            </>
          )}
        </Typography>

        {progressbar && (
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <LinearProgress
                  value={progressvalue}
                  variant="determinate"
                  style={{
                    height: '8px',
                    borderRadius: '20px',
                    marginTop: '9px',
                  }}></LinearProgress>
              </Grid>
              <Grid item xs={4}>
                <Typography>{subpill}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        {/* {pill && (
          <div className="org-pill-holder">
            <span className="pill">{pill}</span>
          </div>
        )} */}
      </div>
      {icon && <div className="ico-holder">{icon}</div>}
      {children}
    </div>
  );
};

export default RevCard;
