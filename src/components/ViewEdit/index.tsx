import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePermissionStore } from "store/permission";
import { checkPermission } from "src/utils/permission";

const EditView = ({ permission, link, name, className }: any) => {
  const { permissions } = usePermissionStore();

  const location = useLocation();
  const navigate = useNavigate();

  let mode = location?.pathname?.includes("view")
    ? "view"
    : location?.pathname?.includes("edit")
    ? "edit"
    : "";
  let generateLink = location?.pathname?.replace(`${mode}`, `${mode === "view" ? "edit" : "view"}`);

  const modes = mode === "view" && checkPermission({ permission, permissions });

  return (
    <>
      {!!mode?.length && (
        <div className={`edit__view-container ${className ? className : ""}`}>
          {modes ? (
            <Link to={generateLink} className="common__button-comp">
              Go To Edit Page
            </Link>
          ) : (
            <Link to={generateLink} className="common__button-comp">
              Go To View Page
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default EditView;
