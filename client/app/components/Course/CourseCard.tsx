import Link from "next/link";
import Image from "next/image";
import Ratings from "@/app/utils/Ratings";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
  course: any;
  isProfile?: boolean;
};

const CourseCard = ({ course, isProfile }: Props) => {
  return (
    <Link
      href={
        !isProfile ? `/course/${course._id}` : `course-access/${course._id}`
      }
    >
      <div className="w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm dark:shadow-inner ">
        <Image
          src={course.thumbnail.url}
          alt={`Thumbnail of ${course.name}`}
          width={500}
          height={300}
          objectFit="contain"
          className="rounded w-full"
        />
        <br />
        <h1 className="text-[16px] font-semibold dark:text-white font-Poppins ">
          {course.name}
        </h1>
        <div className="w-full flex items-center justify-between pt-2">
          <Ratings rating={course.ratings} />
          <h5
            className={`text-black dark:text-white ${
              isProfile && "hidden 800px:inline"
            } `}
          >
            &nbsp; {course.purchased} Students
          </h5>
        </div>

        <div className="w-full flex items-center justify-between pt-3 dark:text-white text-black">
          <div className="flex">
            <h3>{course.price === 0 ? "Free" : "Rs." + course.price}</h3>
            <h5 className="pl-3 text-[14px] mt-[-5px] line-through opacity-80 text-black dark:text-white ">
              Rs. {course.estimatedPrice}
            </h5>
          </div>
          <div className="flex items-center pb-3">
            <AiOutlineUnorderedList
              size={20}
              className="fill-black dark:fill-white"
            />
            <h5 className="pl-2 text-black dark:text-white ">
              {course.courseData?.length} Lessons
            </h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
