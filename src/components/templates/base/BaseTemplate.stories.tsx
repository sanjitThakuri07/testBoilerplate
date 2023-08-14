import { Meta } from "@storybook/react";
import BaseTemplate, { BaseTemplateType } from "./BaseTemplate";
import { mockBaseTemplateProps } from "./BaseTemplate.mocks";

const meta: Meta<typeof BaseTemplate> = {
  title: "Templates",
  component: BaseTemplate,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: any) => <BaseTemplate {...args} />;

// writing story
export const Base = Template.bind({});

// passing args to the Base story
Base.args = {
  ...mockBaseTemplateProps.base,
} as BaseTemplateType;
