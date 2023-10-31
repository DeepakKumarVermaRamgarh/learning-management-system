import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { HiMinus, HiPlus } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

type Props = {};

const EditFaq: FC<Props> = () => {
  const { data, isLoading, error, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error: editError }] = useEditLayoutMutation();

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }

    if (isSuccess) {
      refetch();
      toast.success("FAQ Updated Successfully!");
    }

    if (error) {
      if ("data" in error) {
        const errMsg = error as any;
        toast.error(errMsg.data.message);
      } 
    }
    if (editError) {
      if ("data" in editError) {
        const errMsg = editError as any;
        toast.error(errMsg.data.message);
      }
    }
  }, [data, editError, error, isSuccess]);

  const newFaqHandler = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const toggleQuestion = (id: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: any, value: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: any, value: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const areQuestionsUnchanged = (
    originalQuestions: any[],
    newQuestions: any[]
  ) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  const isAnyQuestionEmpty = (questions: any[]) => {
    return questions.some((q) => q.question.trim() === "" || q.answer === "");
  };

  const handleEdit = async () => {
    await editLayout({
      type: "FAQ",
      faq: questions,
    });
  };

  if (isLoading) <Loader />;

  return (
    <div className=" w-[90%] 800px:w-[80%] m-auto mt-[120px] ">
      <div className="mt-12">
        <dl className="space-y-8 mb-8">
          {questions.map((q: any) => (
            <div
              key={q._id}
              className={`${
                q._id !== questions[0]?._id && "border-t"
              } border-gray-200 pt-6`}
            >
              <dt className="text-lg">
                <button
                  className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                  onClick={() => toggleQuestion(q._id)}
                >
                  <input
                    className={`${styles.input} border-none `}
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(q._id, e.target.value)
                    }
                    placeholder="Add your question..."
                    required
                  />

                  <span className="ml-6 flex-shrink-0">
                    {q.active ? (
                      <HiMinus className="h-6 w-6" />
                    ) : (
                      <HiPlus className="h-6 w-6" />
                    )}
                  </span>
                </button>
              </dt>

              {q.active && (
                <dd className="mt-2 pr-12">
                  <input
                    className={`${styles.input} border-none `}
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                    placeholder="Add your answer..."
                    required
                  />

                  <span className="ml-6 flex-shrink-0">
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => {
                        setQuestions((prev) =>
                          prev.filter((ques) => ques._id !== q._id)
                        );
                      }}
                    />
                  </span>
                </dd>
              )}
            </div>
          ))}
        </dl>
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newFaqHandler}
        />
      </div>

      <div
        className={`${
          styles.button
        } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
          areQuestionsUnchanged(data?.layout?.faq, questions) ||
          isAnyQuestionEmpty(questions)
            ? "!cursor-not-allowed"
            : "!cursor-pointer !bg-[#42d383]"
        } !rounded absolute bottom-12 right-12 `}
        onClick={
          areQuestionsUnchanged(data?.layout?.faq, questions) ||
          isAnyQuestionEmpty(questions)
            ? () => null
            : handleEdit
        }
      >
        Save
      </div>
    </div>
  );
};

export default EditFaq;
