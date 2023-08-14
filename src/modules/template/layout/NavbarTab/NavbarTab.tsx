import { Button, Grid, Stack } from '@mui/material';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TemplateTopbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };
  return (
    <div>
      <div id="TemplateTopbar">
        <Grid container spacing={2}>
          <Grid item xs={3}>
            Last published on 29th August, 2022.
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" className="config-filter-buttons">
              <Button
                className={isActive('/template/create')}
                onClick={() => navigate('/template/create')}>
                Create
              </Button>
              <Button
                className={isActive('/template/report')}
                onClick={() => navigate('/template/report')}>
                Report
              </Button>
              <Button
                className={isActive('/template/access')}
                onClick={() => navigate('/template/access')}>
                Access
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="primary">
              Undo
            </Button>
            <Button variant="outlined" color="primary" sx={{ marginLeft: '10px' }}>
              Redo
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TemplateTopbar;
