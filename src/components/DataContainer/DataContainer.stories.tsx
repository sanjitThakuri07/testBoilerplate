import { Meta } from "@storybook/react";
import DataContainer, { DataContainerType } from "./DataContainer";
import { mockDataContainerProps } from "./DataContainer.mocks";

const meta: Meta<typeof DataContainer> = {
  title: "Components/Data Container",
  component: DataContainer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: any) => <DataContainer {...args} />;

// writing story, use PascalCase
export const Base = Template.bind({});

// passing args to the Demo story
Base.args = {
  ...mockDataContainerProps.base,
} as DataContainerType;
