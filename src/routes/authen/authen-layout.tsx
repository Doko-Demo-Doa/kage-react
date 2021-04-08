import React from "react";
import clsx from "clsx";
import { PageHeader } from "antd";

import "./authen-layout.scss";

type AuthenLayoutProps = {
  component: React.ReactElement | React.ReactElement[];
  title: string;
  subTitle: string;
  tags: React.ReactElement | React.ReactElement[];
  extra: React.ReactNode;
  headerClassName?: string;
};

export function AuthenLayout({
  component,
  title,
  subTitle,
  extra,
  tags,
  headerClassName,
}: AuthenLayoutProps) {
  return (
    <div className={clsx("authen-layout", headerClassName)}>
      <PageHeader
        title={title}
        subTitle={subTitle}
        className={clsx("page-header", headerClassName)}
        tags={tags}
        extra={extra}
      />
      {component}
    </div>
  );
}
