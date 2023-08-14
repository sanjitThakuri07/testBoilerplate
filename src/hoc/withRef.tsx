import { ComponentType, forwardRef } from "react";

// passes ref to the WrappedComponent
function withRef(WrappedComponent: ComponentType<any>) {
  return forwardRef(function NewComponent(props, ref) {
    return <WrappedComponent {...props} containerRef={ref} />;
  });
}

export default withRef;

// usage
// function WrappedComponent({ containerRef }) {
//   return <div ref={containerRef}></div>;
// }
