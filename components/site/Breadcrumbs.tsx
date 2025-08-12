"use client";

import { Breadcrumbs as BreadcrumbsSub } from "../sub/breadcrumbs";

function Breadcrumbs() {
  return (
    <BreadcrumbsSub>
      <BreadcrumbsSub.Item>Hunt</BreadcrumbsSub.Item>
      <BreadcrumbsSub.Divider />
      <BreadcrumbsSub.Item active={true}>Productores</BreadcrumbsSub.Item>
    </BreadcrumbsSub>
  );
}

export default Breadcrumbs;
