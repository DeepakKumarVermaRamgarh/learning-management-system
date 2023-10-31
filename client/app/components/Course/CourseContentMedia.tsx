import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useState,
} from "react";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import Image from "next/image";
import DefaultImage from "../../../public/assets/avatar.png";
import toast from "react-hot-toast";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
} from "@/redux/features/courses/courseApi";
import CommentReply from "./CommentReply";
import Ratings from "@/app/utils/Ratings";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import socketIO from "socket.io-client";
const socketId = socketIO(process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "", {
  transports: ["websocket"],
});

type Props = {
  data: Array<any>;
  id: string;
  activeVideo: number;
  setActiveVideo: Dispatch<SetStateAction<number>>;
  user: any;
  refetch: any;
  content: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
  content,
}: Props) => {
  const [activeBar, setActiveBar] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [reviewMessage, setReviewMessage] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [questionId, setQuestionId] = useState<string>("");
  const [isReviewReply, setIsReviewReply] = useState<boolean>(false);
  const [reply, setReply] = useState<string>("");
  const [reviewId, setReviewId] = useState<string>("");

  const [
    addNewQuestion,
    { isLoading: questionCreationLoading, isSuccess, error },
  ] = useAddNewQuestionMutation();

  const [
    addAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerInQuestionMutation();

  const [
    addReviewInCourse,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInCourseMutation();

  const [
    addReplyInReview,
    {
      isSuccess: replySuccess,
      isLoading: replyCreationLoading,
      error: replyError,
    },
  ] = useAddReplyInReviewMutation();

  const isReviewed = content.course.reviews?.find(
    (review: any) => review.user._id === user._id
  );

  const handleQuestionSubmit = async () => {
    if (question.trim().length === 0) {
      toast.error("Question can't be empty!");
    } else {
      await addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]?._id,
      });
    }
  };

  const handleReviewSubmit = async () => {
    if (reviewMessage.trim().length === 0) {
      toast.error("Review can't be empty!");
    } else {
      await addReviewInCourse({ courseId: id, review: reviewMessage, rating });
    }
  };

  const handleReviewReplySubmit = async () => {
    if (reply.trim().length === 0) {
      toast.error("Review can't be empty!");
    } else {
      await addReplyInReview({ comment: reply, courseId: id, reviewId });
    }
  };

  const handleAnswerSubmit = async () => {
    if (answer.trim().length === 0) {
      toast.error("Answer can't be empty!");
    } else {
      await addAnswerInQuestion({
        answer,
        courseId: id,
        contentId: data[activeVideo]?._id,
        questionId,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
      socketId.emit("notification", {
        title: "New Question Received",
        message: `New question received in ${data[activeVideo].title} by ${user.name}`,
        userId: user._id,
      });
      toast.success("Question raised successfully!");
    }

    if (answerSuccess) {
      setAnswer("");
      refetch();
      toast.success("Answer added successfully!");
      if (user.role !== "admin") {
        socketId.emit("notification", {
          title: "New Reply Received",
          message: `You have a new question reply in ${data[activeVideo].title}`,
          userId: user._id,
        });
      }
    }

    if (reviewSuccess) {
      setReviewMessage("");
      refetch();
      socketId.emit("notification", {
        title: "New Review Received",
        message: `${user.name} has given a review in ${data[activeVideo].title}`,
        userId: user._id,
      });
      toast.success("Review added successfully!");
    }

    if (replySuccess) {
      setReply("");
      refetch();
      toast.success("Reply added successfully!");
    }

    if (error) {
      if ("data" in error) {
        const errMsg = error as any;
        toast.error(errMsg.data.message);
      }
    }
    if (answerError) {
      if ("data" in answerError) {
        const errMsg = answerError as any;
        toast.error(errMsg.data.message);
      }
    }
    if (reviewError) {
      if ("data" in reviewError) {
        const errMsg = reviewError as any;
        toast.error(errMsg.data.message);
      }
    }
    if (replyError) {
      if ("data" in replyError) {
        const errMsg = replyError as any;
        toast.error(errMsg.data.message);
      }
    }
  }, [
    activeVideo,
    answerError,
    answerSuccess,
    content.name,
    data,
    error,
    isSuccess,

    replyError,
    replySuccess,
    reviewError,
    reviewSuccess,
    user._id,
    user.name,
    user.role,
  ]);

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto text-black dark:text-white">
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />

      <div className="w-full flex items-center justify-center my-3 text-black dark:text-white">
        <div
          className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[0.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" /> Prev Lesson
        </div>
        <div
          className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === data.length - 1 && "!cursor-no-drop opacity-[0.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && activeVideo === data.length - 1
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          {" "}
          Next Lesson
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>

      <h1 className="pt-2 text-[25px] font-[600] my-1 text-black dark:text-white ">
        {data[activeVideo].title}
      </h1>
      <div className="w-full p-4 flex items-center justify-between text-black dark:text-white bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner mb-1">
        {["Overview", "Resources", "Q&A", "Reviews"].map(
          (text: string, index: number) => (
            <h5
              key={index}
              className={`800px:text-[20px] cursor-pointer ${
                activeBar === index
                  ? "text-red-500"
                  : " text-black dark:text-white"
              }`}
              onClick={() => setActiveBar(index)}
            >
              {" "}
              {text}{" "}
            </h5>
          )
        )}
      </div>

      {activeBar === 0 && (
        <p className="text-[18px] text-black dark:text-white whitespace-pre-line mb-3">
          {data[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((link: any, index: number) => (
            <div className="mb-5" key={index}>
              <h2 className="800px:text-[20px] 800px:inline-block text-black dark:text-white ">
                {link.title && link.title + " : "}
              </h2>
              <a
                href={link.url}
                className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
              >
                {link.url}
              </a>
            </div>
          ))}
        </div>
      )}

      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={user.avatar ? user.avatar.url : DefaultImage}
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <textarea
              cols={40}
              rows={5}
              value={question}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setQuestion(e.target.value)
              }
              placeholder="Write your question here..."
              className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins dark:text-white text-black"
            ></textarea>
          </div>

          <div className="w-full flex justify-end mb-3">
            <div
              className={`${
                styles.button
              } !w-[120px] !h-[40px] text-[18px] mt-5 ${
                questionCreationLoading && "cursor-no-drop"
              }`}
              onClick={() =>
                questionCreationLoading ? null : handleQuestionSubmit
              }
            >
              Submit
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div>
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              questionId={questionId}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        </>
      )}

      {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewed && (
              <>
                <div className="flex w-full">
                  <Image
                    src={user.avatar ? user.avatar.url : DefaultImage}
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                      Rate this lecture <span className="text-red-500">*</span>
                    </h5>

                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      cols={40}
                      rows={5}
                      value={reviewMessage}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setReviewMessage(e.target.value)
                      }
                      placeholder="Write your feedback here..."
                      className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins dark:text-white text-black"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className={`${
                      styles.button
                    } !w-[120px] !h-[40px] text-[18px] mt-5 mr-2 800px:mr-0 ${
                      (reviewMessage.trim() === "" || reviewCreationLoading) &&
                      "cursor-no-drop"
                    }`}
                    onClick={() =>
                      reviewCreationLoading ? null : handleReviewSubmit
                    }
                  >
                    Submit
                  </div>
                </div>
              </>
            )}

            <br />

            <hr className="w-full h-[1px] bg-[#ffffff3b]"></hr>
            <div className="w-full">
              {(
                content?.course.reviews && [...content.course.reviews].reverse()
              ).map((review: any, index: number) => (
                <div
                  className="w-full my-5 text-black dark:text-white"
                  key={index}
                >
                  <div className="w-full flex">
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
                    <div className="ml-2 text-black dark:text-white ">
                      <h1 className="text-[18px]">{review?.user.name}</h1>
                      <Ratings rating={review.rating} />
                      <p>{review.comment}</p>
                      <small className="text-[#000000b8] dark:text-[#ffffff83]">
                        {format(review.createdAt)} •
                      </small>
                    </div>
                  </div>
                  {user.role === "admin" && (
                    <span
                      className="text-[#000000b8] dark:text-[#ffffff83] cursor-pointer"
                      onClick={() => {
                        setIsReviewReply(true);
                        setReviewId(review._id);
                      }}
                    >
                      {!isReviewReply ? "Add Reply" : "Hide Reply"}
                      <BiMessage
                        size={20}
                        className="cursor-pointer dark:text-[#ffffff83] text-[#000000b8]"
                      />
                    </span>
                  )}

                  {isReviewReply && reviewId === review._id && (
                    <div className="w-full flex relative dark:text-white text-black ">
                      <input
                        type="text"
                        placeholder="Enter your reply..."
                        value={reply}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setReply(e.target.value)
                        }
                        className={`block 800px:ml-12 mt-2 text-black dark:text-white outline-none dark:border-white bg-transparent border-b border-[#00000027] p-[5px] w-[95%] ${
                          (replyCreationLoading || reply.trim() === "") &&
                          "cursor-not-allowed"
                        } `}
                      />
                      <button
                        type="submit"
                        className="absolute right-0 bottom-1"
                        onClick={handleReviewReplySubmit}
                        disabled={reply.trim() === "" || replyCreationLoading}
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  {review?.commentReplies.map((reply: any, index: number) => (
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
                          <h5 className="text-[20px]">{reply?.user.name}</h5>{" "}
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
                  ))}
                </div>
              ))}
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default memo(CourseContentMedia);
