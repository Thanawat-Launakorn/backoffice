"use client";

import tableComponent from "../components/table";
import dashboardLayout from "../dashboard/component";

export default function Product() {
  const { LayoutApp } = dashboardLayout;
  const { TableApp } = tableComponent;
  return (
    <LayoutApp>
        <TableApp />
    </LayoutApp>
  );
}
