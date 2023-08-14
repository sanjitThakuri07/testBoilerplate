import React from "react";
import Message from ".";
// Forbidden for unauthorized route or not having enough previledges
function E403() {
  return <Message mode="403" />;
}

export default E403;
