"use client";

import CreateCourse from "@/app/components/Admin/Course/CreateCourse";
import DashboardHeader from "@/app/components/Admin/DashboardHeader";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import React, { FC, useState } from "react";

type Props = {};

const Page: FC<Props> = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <Heading
        title="Admin || E-Learning"
        description="E-Learning is a platform for student to learn and get help from the teachers."
        keywords="Programming, MERN, Redux, Data Science, Machine Learning, Development"
      />

      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader open={open} setOpen={setOpen} />
          <CreateCourse />
        </div>
      </div>
    </div>
  );
};

export default Page;
