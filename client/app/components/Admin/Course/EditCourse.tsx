"use client";

import React, { FC, useState, useEffect } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetCourseQuery,
} from "@/redux/features/courses/courseApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import Loader from "../../Loader/Loader";

type Props = {
  id: string;
};

const EditCourse: FC<Props> = ({ id }) => {
  const { isLoading, data, error, refetch } = useGetCourseQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [editCourse, { isSuccess, error: editError, isLoading: editLoading }] =
    useEditCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      const {
        name,
        description,
        price,
        estimatedPrice,
        tags,
        lavel,
        demoUrl,
        thumbnail,
      } = data;
      setCourseInfo({
        name,
        description,
        price,
        estimatedPrice,
        tags,
        lavel,
        demoUrl,
        thumbnail: thumbnail?.url,
      });
      setBenefits(data.benefits);
      setPrerequisites(data.prerequisites);
      setCourseContentData(data.courseData);
    }

    if (error) {
      if ("data" in error) {
        const errMsg = error as any;
        toast.error(errMsg.data.message);
      }
    }
  }, [data, error, isSuccess]);

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    lavel: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseData, setCourseData] = useState({});
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);

  const handleSubmit = async () => {
    // format benefits array
    const formattedBenefits = benefits.map((benefit: any) => ({
      title: benefit.title,
    }));
    // format prerequisites array
    const fromattedPrerequisites = prerequisites.map((prerequisite: any) => ({
      title: prerequisite.title,
    }));

    // format course content array
    const formattedCourseContentData = courseContentData.map(
      (courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link: any) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion,
      })
    );

    // prepare course data object
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      lavel: courseInfo.lavel,
      demoUrl: courseInfo.demoUrl,
      thumbnail: courseInfo.thumbnail,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: fromattedPrerequisites,
      courseContent: formattedCourseContentData,
    };
    setCourseData(data);
  };

  const handleCourseCreate = async (e: any) => {
    e.preventDefault();
    const data = courseData;
    await editCourse({ id, data });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Course updated successfully!");
      redirect("/admin/all-courses");
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      } 
    }

    if (editError) {
      if ("data" in editError) {
        const errorData = editError as any;
        toast.error(errorData.data.message);
      } 
    }
  }, [editError, error, isSuccess]);

  if (isLoading || editLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}

        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;
