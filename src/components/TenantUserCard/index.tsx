import React from "react";
import { useNavigate } from "react-router-dom";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Divider, Popover } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import { Box, Stack } from "@mui/system";
import ViewProfileIcon from "src/assets/icons/view_profile_icon.svg";
import TickIcon from "src/assets/icons/tick_icon.svg";
import DeactivateIcon from "src/assets/icons/deactivate_icon.svg";
import LogoutIcon from "src/assets/icons/modal_logout.svg";
import Fade from "@mui/material/Fade";
import { TenantUserProps } from "src/interfaces/tenantUserProps";
import { styled } from "@mui/material/styles";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { getAPI, postAPI } from "src/lib/axios";
import { AuthApis } from "src/modules/auth/constants";
import ActiveUsers from "src/assets/images/active_user_icon.svg";
import Deactivated from "src/assets/icons/deactivated.png";
import Pending from "src/assets/icons/pending.png";
import EditIcon from "src/assets/icons/editIcon.svg";
import ResendEmailIcon from "src/assets/icons/resendEmail.svg";
import { useSnackbar } from "notistack";
import { userDataStore } from "src/store/zustand/globalStates/userData";

type AttributeAccessor = {
  [key: string]: string;
};

export default function TenantUserCard({
  id,
  full_name,
  login_id,
  photo,
  country,
  organization,
  organization_count,
  getAllStatusUser,
  user_status,
  isActivated,
  isOrganizationCard,
  label,
  contact,
}: TenantUserProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [buttonLoader, setButtonLoader] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { userType } = userDataStore();

  const moreInfoHandler = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleResendEmail = () => {
    setButtonLoader(true);
    getAPI(
      `${
        userType === "Tenant" ? "organization" : userType === "Platform_owner" ? "tenant" : ""
      }/resend-signup-email/${id}`,
    ).then((res: { data: any; status: any }) => {
      try {
        if (res.status === 201) {
          enqueueSnackbar("Email sent successfully", { variant: "success" });
        } else {
          setButtonLoader(false);
          setAnchorEl(null);
          enqueueSnackbar("Unable to send email", { variant: "error" });
        }
      } catch (e) {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    });
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  // organizations tooltip
  const toolTipHandler = () => {
    return (
      <Box sx={{ p: 0.5 }}>
        <Stack direction="column">
          <Box sx={{ fontWeight: 500, fontSize: "13px", mb: 0.3 }}>Organizations</Box>
          {organization?.map((org, index) => {
            return (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={0.8}
                sx={{ fontWeight: 300, ml: 1, mt: 0.4 }}
              >
                <Box
                  sx={{
                    height: "4.5px",
                    width: "4.5px",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50px",
                  }}
                />
                <Box sx={{ fontSize: "12px" }}>{org}</Box>
              </Stack>
            );
          })}
        </Stack>
      </Box>
    );
  };

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: `#384874`,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: `#384874`,
      borderRadius: "8px",
    },
  }));

  const handleDeactivateTenant = () => {
    setButtonLoader(true);
    postAPI(
      `${
        userType !== "Tenant" ? AuthApis.DEACTIVATE_TENANT : AuthApis.DEACTIVATE_ORGANIZATION
      }/${id}/`,
      {},
    )
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setButtonLoader(false);
          setOpenModal(false);
          setAnchorEl(null);
          // api call
          getAllStatusUser();

          // instead of call just update the status
          // setUserData?.((prev: any) => {
          //   let allUsers = prev?.allUsers || [];
          //   let toUpdateUser = prev?.allUsers.map((user: any) => {
          //     if (Number(user?.id) === Number(id)) {
          //       return { ...user, user_status: Number(user_status) === 1 ? 3 : 1 };
          //     } else {
          //       return user;
          //     }
          //   });
          //   const deactivateCount =
          //     Number(prev?.allUsers.find((user: any) => user?.id === id)?.user_status) === 1
          //       ? prev?.deactivatedTenantCount + 1
          //       : prev?.deactivatedTenantCount - 1;
          //   return {
          //     ...prev,
          //     deactivatedTenantCount: deactivateCount,
          //     allUsers: toUpdateUser,
          //   };
          // });
        } else {
          setButtonLoader(false);
          setOpenModal(false);
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const handleViewCard = () => {
    if (userType === "Tenant") {
      navigate(`/organization/${id}`);
    } else {
      navigate(`/tenant/user/${id}`);
    }
  };

  console.log({ userType, user_status }, "userType");

  return (
    <>
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        confirmationIcon={LogoutIcon}
        handelConfirmation={handleDeactivateTenant}
        confirmationHeading={`Do you want to  ${
          isActivated ? "activate" : "deactivate"
        } this user?`}
        confirmationDesc={`This user will be moved to the ${
          isActivated ? "activated" : "deactivated"
        }  tab.`}
        status="warning"
        loader={buttonLoader}
      />

      <Card
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "12px",
          border: "1px solid #EAECF0",
        }}
      >
        <CardHeader
          avatar={
            <Box className="dashboard_user_avatar">
              <Avatar alt={full_name} src={`${process.env.VITE_HOST_URL}/${photo}`} />
              {/* user status */}
              <Box className="dashboard_user_avatar_status">
                <img
                  src={
                    Number(user_status) === 1
                      ? ActiveUsers
                      : Number(user_status) === 2
                      ? Pending
                      : Deactivated
                  }
                  alt="user_status"
                />
              </Box>
            </Box>
          }
          action={
            <IconButton aria-label="settings" onClick={moreInfoHandler}>
              <MoreVertIcon />
            </IconButton>
          }
          title={full_name?.length < 20 ? full_name : full_name?.slice(0, 10) + ".." ?? "N/A"}
          subheader={""}
        />
        {/* organization with tooltip content */}
        <CardContent className="middle-card-content" sx={{ cursor: "pointer" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <BootstrapTooltip
              placement="right"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              title={organization?.length > 0 && toolTipHandler()}
            >
              <Box
                color="#475467"
                sx={{
                  "&:hover": {
                    textDecoration: "underline #475467",
                  },
                }}
              >
                {label === "Tenant" ? (
                  <span>{organization_count ?? "0"}</span>
                ) : (
                  <Box color="#475467">{label}</Box>
                )}
                {label === "Tenant" ? (
                  <span>{` Organization${organization_count > "1" ? "s" : ""}`}</span>
                ) : (
                  <></>
                )}
              </Box>
            </BootstrapTooltip>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                backgroundColor: "#ebecfo",
                alignSelf: "center",
                borderWidth: "1px",
                height: "12px",
              }}
            />
            <Box color="#475467">{country ?? "N/A"}</Box>
          </Stack>
        </CardContent>
        <Divider />
        <CardContent className="card-bottom-content">
          <Typography
            variant="body2"
            color="#283352"
            textAlign="end"
            display={"flex"}
            justifyContent="flex-end"
          >
            <div className="login_email">
              <span>{login_id ?? "N/A"}</span>
            </div>

            {/* {userType === 'Platform_owner' && !!(Number(user_status) === 2) && <>heheheh</>} */}

            {(userType === "Tenant" || userType === "Platform_owner") && (
              <div
                className="organization_card_content"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: "8px",
                }}
              >
                {userType === "Tenant" && (
                  <div className="edit_card">
                    {" "}
                    <img
                      src={EditIcon}
                      alt=""
                      onClick={() => navigate(`/organization/${id}`)}
                      height={20}
                      width={15}
                      style={{ cursor: "pointer" }}
                    />{" "}
                  </div>
                )}

                {Number(user_status) === 2 && (
                  <div className="resend_confirmation_link" style={{ marginLeft: "8px" }}>
                    <img
                      src={ResendEmailIcon}
                      onClick={handleResendEmail}
                      alt=""
                      height={21}
                      width={21}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                )}
              </div>
            )}
          </Typography>
        </CardContent>
        {/* popover for view profile and deactivate tenant user */}
        <Popover
          id={popoverId}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Typography sx={{ padding: "10px 6px", width: "200px" }}>
            <Stack direction="column" justifyContent="center">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="card_popover_profile popover_button_profile"
              >
                <Stack direction="row" spacing={1} className="view_profile_container">
                  <Box>
                    <img src={ViewProfileIcon} alt="view_profile" />
                  </Box>
                  <Box
                    sx={{ fontWeight: "500", color: "#1F2840" }}
                    onClick={() => {
                      handleViewCard();
                    }}
                  >
                    View Profile
                  </Box>
                </Stack>
                <div className="checkmark_popover_profile">
                  <img src={TickIcon} alt="check" />
                </div>
              </Stack>

              {/* {Number(user_status) === 2 && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  className="card_popover_profile popover_button_profile">
                  <Stack direction="row" spacing={1} className="view_profile_container">
                    <Box>
                      <img src={ViewProfileIcon} alt="view_profile" />
                    </Box>
                    <Box
                      sx={{ fontWeight: '500', color: '#1F2840' }}
                      onClick={() => {
                        handleViewCard();
                      }}>
                      View Profile
                    </Box>
                  </Stack>
                  <div className="checkmark_popover_profile">
                    <img src={TickIcon} alt="check" />
                  </div>
                </Stack>
              )} */}
              {Number(user_status) !== 2 && (
                <Stack
                  onClick={() => setOpenModal(true)}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  className="card_popover_deactivate popover_button_deactivate"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        transform: Number(user_status) === 3 ? "rotate(180deg)" : "auto",
                      }}
                    >
                      <img src={DeactivateIcon} alt="view_profile" />
                    </Box>
                    <Box sx={{ fontWeight: "500", color: "#1F2840" }}>
                      {/* {isActivated ? "Activate" : "Deactivate"} */}
                      {Number(user_status) === 1
                        ? "Deactivate"
                        : Number(user_status) === 2
                        ? ""
                        : "Activate"}
                    </Box>
                  </Stack>
                  <div className="popover_button checkmark_popover_deactivate">
                    <img src={TickIcon} alt="check" />
                  </div>
                </Stack>
              )}
            </Stack>
          </Typography>
        </Popover>
      </Card>
    </>
  );
}
