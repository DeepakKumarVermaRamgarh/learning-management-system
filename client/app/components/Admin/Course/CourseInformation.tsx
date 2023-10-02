import { styles } from "@/app/styles/style";
import React, { FC, useState } from "react";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleChange = (e: any) => {
    if (e.target.name === "thumbnail") {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (reader.readyState === 2) {
            setCourseInfo({ ...courseInfo, thumbnail: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      setCourseInfo({ ...courseInfo, [e.target.name]: e.target.value });
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="name" className={styles.label}>
            Course Name
          </label>
          <input
            type="text"
            name="name"
            value={courseInfo.name}
            onChange={handleChange}
            id="name"
            placeholder="MERN stack project"
            className={styles.input}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="description" className={styles.label}>
            Course Description
          </label>
          <textarea
            name="description"
            id="description"
            cols={30}
            rows={8}
            placeholder="Write something amazing..."
            className={`${styles.input} !h-min !p-2`}
            value={courseInfo.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full flex justify-between mb-5">
          <div className="w-[45%]">
            <label htmlFor="price" className={styles.label}>
              Course Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              inputMode="numeric"
              placeholder="1000"
              value={courseInfo.price}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className="w-[45%]">
            <label htmlFor="estimatedPrice" className={styles.label}>
              Estimated Price (optional)
            </label>
            <input
              type="number"
              name="estimatedPrice"
              id="estimatedPrice"
              inputMode="numeric"
              placeholder="5000"
              value={courseInfo.estimatedPrice}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="tags" className={styles.label}>
            Course Tags
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={courseInfo.tags}
            onChange={handleChange}
            placeholder="MERN, Next 13,Socket IO,Tailwind CSS,GraphQL,Docker"
            className={styles.input}
            required
          />
        </div>
        <div className="w-full flex justify-between mb-5">
          <div className="w-[45%]">
            <label htmlFor="lavel" className={styles.label}>
              Course Lavel
            </label>
            <input
              type="text"
              name="lavel"
              id="lavel"
              placeholder="Beginner/Intermediate/Expert"
              value={courseInfo.lavel}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className="w-[45%]">
            <label htmlFor="demoUrl" className={styles.label}>
              Demo Url
            </label>
            <input
              type="text"
              name="demoUrl"
              id="demoUrl"
              placeholder="euc822f"
              value={courseInfo.demoUrl}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        <div className="w-full mb-5">
          <input
            type="file"
            accept="image/*"
            id="file"
            name="thumbnail"
            className="hidden"
            onChange={handleChange}
            required
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {" "}
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt="thumbnail"
                className=" max-h-full w-full object-cover "
              />
            ) : (
              <span className="text-black dark:text-white">
                Drag and drop your thumbnail here or click to browse
              </span>
            )}{" "}
          </label>
        </div>
        <div className="w-full flex items-center justify-end mb-10">
          <input
            type="submit"
            value="Next"
            className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-white rounded mt-8 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;
