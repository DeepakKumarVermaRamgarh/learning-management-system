import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { format } from "timeago.js";
import Image from "next/image";
import DefaultImage from "../../../public/assets/avatar.png";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";

type Props = {
  item: any;
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
  handleAnswerSubmit: () => void;
  questionId: string;
  setQuestionId: Dispatch<SetStateAction<string>>;
  answerCreationLoading: boolean;
};

const CommentItem = ({
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: Props) => {
  const [replyActive, setReplyActive] = useState(false);

  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <div>
            <Image
              src={item?.user.avatar ? item?.user.avatar.url : DefaultImage}
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </div>

          <div className="pl-3">
            <h5 className="text-[20px]">{item?.user.name}</h5>
            <p>{item?.question}</p>
            <small className="dark:text-[#ffffff83] text-[#000000b8]">
              {format(item?.createdAt)} •
            </small>
          </div>
        </div>

        <div className="w-full flex">
          <span
            className="800px:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2"
            onClick={() => {
              setReplyActive(!replyActive);
              setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "All Replies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <BiMessage
            size={20}
            className="cursor-pointer dark:text-[#ffffff83] text-[#000000b8]"
          />
          <span className="pl-1 mt-[-4px] cursor-pointer dark:text-[#ffffff83] text-[#000000b8]">
            {item.questionReplies.length}
          </span>
        </div>
        {replyActive && questionId === item._id && (
          <>
            {item?.questionReplies.map((reply: any, index: number) => (
              <div
                className="w-full flex 800px:ml-16 text-black dark:text-white"
                key={index}
              >
                <div>
                  <Image
                    src={
                      reply?.user.avatar ? reply?.user.avatar.url : DefaultImage
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                </div>

                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{reply?.user.name}</h5>{" "}
                    {reply.user.role === "admin" && (
                      <VscVerifiedFilled className="text-[#23b0e7] ml-2 font-[20px]" />
                    )}
                  </div>
                  <p>{reply?.answer}</p>
                  <small className="dark:text-[#ffffff83] text-[#000000b8]">
                    {format(reply?.createdAt)} •
                  </small>
                </div>
              </div>
            ))}

            <>
              <div className="w-full flex relative dark:text-white text-black ">
                <input
                  type="text"
                  placeholder="Enter your answer..."
                  value={answer}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAnswer(e.target.value)
                  }
                  className={`block 800px:ml-12 mt-2 text-black dark:text-white outline-none dark:border-white bg-transparent border-b border-[#00000027] p-[5px] w-[95%] ${
                    (answerCreationLoading || answer.trim() === "") &&
                    "cursor-not-allowed"
                  } `}
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-0"
                  onClick={handleAnswerSubmit}
                  disabled={answer.trim() === "" || answerCreationLoading}
                >
                  Submit
                </button>
              </div>
            </>
          </>
        )}
      </div>
    </>
  );
};

export default CommentItem;
