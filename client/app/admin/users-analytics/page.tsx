"use client";

import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import UserAnalytics from "@/app/components/Admin/Analytics/UserAnalytics";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import React, { FC } from "react";

type Props = {};

const Page: FC<Props> = () => {
  return (
    <AdminProtected>
      <Heading
        title="Admin || E-Learning"
        description="Elearning is a platform for students to learn and get help from teachers."
        keywords="Programming, MERN, Redux, Machine Learning"
      />
      <div className="flex min-h-screen ">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
          <UserAnalytics />
        </div>
      </div>
    </AdminProtected>
  );
};

export default Page;
