"use client";

import { useState, useEffect } from "react";
import { useGetCoursesQuery } from "@/redux/features/courses/courseApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState<string>("Login");
  const [open, setOpen] = useState<boolean>(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("All");
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.courses);
    } else {
      setCourses(
        data?.courses.filter((course: any) => course.categories === category)
      );
    }
    if (search) {
      setCourses(
        data?.courses.filter((course: any) =>
          course.name.toLowerCase().includes(search?.toLowerCase())
        )
      );
    }
    if (categoriesData) setCategories(categoriesData.layout.categories);
  }, [category, data, search, categoriesData]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title="All Courses || E-Learning"
              description="E-Learning is a programming community."
              keywords="programming community, coding skills, expert insights, collaboration, growth"
            />

            <div className="w-full flex items-center flex-wrap">
              <div
                className={`h-[35px] ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer text-white`}
                onClick={() => setCategory("All")}
              >
                All
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`h-[35px] ${
                      category === item.title ? "bg-[crimson]" : "bg-[#5050cb]"
                    } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer text-white`}
                    onClick={() => setCategory(item.title)}
                  >
                    {item.title}
                  </div>
                ))}
            </div>
            {courses && courses.length === 0 && (
              <p
                className={`${styles.label} justify-center minh-[50vh] flex items-center`}
              >
                {search
                  ? "No courses found"
                  : "No coures found in this category. Please try another one!"}
              </p>
            )}

            <br />
            <br />

            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0 ">
              {courses &&
                courses.map((course: any, index: number) => (
                  <CourseCard key={index} course={course} />
                ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
