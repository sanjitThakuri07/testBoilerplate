import { Box } from "@mui/system";
import TenantUserCard from "components/TenantUserCard";
import { Grid } from "@mui/material";
import CardSkeletonLoader from "components/CardSkeletonLoader";
import { useDashboardFilter } from "globalStates/dashboardFilter";
import TenantUserTable from "components/TenantUserTable";
import { TenantUserProps } from "interfaces/tenantUserProps";
import NoDataFound from "components/NoDataFound";
import { userDataStore } from "globalStates/userData";

interface AllTenantProps {
  loader: boolean;
  getAllStatusUser: Function;
  setUserData?: Function;
}

interface UserDataProps {
  userData: {
    allUsers: TenantUserProps[];
  };
}

export function AllTenants(props: AllTenantProps & UserDataProps) {
  const { view } = useDashboardFilter();
  const { userData, loader, getAllStatusUser, setUserData } = props;

  const { userType } = userDataStore();

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      {view?.id === "card" ? (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, xl: 16 }}>
          {loader &&
            [...Array(8)].map((_, i) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={i}>
                  <CardSkeletonLoader />
                </Grid>
              );
            })}
          {!loader && userData?.allUsers?.length === 0 && (
            <NoDataFound
              link={userType === "Platform_owner" ? "/add-tenant" : "/add-organization"}
              title={userType === "Platform_owner" ? "Tenant" : "Organization"}
            />
          )}
          {/* loader */}
          {userData?.allUsers?.length > 0 &&
            !loader &&
            userData?.allUsers?.map((user) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={user.id}>
                  <TenantUserCard
                    {...user}
                    getAllStatusUser={getAllStatusUser}
                    setUserData={setUserData}
                    label={userType === "Platform_owner" ? "Tenant" : user?.location || ""}
                  />
                </Grid>
              );
            })}
        </Grid>
      ) : (
        <Box>
          <TenantUserTable userData={userData} getAllStatusUser={getAllStatusUser} />
        </Box>
      )}
    </Box>
  );
}

export function PendingSignUps(props: AllTenantProps & UserDataProps) {
  const { view } = useDashboardFilter();
  const { userData, loader, getAllStatusUser } = props;
  const { userType } = userDataStore();

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      {view?.id === "card" ? (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, xl: 16 }}>
          {loader &&
            [...Array(8)].map((_, i) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={i}>
                  <CardSkeletonLoader />
                </Grid>
              );
            })}
          {!loader && userData?.allUsers?.length === 0 && (
            <NoDataFound
              link={userType === "Platform_owner" ? "/add-tenant" : "/add-organization"}
              title={userType === "Platform_owner" ? "Tenant" : "Organization"}
            />
          )}
          {/* loader */}
          {userData?.allUsers?.length > 0 &&
            !loader &&
            userData?.allUsers?.map((user) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={user.id}>
                  <TenantUserCard {...user} getAllStatusUser={getAllStatusUser} />
                </Grid>
              );
            })}
        </Grid>
      ) : (
        <Box>
          <TenantUserTable userData={userData} getAllStatusUser={getAllStatusUser} />
        </Box>
      )}
    </Box>
  );
}

export function Deactivated(props: AllTenantProps & UserDataProps) {
  const { view } = useDashboardFilter();
  const { userData, loader, getAllStatusUser } = props;
  const { userType } = userDataStore();

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      {view?.id === "card" ? (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, xl: 16 }}>
          {loader &&
            [...Array(8)].map((_, i) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={i}>
                  <CardSkeletonLoader />
                </Grid>
              );
            })}
          {!loader && userData?.allUsers?.length === 0 && (
            <NoDataFound
              link={userType === "Platform_owner" ? "/add-tenant" : "/add-organization"}
              title={userType === "Platform_owner" ? "Tenant" : "Organization"}
            />
          )}
          {/* loader */}
          {userData?.allUsers?.length > 0 &&
            !loader &&
            userData?.allUsers?.map((user) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={user.id}>
                  <TenantUserCard
                    {...user}
                    getAllStatusUser={getAllStatusUser}
                    isActivated={true}
                    label={userType === "Platform_owner" ? "Tenant" : "industry"}
                  />
                </Grid>
              );
            })}
        </Grid>
      ) : (
        <Box>
          <TenantUserTable userData={userData} getAllStatusUser={getAllStatusUser} />
        </Box>
      )}
    </Box>
  );
}
