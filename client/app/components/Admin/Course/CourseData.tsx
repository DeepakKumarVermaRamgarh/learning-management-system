import { styles } from "@/app/styles/style";
import React, { FC } from "react";
import toast from "react-hot-toast";
import { MdAddCircle } from "react-icons/md";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitChange = (index: number, value: any) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisiteChange = (index: number, value: any) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title.trim() !== "" &&
      prerequisites[prerequisites.length - 1]?.title.trim() !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill required fields before moving next!");
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div className="mb-5">
        <label className={`${styles.label} text-[20px]`}>
          What are the benefits for students in this course ?
        </label>
        <br />
        {benefits?.map((benefit: any, index: number) => (
          <input
            type="text"
            name="benefit"
            key={index}
            placeholder="You will be able to build a full stack project..."
            className={`${styles.input} my-2`}
            value={benefit.title}
            onChange={(e) => handleBenefitChange(index, e.target.value)}
            required
          />
        ))}
        <MdAddCircle
          style={{ marginBlock: "10px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
        />
      </div>

      <div className="mb-5">
        <label className={`${styles.label} text-[20px]`}>
          What are the prerequisites before starting this course ?
        </label>
        <br />
        {prerequisites?.map((prerequisite: any, index: number) => (
          <input
            type="text"
            name="prerequisite"
            key={index}
            placeholder="You need basic knowledge of MERN technologies..."
            className={`${styles.input} my-2`}
            value={prerequisite.title}
            onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
            required
          />
        ))}
        <MdAddCircle
          style={{ marginBlock: "10px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisite}
        />
      </div>

      <div className="w-full flex items-center justify-between mb-10">
        <div
          className="w-full flex items-center justify-center 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-white rounded mt-8 cursor-pointer"
          onClick={prevButton}
        >
          Prev
        </div>
        <div
          className="w-full flex items-center justify-center 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-white rounded mt-8 cursor-pointer"
          onClick={handleOptions}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseData;
