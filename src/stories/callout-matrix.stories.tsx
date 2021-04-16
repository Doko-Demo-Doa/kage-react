import { Story, Meta } from "@storybook/react";

import { CalloutMatrix } from "../components/callout-matrix/callout-matrix";

export default {
  title: "Example/CalloutMatrix",
  component: CalloutMatrix,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta;

const Template: Story = () => <CalloutMatrix />;

export const Active = Template.bind({});
Active.args = {
  primary: true,
  label: "Active",
};

export const Inactive = Template.bind({});
Inactive.args = {
  label: "Inactive",
};
