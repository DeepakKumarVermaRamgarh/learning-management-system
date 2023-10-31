import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "./CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import DefaultImage from "../../../public/assets/avatar.png";
import { VscVerifiedFilled } from "react-icons/vsc";

type Props = {
  courseData: any;
  stripePromise: any;
  clientSecret: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRoute: Dispatch<SetStateAction<string>>;
};

const CourseDetails = ({
  courseData,
  stripePromise,
  clientSecret,
  setOpen: openAuthModel,
  setRoute,
}: Props) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [isPurchased, setIsPurchased] = useState<boolean>(false);

  useEffect(() => {
    if (userData) setUser(userData.user);
    if (user) {
      setIsPurchased(
        user.courses.find((course: any) => course._id === courseData._id)
      );
    }
  }, [courseData._id, user, userData]);

  const discountPercentage = (
    ((courseData.estimatedPrice - courseData.price) * 100) /
    courseData.estimatedPrice
  ).toFixed(0);

  const handleOrder = (e: any) => {
    if (user) setOpen(true);
    else {
      setRoute("Login");
      openAuthModel(true);
    }
  };

  return (
    <>
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
                      &nbsp;Course Rating • {courseData?.reviews?.length}{" "}
                      Reviews
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
                              <Image
                                src={
                                  review.user.avatar
                                    ? review.user.avatar.url
                                    : DefaultImage
                                }
                                width={50}
                                height={50}
                                alt=""
                                className="w-[50px] h-[50px] rounded-full object-cover"
                              />
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
                          {review?.commentReplies.map(
                            (reply: any, index: number) => (
                              <div
                                className="w-full flex 800px:ml-[16px] my-5 "
                                key={index}
                              >
                                <div className="w-[50px] h-[50px]">
                                  <Image
                                    src={
                                      reply.user.avatar
                                        ? reply.user.avatar.url
                                        : DefaultImage
                                    }
                                    width={50}
                                    height={50}
                                    alt=""
                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                  />
                                </div>
                                <div className="pl-2 text-black dark:text-white ">
                                  <div className="flex items-center">
                                    <h5 className="text-[20px]">
                                      {reply?.user.name}
                                    </h5>{" "}
                                    {reply.user.role === "admin" && (
                                      <VscVerifiedFilled className="text-[#23b0e7] ml-2 font-[20px]" />
                                    )}
                                  </div>
                                  <p>{reply.comment}</p>
                                  <small className="text-[#000000b8] dark:text-[#ffffff83]">
                                    {format(reply.createdAt)} •
                                  </small>
                                </div>
                              </div>
                            )
                          )}
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

      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="w-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckOutForm
                      setOpen={setOpen}
                      courseData={courseData}
                      user={user}
                    />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default CourseDetails;
