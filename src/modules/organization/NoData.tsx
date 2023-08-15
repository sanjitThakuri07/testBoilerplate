import { Box, Stack } from "@mui/material";

const NoDataOrganizations = () => {
  // const [isLoading, setIsLoading] = useState(false);
  // const fetchOrgDetails = async () => {
  //   setIsLoading(true);
  //   const { status, data } = await getAPI('organization-global-settings/details');
  //   if (status === 200) {
  //     setIsLoading(false);
  //     localStorage.setItem('sidebarImage', data?.profilePicture);
  //     localStorage.setItem('org_country', data?.country);
  //   }
  // };
  // useEffect(() => {
  //   fetchOrgDetails();
  // }, []);

  return (
    <Box>
      {/* <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Stack direction="column">
            <Typography variant="h1" sx={{ marginBottom: '8px' }}>
              Overview
            </Typography>
            <Box>View all the detailed overview here.</Box>
          </Stack>
        </Box>
        <Box sx={{ zIndex: 1, cursor: 'pointer' }}>
          <Button
            variant="outlined"
            sx={{ padding: '10px 20px' }}
            fullWidth
            startIcon={<img src="src/assets/icons/filter-lines.svg" alt="filter" />}>
            Jan. 1st - Jan. 31st 2023
          </Button>
        </Box>
      </Stack> */}
      <Stack>{/* <SupersetDashboard /> */}</Stack>
      {/* <Box sx={{ width: '100%', marginTop: '40px' }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <OrgCard content="0" title="Total Customers" pill="0% per month" />
              </Grid>
              <Grid item xs={4}>
                <OrgCard content="0" title="New Customers" pill="0% per month" />
              </Grid>
              <Grid item xs={4}>
                <OrgCard content="0" title="Total Bookings" pill="0% per month" />
              </Grid>
              <Grid item xs={4}>
                <OrgCard content="0" title="Total Inspections" />
              </Grid>
              <Grid item xs={4}>
                <OrgCard content="0" title="Upcoming" />
              </Grid>
              <Grid item xs={4}>
                <OrgCard content="0" title="In Progress" />
              </Grid>
              <Grid item xs={8}>
                <OrgCard content="0" title="Inspection Completed" />
              </Grid>
              <Grid item xs={4}>
                <OrgCard content="0" title="Flagged Items" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className="org-card-col">
            <OrgCard
              content="$0.00"
              title="Total Revenue"
              icon={
                (
                  <img src="/assets/img/revenue.svg" alt="revenue" width={200} height={180} />
                ) as any
              }
            />
          </Grid>
          <Grid item xs={4} className="org-card-col">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <OrgCard content="$0.00" title="Total Invoices" />
              </Grid>
              <Grid item xs={12}>
                <OrgCard content="$0.00" title="Paid Invoices" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8} className="org-card-col">
            <OrgCard content="" title="Sales Mapping by Country">
              <div style={{ width: '100%' }}>
                <iframe
                  width="100%"
                  height="250"
                  // frameborder={"0"}
                  // scrolling="no"
                  // marginheight="0"
                  // marginwidth="0"
                  src="https://maps.google.com/maps?width=100%25&amp;height=250&amp;hl=en&amp;q=propel%20marine+(Propel%20Marine)&amp;t=k&amp;z=4&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                  <a href="https://www.maps.ie/distance-area-calculator.html">area maps</a>
                </iframe>
              </div>
            </OrgCard>
          </Grid>
        </Grid>
      </Box> */}
    </Box>
  );
};

export default NoDataOrganizations;
