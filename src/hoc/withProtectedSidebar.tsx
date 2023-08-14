import { ComponentType, useEffect } from "react";
import { ConnectedProps, connect } from "react-redux";
import { IndexSidebar } from "src/constants/sidebar";
import { setSidebar } from "src/store/redux/app/actions";
import { checkPermission } from "src/utils";

type PropsForNewComponent = {
  allowAccessTo?: "everyone" | string | string[];
  sidebarType?: "index" | "admin";
};

function withProtectedSidebar(WrappedComponent: ComponentType<any>) {
  function NewComponent({
    sidebarType = "index",
    setSidebar,
    sidebar,
    me,
    ...rest
  }: PropsFromRedux & PropsForNewComponent) {
    useEffect(() => {
      // if (!me || !me?.permissions || !sidebarType) return;
      if (!sidebarType) return;
      const previousSidebarType = String(window.sessionStorage.getItem("sidebarType"));
      const currentSidebarType = sidebarType;
      if (previousSidebarType === currentSidebarType && sidebar?.length) return;

      switch (sidebarType) {
        case "index": {
          const sidebars = IndexSidebar();
          const permittedSidebars = sidebars.filter((item) =>
            item?.permission ? checkPermission(item.permission, me.permissions) : item,
          );
          setSidebar(permittedSidebars);
          window.sessionStorage.setItem("sidebarType", "index");
          break;
        }
        case "admin":
          window.sessionStorage.setItem("sidebarType", "admin");
          console.log("setting admin sidebar");
          break;

        default:
          window.sessionStorage.setItem("sidebarType", "default empty");
          setSidebar([]);
      }
    }, [sidebarType, me]);

    return <WrappedComponent {...rest} />;
  }

  const mapStateToProps = ({ appState: { me, sidebar } }) => ({ me, sidebar });

  const mapDispatchToProps = {
    setSidebar,
  };
  const connector = connect(mapStateToProps, mapDispatchToProps);
  type PropsFromRedux = ConnectedProps<typeof connector>;

  return connector(NewComponent);
}

export default withProtectedSidebar;
