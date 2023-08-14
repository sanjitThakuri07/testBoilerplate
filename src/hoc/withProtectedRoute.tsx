import { ComponentType } from "react";

import { connect, ConnectedProps } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { fetchMe } from "src/store/redux/app/actions";

import { AppState } from "src/store/redux/reducer";
import checkPermission from "src/utils/checkPermission";

type PropsForNewComponent = { allowAccessTo?: string[] };

function withProtectedRoute(WrappedComponent: ComponentType<any>) {
  function NewComponent({
    me,
    isLoading,
    allowAccessTo,
    ...rest
  }: PropsFromRedux & PropsForNewComponent) {
    const location = useLocation();

    if (me && me?.permissions) {
      // if allowAccessTo is empty array, it means no authorization check.
      const authorizationDisabled =
        !allowAccessTo || (Array.isArray(allowAccessTo) && allowAccessTo.length === 0);
      if (!authorizationDisabled && !checkPermission(allowAccessTo, me?.permissions))
        // save the user's previous location before redirecting to /unauthorized for future use
        return <Navigate to="/forbidden" state={{ from: location }} />;
    }

    // Initial loading and error
    return <WrappedComponent {...rest} />;
  }

  const mapStateToProps = ({ appState: { me, isLoading } }: AppState) => ({ me, isLoading });
  const mapDispatchToProps = { fetchMe };
  const connector = connect(mapStateToProps, mapDispatchToProps);
  type PropsFromRedux = ConnectedProps<typeof connector>;
  return connector(NewComponent);
}

export default withProtectedRoute;
