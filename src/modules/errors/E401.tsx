import React from "react";
import Message from ".";
// for wrong or unauthenticated credentials
function E401() {
  return <Message mode="401" />;
}

export default E401;
