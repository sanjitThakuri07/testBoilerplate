import UserProfileSettings from "src/modules/config/users/UserProfile/UserProfileSettings";
import React from "react";

const ViewUsers = () => {
  return (
    <div
      id="ViewUsers"
      style={{
        padding: "20px",
      }}
    >
      <UserProfileSettings isCustomersUser={true} />
    </div>
  );
};

export default ViewUsers;
