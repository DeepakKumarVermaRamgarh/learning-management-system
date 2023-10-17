import React from "react";
import CourseCard from "../Course/CourseCard";

type Props = {
  courses: any[];
};

const EnrolledCourses = ({ courses }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0 ">
      {courses.length > 0 ? (
        courses.map((course: any, index: number) => (
          <CourseCard key={index} course={course} isProfile={true} />
        ))
      ) : (
        <h1 className="text-center text-[18px] font-Poppins">
          You don&apos;t have any purchased course...!
        </h1>
      )}
    </div>
  );
};

export default EnrolledCourses;
