import { ComponentType, useEffect } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchMe } from "src/store/redux/app/actions";

type PropsForNewComponent = { redirectTo?: string };

function withAuth(WrappedComponent: ComponentType<any>) {
  function NewComponent({
    fetchMe,
    redirectTo = "/login",
    ...rest
  }: PropsFromRedux & PropsForNewComponent) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    // const isLoginPage = useMatch("/login");

    useEffect(() => {
      // const loggedIn = sessionStorage.getItem("accessToken");
      // if (loggedIn) {
      //   fetchMe();
      // } else {
      //   navigate(redirectTo, { replace: false, state: { from: pathname } });
      // }
    }, []);

    return <WrappedComponent {...rest} />;
  }
  const mapStateToProps = ({ appState: { me } }) => ({ me });

  const mapDispatchToProps = { fetchMe };
  const connector = connect(mapStateToProps, mapDispatchToProps);
  type PropsFromRedux = ConnectedProps<typeof connector>;

  return connector(NewComponent);
}

export default withAuth;
