import { storiesOf } from "@storybook/react";
import { useState } from "react";
import ShowWithAnimation from ".";
storiesOf("Containers/ShowWithAnimation", module).add("Demo", () => {
  const [isMounted, setIsMounted] = useState(false);
  return (
    <>
      <button onClick={() => setIsMounted(!isMounted)}>Show/Hide With Animation</button>
      <ShowWithAnimation isMounted={isMounted}>
        <h1>Hello World</h1>
      </ShowWithAnimation>
    </>
  );
});
