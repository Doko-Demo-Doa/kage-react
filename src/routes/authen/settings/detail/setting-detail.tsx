import React from "react";
import { LoginFormLite } from "~/components/login-form-lite/login-form-lite";
import { SettingKey } from "~/typings/types";

interface Props {
  type: SettingKey;
}

export const SettingDetail: React.FC<Props> = ({ type }) => {
  if (type === "auth") {
    return <LoginFormLite />;
  }
  return <div>Test</div>;
};
