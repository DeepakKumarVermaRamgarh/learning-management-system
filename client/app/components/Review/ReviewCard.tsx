import React from "react";
import Image from "next/image";
import Ratings from "@/app/utils/Ratings";

type Props = {
  review: any;
};

const ReviewCard = ({ review }: Props) => {
  return (
    <div className="w-full h-max pb-4 dark:bg-slate-500 dark:bg-opacity-[0.20] border border-[#00000028] dark:border-[#ffffff1d] backdrop-blur shadow-[bg-slate-700] rounded-lg p-3 shadow-inner">
      <div className="flex w-full">
        <Image
          src={review.avatar}
          alt="avatar"
          width={50}
          height={50}
          className="rounded-full object-cover"
        />

        <div className="800px:flex justify-between w-full hidden">
          <div className="pl-4">
            <h5 className="text-[20px] font-bold text-gray-800 dark:text-white">
              {review.name}
            </h5>
            <h6 className="text-[16px] text-gray-600 dark:text-white">
              {review.profession}
            </h6>
          </div>
          <Ratings rating={review.ratings} />
        </div>

        {/* for mobile */}

        <div className="800px:hidden flex justify-between flex-col w-full">
          <div className="pl-4">
            <h5 className="text-[20px] font-bold text-gray-800 dark:text-white">
              {review.name}
            </h5>

            <h6 className="text-[16px] text-gray-600 dark:text-white">
              {review.profession}
            </h6>
          </div>
          <Ratings rating={review.ratings} />
        </div>
      </div>

      <p className="pt-2 px-2 font-Poppins text-black dark:text-white">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
