import OrganizationConfiguration from "src/modules/config/generalSettings/OrganizationConfiguration";
import { Box } from "@mui/system";
import UsersSettingLayout from "../UserSettingLayout";
import UserSecurityy from "src/modules/setting/security/UserSecurity";

export default function UserSecurity() {
  return (
    <OrganizationConfiguration>
      <UsersSettingLayout>
        <Box sx={{ padding: "20px" }}>
          <UserSecurityy />
        </Box>
      </UsersSettingLayout>
    </OrganizationConfiguration>
  );
}
