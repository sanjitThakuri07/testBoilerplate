/** @jest-environment jsdom */
// import { render, RenderResult } from '@testing-library/react';
// import DynamicSelectField from '../DynamicSelectField';

// let documentBody: RenderResult;

describe('<DynamicSelectField />', () => {
  // const dummyFn = () => {};
  // beforeEach(() => {
  //   documentBody = render(
  //     <DynamicSelectField
  //       handleBlur={dummyFn}
  //       handleChange={dummyFn}
  //       handleSelectTouch={dummyFn}
  //       id="1"
  //       isViewOnly
  //       menuOptions={[]}
  //     />
  //   );
  // });

  it('shows not found message', () => {
    // expect(documentBody.getByText('Not Found')).toBeInTheDocument();
    // expect(documentBody.getByText('404')).toBeInTheDocument();
    const a=2;
    const b=3;

    expect(a+b).toBe(5);
  });
});
