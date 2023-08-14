import React from 'react';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';

export default function PdfAssignedActivity({ has_action_summary, has_action }: any) {
  return (
    <>
      <Box mt={2}>
        {has_action_summary && (
          <Box className="box-container-pdf">
            <Box sx={{ fontWeight: 500 }} className="pdf_label">
              <Stack direction="row" justifyContent="space-between">
                <Box>Assigned Activity Summary</Box>
                {has_action && <Box>1</Box>}
              </Stack>
            </Box>
            <Box className="individual_box_container">
              <Box>Work Areas / Personal Protective Equipment (PPE)</Box>
              <Stack direction="row" spacing={2} mt={3}>
                {/* Priority Status Due Date Assignee Title Created By */}
                <Grid
                  container
                  //   spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}>
                  <Grid item xs={2} sm={4} md={4}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Priority:</Box>
                      <Box sx={{ opacity: '0.8' }}>High</Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Status:</Box>
                      <Box sx={{ opacity: '0.8' }}>In Progress</Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Assignee:</Box>
                      <Box sx={{ opacity: '0.8' }}>John Doe</Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4} mt={0.5}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Created By:</Box>
                      <Box sx={{ opacity: '0.8' }}>Mark Jones</Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
