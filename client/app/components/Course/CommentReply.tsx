import React, { Dispatch, SetStateAction } from "react";
import CommentItem from "./CommentItem";

type Props = {
  data: Array<any>;
  activeVideo: number;
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
  handleAnswerSubmit: () => void;
  user: any;
  setQuestionId: Dispatch<SetStateAction<string>>;
  answerCreationLoading: boolean;
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  user,
  setQuestionId,
  answerCreationLoading,
}: Props) => {
  return (
    <div className="w-full my-3">
      {data[activeVideo]?.questions?.map((question: any, index: number) => (
        <CommentItem
          key={index}
          item={question}
          answer={answer}
          setAnswer={setAnswer}
          setQuestionId={setQuestionId}
          handleAnswerSubmit={handleAnswerSubmit}
          answerCreationLoading={answerCreationLoading}
        />
      ))}
    </div>
  );
};

export default CommentReply;
