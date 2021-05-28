import React from "react";
import clsx from "clsx";

import "./authen-layout.scss";

type AuthenLayoutProps = {
  component: React.ReactElement | React.ReactElement[];
  title?: string;
  subTitle?: string;
  tags?: React.ReactElement | React.ReactElement[];
  extra?: React.ReactNode;
  headerClassName?: string;
};

export function AuthenLayout({ component, headerClassName }: AuthenLayoutProps) {
  return <div className={clsx("authen-layout", headerClassName)}>{component}</div>;
}
