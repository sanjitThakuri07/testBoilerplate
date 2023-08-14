import * as React from "react";
import Stack from "@mui/material/Stack";
import { Box, Popover } from "@mui/material";
import { TenantUserProps } from "src/interfaces/tenantUserProps";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import NoDataFound from "src/components/NoDataFound";
import MoreIcon from "src/assets/icons/more_icon.svg";
import { useNavigate } from "react-router-dom";
import ViewProfileIcon from "src/assets/icons/view_profile_icon.svg";
import TickIcon from "src/assets/icons/tick_icon.svg";
import Deactivated from "src/assets/icons/deactivated.png";
import Pending from "src/assets/icons/pending.png";
import DeactivateIcon from "src/assets/icons/deactivate_icon.svg";
import Typography from "@mui/material/Typography";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import LogoutIcon from "src/assets/icons/modal_logout.svg";
import { postAPI } from "src/lib/axios";
import { AuthApis } from "src/modules/auth/constants";
import ActiveUsers from "src/assets/images/active_user_icon.svg";
import { userDataStore } from "src/store/zustand/globalStates/userData";

interface UserDataProps {
  getAllStatusUser: Function;
  userData: {
    allUsers: TenantUserProps[];
  };
}

const TableRowComponent = ({
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
}: TenantUserProps) => {
  // getting the user type
  const { userType } = userDataStore();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [buttonLoader, setButtonLoader] = React.useState(false);
  const [tenantId, setTenantId] = React.useState<number | string>();
  const [openModal, setOpenModal] = React.useState(false);

  const moreInfoHandler = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  const handleDeactivateTenant = () => {
    setButtonLoader(true);
    postAPI(`${AuthApis.DEACTIVATE_TENANT}/${id}/`, {}).then((res: { data: any; status: any }) => {
      if (res.status === 200) {
        setButtonLoader(false);
        setOpenModal(false);
        setAnchorEl(null);
        getAllStatusUser();
      } else {
        setButtonLoader(false);
        setOpenModal(false);
      }
    });
  };

  const handleNavigate = () => {
    if (userType === "Tenant") {
      navigate(`/organization/${id}`);
    } else {
      navigate(`/tenant/user/${id}`);
    }
  };

  return (
    <>
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        confirmationIcon={LogoutIcon}
        handelConfirmation={handleDeactivateTenant}
        confirmationHeading={"Do you want to deactivate this user?"}
        confirmationDesc={"This user will be moved to the deactivated tab."}
        status="warning"
        loader={buttonLoader}
      />
      <TableRow
        key={id}
        className="table_container"
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <TableCell component="th" scope="row" sx={{ color: "#475467" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box>
              <Avatar alt={full_name} src={`${process.env.VITE_HOST_URL}/${photo}`} />
            </Box>
            <Box
              className="dashboard_user_avatar_statusss"
              style={{
                position: "sticky",
                marginTop: "25px",
                marginLeft: "-12px",
              }}
            >
              <img
                src={
                  Number(user_status) === 1
                    ? ActiveUsers
                    : Number(user_status) === 2
                    ? Pending
                    : Deactivated
                }
                alt="active"
              />
            </Box>
            <Box sx={{ fontWeight: 500 }}>{full_name}</Box>
          </Stack>
        </TableCell>
        {!(userType === "Tenant") && (
          <TableCell align="left" sx={{ color: "#475467" }}>
            {contact && contact[0]?.code} {contact && contact[0]?.phone_number}
          </TableCell>
        )}
        <TableCell align="left" sx={{ color: "#475467" }}>
          {login_id ?? "N/A"}
        </TableCell>
        <TableCell align="left" sx={{ color: "#475467" }}>
          {country ?? "N/A"}
        </TableCell>
        {!(userType === "Tenant") && (
          <TableCell align="left" sx={{ color: "#475467" }}>
            {organization_count ?? "0"}
          </TableCell>
        )}
        <TableCell align="left" sx={{ color: "#475467" }}>
          <Box
            onClick={(event) => {
              moreInfoHandler(event);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "35px",
              width: "35px",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.5s ease",
              "&:hover": {
                background: "#EBEDF1",
                transition: "all 0.5s ease",
              },
            }}
          >
            <img src={MoreIcon} alt="more" />
          </Box>
          {/* popover for view profile and deactivate tenant user */}
          <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            className={`table_popover `}
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
                      onClick={() => handleNavigate()}
                    >
                      View Profile
                    </Box>
                  </Stack>
                  <div className="checkmark_popover_profile">
                    <img src={TickIcon} alt="check" />
                  </div>
                </Stack>
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
        </TableCell>
      </TableRow>
    </>
  );
};

export default function TenantUserTable({ userData, getAllStatusUser }: UserDataProps) {
  // getting the user type
  const { userType } = userDataStore();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [buttonLoader, setButtonLoader] = React.useState(false);
  const [tenantId, setTenantId] = React.useState<number | string>();
  const [openModal, setOpenModal] = React.useState(false);

  const moreInfoHandler = (event: any, id: string | number) => {
    userData?.allUsers?.findIndex((user) => {
      if (Number(user?.id) === Number(id)) {
        setAnchorEl(event.currentTarget);
        setTenantId(id);
      }
    });
  };

  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  const handleDeactivateTenant = () => {
    setButtonLoader(true);
    postAPI(`${AuthApis.DEACTIVATE_TENANT}/${tenantId}/`, {}).then(
      (res: { data: any; status: any }) => {
        if (res.status === 200) {
          setButtonLoader(false);
          setOpenModal(false);
          setAnchorEl(null);
          getAllStatusUser();
        } else {
          setButtonLoader(false);
          setOpenModal(false);
        }
      },
    );
  };

  const handleNavigate = () => {
    if (userType === "Tenant") {
      navigate(`/organization/${tenantId}`);
    } else {
      navigate(`/tenant/user/${tenantId}`);
    }
  };

  return (
    <React.Fragment>
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        confirmationIcon={LogoutIcon}
        handelConfirmation={handleDeactivateTenant}
        confirmationHeading={"Do you want to deactivate this user?"}
        confirmationDesc={"This user will be moved to the deactivated tab."}
        status="warning"
        loader={buttonLoader}
      />

      <TableContainer className="table_container" component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ background: " #F9FAFB" }}>
            <TableRow>
              <TableCell sx={{ color: "#475467" }}>Company Details</TableCell>
              {!(userType === "Tenant") && (
                <TableCell sx={{ color: "#475467" }} align="left">
                  Contact Number
                </TableCell>
              )}
              <TableCell sx={{ color: "#475467" }} align="left">
                Email Id
              </TableCell>
              <TableCell sx={{ color: "#475467" }} align="left">
                Country
              </TableCell>
              {!(userType === "Tenant") && (
                <TableCell sx={{ color: "#475467" }} align="left">
                  Number of Organisations
                </TableCell>
              )}
              <TableCell sx={{ color: "#475467" }} align="left">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData?.allUsers.map((user: any, index) => {
              return <TableRowComponent {...user} getAllStatusUser={getAllStatusUser} />;
            })}
          </TableBody>
        </Table>
        {userData?.allUsers.length === 0 && (
          <Box sx={{ pb: 4, width: "100%" }}>
            <NoDataFound link="/add-tenant" title="Tenant" />
          </Box>
        )}
      </TableContainer>
    </React.Fragment>
  );
}
