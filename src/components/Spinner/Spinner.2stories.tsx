import { storiesOf } from "@storybook/react";
import React from "react";
import {
  BouncingLoader,
  Buffering,
  Gears,
  LazySpinner,
  Loader,
  ProgressLoader,
  Spinner,
} from "./Spinner";

storiesOf("Animations/CSS/Spinner", module)
  .add("Loader", () => (
    <div style={{ padding: 10, backgroundColor: "black", width: "fit-content" }}>
      {" "}
      <Loader color="red" size="2rem" />{" "}
    </div>
  ))
  .add("Bouncing Loader", () => (
    <BouncingLoader color="gray" size="1em">
      <div />
      <div />
      <div />
    </BouncingLoader>
  ))
  .add("Spinner", () => <Spinner />)
  .add("Lazy-Spinner", () => <LazySpinner />)
  .add("Buffering", () => (
    <Buffering color="red">
      {new Array(12).fill(0).map((item) => (
        <div />
      ))}
    </Buffering>
  ))
  .add("Gears", () => (
    <div style={{ padding: 10, backgroundColor: "black", width: "fit-content" }}>
      <Gears />
    </div>
  ))
  .add("ProgressLoader", () => <ProgressLoader progress={50} />);
