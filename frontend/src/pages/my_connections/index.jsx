import React from "react";
import UserLayout from "@/layout/userlauout/MainUserLayout";
import DashboardLayout from '../../layout/dashboardlayout/index'
export default function My_connections() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>my connection</div>
      </DashboardLayout>
    </UserLayout>
  );
}
