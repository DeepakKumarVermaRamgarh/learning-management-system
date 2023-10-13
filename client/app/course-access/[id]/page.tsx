"use client";

import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";
import CourseContent from "@/app/components/Course/CourseContent";

type Props = {
  params: any;
};

const Page = ({ params }: Props) => {
  const { id } = params;
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (data) {
      const isPurchased = data.user.courses.find(
        (course: any) => course._id === id
      );

      if (!isPurchased || isPurchased === -1) {
        redirect("/");
      }
    }

    if (error) {
      redirect("/");
    }
  }, [data, error, id]);

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      <CourseContent courseId={id} user={data.user} />
    </div>
  );
};

export default Page;
