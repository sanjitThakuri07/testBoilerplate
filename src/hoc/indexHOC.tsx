import { userDataStore } from "src/store/zustand/globalStates/userData";
import { MessageRoute } from "src/constants/variables";
import { usePermissionStore } from "src/store/zustand/permission";
import { checkPermission } from "src/utils/permission";

const UnauthorizedRedirect = () => {
  window.location.href = MessageRoute._401;
  return null;
};

export const IndexHOC = ({ component: WrappedComponent, permission = [], role = "" }: any) => {
  const HOC = () => {
    var { userType } = userDataStore();
    var { permissions } = usePermissionStore();
    const checkRole = role.length ? role?.includes(userType) : false;

    if (permissions.length && !checkPermission({ permission, permissions }) && !checkRole) {
      return <UnauthorizedRedirect />;
    }
    return <WrappedComponent />;
  };

  return <HOC />;
};

export default IndexHOC;
