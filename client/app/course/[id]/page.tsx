"use client";

import CourseDetailsPage from "@/app/components/Course/CourseDetailsPage";
import {} from "react";

type Props = {
  params: any;
};

const Page = ({ params }: Props) => {
  return (
    <div>
      <CourseDetailsPage id={params.id} />
    </div>
  );
};

export default Page;
