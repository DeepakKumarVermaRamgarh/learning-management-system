import React, { Dispatch, SetStateAction } from "react";
import CommentItem from "./CommentItem";

type Props = {
  data: Array<any>;
  activeVideo: number;
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
  handleAnswerSubmit: () => void;
  setQuestionId: Dispatch<SetStateAction<string>>;
  answerCreationLoading: boolean;
  questionId: string;
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: Props) => {
  return (
    <div className="w-full my-3">
      {data[activeVideo]?.questions?.map((question: any) => (
        <CommentItem
          key={question._id}
          item={question}
          answer={answer}
          setAnswer={setAnswer}
          setQuestionId={setQuestionId}
          handleAnswerSubmit={handleAnswerSubmit}
          answerCreationLoading={answerCreationLoading}
          questionId={questionId}
        />
      ))}
    </div>
  );
};

export default CommentReply;
