import { PrivateRoute } from "src/constants/variables";
import { Box, Button, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { permissionList } from "src/constants/permission";
import EditView from "src/components/ViewEdit";
import { id } from "date-fns/locale";

interface LinkTabProps {
  label?: string;
  href?: string;
  tab?: any;
}

export default function UserProfileLayout({ children }: any) {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { profileId, customerUserId } = useParams();

  // tab container
  const tabContainer = [
    {
      label: "User Profile Settings",
      link: `/config/users/user/profile/${profileId}/settings`,
    },
    {
      label: "Notifications",
      link: `/config/users/user/profile/${profileId}/notifications`,
    },
    {
      label: "Permissions",
      link: `/config/users/user/profile/${profileId}/permissions`,
    },
    // {
    //   label: 'Performance',
    //   link:PrivateRoute.userProfile.USER_PROFILE_PERFORMANCE ,
    // },
    {
      label: "Template Accessed",
      link: `/config/users/user/profile/${profileId}/template-accessed`,
    },
  ];

  function LinkTab(props: LinkTabProps) {
    // const navigate = useNavigate();

    return (
      <Tab
        className="tenants_tabs"
        component="a"
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          navigate(props.tab.link);
          event.preventDefault();
        }}
        {...props}
      />
    );
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    for (let i = 0; i < tabContainer.length; i++) {
      if (newValue === i) {
        navigate(tabContainer[i].link);
        return;
      }
    }
  };

  useEffect(() => {
    // matching the route index for tab page
    let matchedIndex = tabContainer.findIndex((tab) =>
      tab.link.includes(location.pathname.split("/").slice(-1).join("")),
    );
    setValue(matchedIndex);
  }, [location.pathname]);

  const readOnly = location.pathname.includes("view");

  return (
    <Box sx={{ padding: "10px 24px" }}>
      <Button
        onClick={() => navigate(-1)}
        startIcon={<img src="src/assets/icons/back.svg" alt="back button" />}
        sx={{
          textTransform: "capitalize",
        }}
      >
        Back
      </Button>
      <div className={`config-holder position-relative`}>
        {(location.pathname.includes("view") || location.pathname.includes("edit")) && (
          <EditView permission={permissionList?.OrganizationUser.edit} />
        )}
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="column">
              <Typography variant="h1" sx={{ color: "#384874" }}>
                User Profile
              </Typography>
            </Stack>

            <Box sx={{ zIndex: 1, cursor: "pointer" }}></Box>
          </Stack>
          <Box sx={{ mt: 3 }}>
            <Divider />
          </Box>

          {!readOnly && !!!customerUserId && (
            <Box sx={{ width: "100%", mt: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  //   variant="scrollable"
                  //   scrollButtons
                  allowScrollButtonsMobile
                  sx={{ borderBottom: "2px solid #EAECF0" }}
                >
                  {tabContainer.map((tab, index) => {
                    return <LinkTab label={tab?.label} tab={tab} key={index} />;
                  })}
                </Tabs>
              </Box>
            </Box>
          )}
        </Box>
        <Outlet />
      </div>
      {children}
    </Box>
  );
}
