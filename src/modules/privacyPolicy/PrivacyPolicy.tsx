import React from "react";
import { Box, Stack, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export default function PrivacyPolicy() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{ height: "100%", width: "100%", maxWidth: "60%", margin: "auto" }}
    >
      <Stack direction="column">
        <Stack direction="column">
          <Stack direction="column" alignItems="center" justifyContent="center">
            <Box
              sx={{
                fontWeight: 600,
                marginTop: "8px",
                fontSize: "16px",
                color: "#33426A",
              }}
            >
              Privacy Policy
            </Box>
            <Box
              sx={{
                fontWeight: 600,
                marginTop: "4px",
                fontSize: "32px",
                color: "#101828",
              }}
            >
              We care about your privacy
            </Box>
            <Box sx={{ textAlign: "center", marginTop: "12px" }}>
              Your privacy is important to us at Untitled. We respect your
              privacy regarding any information we may collect from you across
              our website.
            </Box>
            <Box sx={{ marginTop: "27px" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    centered
                    sx={{ width: "320px", background: "red", margin: "auto" }}
                    className="privacy_policy_tab_container"
                    onChange={handleChange}
                  >
                    <Tab label="Legal Version" value="1" />
                    <Tab label="Important Notes" value="2" />
                  </TabList>
                </Box>
                <Box sx={{ width: "100%", mt: 2 }}>
                  <TabPanel value="1">
                    <Box>
                      <Box sx={{ mt: 3 }}>
                        <div>
                          Dolor enim eu tortor urna sed duis nulla. Aliquam
                          vestibulum, nulla odio nisl vitae. In aliquet
                          pellentesque aenean hac vestibulum turpis mi bibendum
                          diam. Tempor integer aliquam in vitae malesuada
                          fringilla. Elit nisi in eleifend sed nisi. Pulvinar at
                          orci, proin imperdiet commodo consectetur convallis
                          risus. Sed condimentum enim dignissim adipiscing
                          faucibus consequat, urna. Viverra purus et erat auctor
                          aliquam. Risus, volutpat
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          vulputate posuere purus sit congue convallis aliquet.
                          Arcu id augue ut feugiat donec porttitor neque.
                          Mauris, neque ultricies eu vestibulum, bibendum quam
                          lorem id. Dolor lacus, eget nunc lectus in tellus,
                          pharetra, porttitor. Ipsum sit mattis nulla quam
                          nulla. Gravida id gravida ac enim mauris id. Non
                          pellentesque congue eget consectetur turpis. Sapien,
                          dictum molestie sem tempor. Diam elit, orci, tincidunt
                          aenean tempus. Quis velit eget ut tortor tellus. Sed
                          vel, congue felis elit erat nam nibh orci.
                        </div>
                      </Box>
                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                          fontWeight: "600",
                          color: "#101828",
                          mt: 3,
                        }}
                      >
                        How do we use your information?
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <div>
                          Dolor enim eu tortor urna sed duis nulla. Aliquam
                          vestibulum, nulla odio nisl vitae. In aliquet
                          pellentesque aenean hac vestibulum turpis mi bibendum
                          diam. Tempor integer aliquam in vitae malesuada
                          fringilla. Elit nisi in eleifend sed nisi. Pulvinar at
                          orci, proin imperdiet commodo consectetur convallis
                          risus. Sed condimentum enim dignissim adipiscing
                          faucibus consequat, urna. Viverra purus et erat auctor
                          aliquam. Risus, volutpat
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          vulputate posuere purus sit congue convallis aliquet.
                          Arcu id augue ut feugiat donec porttitor neque.
                          Mauris, neque ultricies eu vestibulum, bibendum quam
                          lorem id. Dolor lacus, eget nunc lectus in tellus,
                          pharetra, porttitor. Ipsum sit mattis nulla quam
                          nulla. Gravida id gravida ac enim mauris id. Non
                          pellentesque congue eget consectetur turpis. Sapien,
                          dictum molestie sem tempor. Diam elit, orci, tincidunt
                          aenean tempus. Quis velit eget ut tortor tellus. Sed
                          vel, congue felis elit erat nam nibh orci.
                        </div>
                      </Box>
                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                          fontWeight: "600",
                          color: "#101828",
                          mt: 3,
                        }}
                      >
                        Do we use cookies and other tracking technologies?
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        Pharetra morbi libero id aliquam elit massa integer
                        tellus. Quis felis aliquam ullamcorper porttitor.
                        Pulvinar ullamcorper sit dictumst ut eget a, elementum
                        eu. Maecenas est morbi mattis id in ac pellentesque ac.
                      </Box>
                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                          fontWeight: "600",
                          color: "#101828",
                          mt: 3,
                        }}
                      >
                        What are your privacy rights?
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        Pharetra morbi libero id aliquam elit massa integer
                        tellus. Quis felis aliquam ullamcorper porttitor.
                        Pulvinar ullamcorper sit dictumst ut eget a, elementum
                        eu. Maecenas est morbi mattis id in ac pellentesque ac.
                      </Box>
                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                          fontWeight: "600",
                          color: "#101828",
                          mt: 3,
                        }}
                      >
                        How can you contact us about this policy?
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        Sagittis et eu at elementum, quis in. Proin praesent
                        volutpat egestas sociis sit lorem nunc nunc sit. Eget
                        diam curabitur mi ac. Auctor rutrum lacus malesuada
                        massa ornare et. Vulputate consectetur ac ultrices at
                        diam dui eget fringilla tincidunt. Arcu sit dignissim
                        massa erat cursus vulputate gravida id. Sed quis auctor
                        vulputate hac elementum gravida cursus dis. Lectus id
                        duis vitae porttitor enim gravida morbi. Eu turpis
                        posuere semper feugiat volutpat elit, ultrices
                        suspendisse. Auctor vel in vitae placerat. Suspendisse
                        maecenas ac donec scelerisque diam sed est duis purus.
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel value="2">
                    <Box>
                      <Box sx={{ mt: 3 }}>
                        <div>
                          Dolor enim eu tortor urna sed duis nulla. Aliquam
                          vestibulum, nulla odio nisl vitae. In aliquet
                          pellentesque aenean hac vestibulum turpis mi bibendum
                          diam. Tempor integer aliquam in vitae malesuada
                          fringilla. Elit nisi in eleifend sed nisi. Pulvinar at
                          orci, proin imperdiet commodo consectetur convallis
                          risus. Sed condimentum enim dignissim adipiscing
                          faucibus consequat, urna. Viverra purus et erat auctor
                          aliquam. Risus, volutpat
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          vulputate posuere purus sit congue convallis aliquet.
                          Arcu id augue ut feugiat donec porttitor neque.
                          Mauris, neque ultricies eu vestibulum, bibendum quam
                          lorem id. Dolor lacus, eget nunc lectus in tellus,
                          pharetra, porttitor. Ipsum sit mattis nulla quam
                          nulla. Gravida id gravida ac enim mauris id. Non
                          pellentesque congue eget consectetur turpis. Sapien,
                          dictum molestie sem tempor. Diam elit, orci, tincidunt
                          aenean tempus. Quis velit eget ut tortor tellus. Sed
                          vel, congue felis elit erat nam nibh orci.
                        </div>
                      </Box>
                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                          fontWeight: "600",
                          color: "#101828",
                          mt: 3,
                        }}
                      >
                        How do we use your information?
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <div>
                          Dolor enim eu tortor urna sed duis nulla. Aliquam
                          vestibulum, nulla odio nisl vitae. In aliquet
                          pellentesque aenean hac vestibulum turpis mi bibendum
                          diam. Tempor integer aliquam in vitae malesuada
                          fringilla. Elit nisi in eleifend sed nisi. Pulvinar at
                          orci, proin imperdiet commodo consectetur convallis
                          risus. Sed condimentum enim dignissim adipiscing
                          faucibus consequat, urna. Viverra purus et erat auctor
                          aliquam. Risus, volutpat
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          vulputate posuere purus sit congue convallis aliquet.
                          Arcu id augue ut feugiat donec porttitor neque.
                          Mauris, neque ultricies eu vestibulum, bibendum quam
                          lorem id. Dolor lacus, eget nunc lectus in tellus,
                          pharetra, porttitor. Ipsum sit mattis nulla quam
                          nulla. Gravida id gravida ac enim mauris id. Non
                          pellentesque congue eget consectetur turpis. Sapien,
                          dictum molestie sem tempor. Diam elit, orci, tincidunt
                          aenean tempus. Quis velit eget ut tortor tellus. Sed
                          vel, congue felis elit erat nam nibh orci.
                        </div>
                      </Box>
                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                          fontWeight: "600",
                          color: "#101828",
                          mt: 3,
                        }}
                      >
                        Do we use cookies and other tracking technologies?
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        Pharetra morbi libero id aliquam elit massa integer
                        tellus. Quis felis aliquam ullamcorper porttitor.
                        Pulvinar ullamcorper sit dictumst ut eget a, elementum
                        eu. Maecenas est morbi mattis id in ac pellentesque ac.
                      </Box>
                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                          fontWeight: "600",
                          color: "#101828",
                          mt: 3,
                        }}
                      >
                        What are your privacy rights?
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        Pharetra morbi libero id aliquam elit massa integer
                        tellus. Quis felis aliquam ullamcorper porttitor.
                        Pulvinar ullamcorper sit dictumst ut eget a, elementum
                        eu. Maecenas est morbi mattis id in ac pellentesque ac.
                      </Box>
                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                          fontWeight: "600",
                          color: "#101828",
                          mt: 3,
                        }}
                      >
                        How can you contact us about this policy?
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        Sagittis et eu at elementum, quis in. Proin praesent
                        volutpat egestas sociis sit lorem nunc nunc sit. Eget
                        diam curabitur mi ac. Auctor rutrum lacus malesuada
                        massa ornare et. Vulputate consectetur ac ultrices at
                        diam dui eget fringilla tincidunt. Arcu sit dignissim
                        massa erat cursus vulputate gravida id. Sed quis auctor
                        vulputate hac elementum gravida cursus dis. Lectus id
                        duis vitae porttitor enim gravida morbi. Eu turpis
                        posuere semper feugiat volutpat elit, ultrices
                        suspendisse. Auctor vel in vitae placerat. Suspendisse
                        maecenas ac donec scelerisque diam sed est duis purus.
                      </Box>
                    </Box>
                  </TabPanel>
                </Box>
              </TabContext>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
