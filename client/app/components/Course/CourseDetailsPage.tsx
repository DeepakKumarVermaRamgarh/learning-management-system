import { useGetCourseDetailsQuery } from "@/redux/features/courses/courseApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      <Heading
        title={`${data.course.name} | E-Learning`}
        description="ELearning is a programming community provides courses on various techstacks to improve and be a better version of yourself. Developed by Deepak Kumar Verma."
        keywords={data.course?.tags}
      />
      <Header
        route={route}
        setRoute={setRoute}
        open={open}
        setOpen={setOpen}
        activeItem={1}
      />
      <CourseDetails courseData={data.course} />
      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
