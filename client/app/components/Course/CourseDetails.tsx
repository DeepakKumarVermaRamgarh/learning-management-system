import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import {} from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import CourseContentList from "./CourseContentList";

type Props = {
  courseData: any;
};

const CourseDetails = ({ courseData }: Props) => {
  const { user } = useSelector((state: any) => state.auth);

  const discountPercentage = (
    ((courseData.estimatedPrice - courseData.price) * 100) /
    courseData.estimatedPrice
  ).toFixed(0);

  const isPurchased =
    user && user.courses?.find((course: any) => course._id === courseData._id);

  const handleOrder = (e: any) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5 ">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {courseData.name}
            </h1>
            <div className="flex items-center justify-between pt-3 mb-1">
              <div className="flex items-center">
                <Ratings rating={courseData.ratings} />
                <h5 className=" text-black dark:text-white">
                  {courseData.reviews?.length}
                </h5>
              </div>
              <h5 className=" text-black dark:text-white">
                {courseData.purchased} Students
              </h5>
            </div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What you will learn from this course ?
            </h1>
            <div>
              {courseData.benefits?.map((benefit: any, index: number) => (
                <div
                  key={index}
                  className="w-full flex 800px:items-center py-2"
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {" "}
                    {benefit.title}{" "}
                  </p>
                </div>
              ))}

              <br />
              <br />
            </div>

            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What are the prerequisites for starting this course ?
            </h1>
            <div>
              {courseData.prerequisites?.map(
                (prerequisite: any, index: number) => (
                  <div
                    key={index}
                    className="w-full flex 800px:items-center py-2"
                  >
                    <div className="w-[15px] mr-1">
                      <IoCheckmarkDoneOutline
                        size={20}
                        className="text-black dark:text-white"
                      />
                    </div>
                    <p className="pl-2 text-black dark:text-white">
                      {" "}
                      {prerequisite.title}{" "}
                    </p>
                  </div>
                )
              )}
              <br />
              <br />

              <div>
                <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                  Course Overview
                </h1>
                {/* course content list */}
                <CourseContentList data={courseData.courseData} isDemo={true} />
              </div>

              <br />
              <br />

              {/* course description */}
              <div className="w-full">
                <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                  Course Details
                </h1>
                <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                  {" "}
                  {courseData.description}{" "}
                </p>
              </div>
              <br />
              <br />

              <div className="w-ful">
                <div className="800px:flex items-center">
                  <Ratings rating={courseData?.ratings} />
                  <div className="mb-2 800px:mb-[unset]">
                    <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                      {Number.isInteger(courseData?.ratings)
                        ? courseData?.ratings.toFixed(1)
                        : courseData?.ratings.toFixed(2)}
                      Course Rating • {courseData?.reviews?.length} Reviews
                    </h5>
                  </div>
                  <br />
                  {courseData?.reviews &&
                    courseData.reviews
                      .toReversed()
                      .map((review: any, index: number) => (
                        <div key={index} className="w-full pb-4">
                          <div className="flex">
                            <div className="w-[50px] h-[50px]">
                              <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
                                <h1 className="uppercase text-[18px] text-black dark:text-white">
                                  {review.user.name.slice(0, 2)}
                                </h1>
                              </div>
                            </div>
                            <div className="hidden 800px:block pl-2">
                              <div className="flex items-center">
                                <h5 className="text-[18px] pr-2 text-black dark:text-white">
                                  {review.user.name}
                                </h5>
                                <Ratings rating={review?.rating} />
                              </div>
                              <p className="text-black dark:text-white">
                                {review?.comment}
                              </p>
                              <small className="text-[#000000d1] dark:text-[#ffffff83]">
                                {format(review?.createdAt)}
                              </small>
                            </div>
                            <div className="pl-2 flex 800px:hidden items-center">
                              <h5 className="text-[18px] pr-2 text-black dark:text-white">
                                {review.user.name}
                              </h5>
                              <Ratings rating={review?.rating} />
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer
                videoUrl={courseData?.demoUrl}
                title={courseData?.title}
              />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px]text-black dark:text-white">
                  {courseData?.price === 0 ? "Free" : `Rs. ${courseData.price}`}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white ">
                  {courseData?.estimatedPrice}
                </h5>
                <h4 className="pl-5 pt-4 text-[22px] text-green-500">
                  {discountPercentage}% Off
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    href={`/course-access/${courseData._id}`}
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-green-800`}
                  >
                    Enter to course
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    onClick={handleOrder}
                  >
                    Buy Now Rs. {courseData.price}
                  </div>
                )}
              </div>
              <br />
              <p className="pb-1 text-black dark:text-white">
                • Source code included
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Full lifetime access
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Certificate of completion
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Premium Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
