import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "@/app/styles/style";

type Props = {};

const EditHero: FC<Props> = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const { data, isLoading, error, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error: editError }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data.layout?.banner.title);
      setSubTitle(data.layout?.banner.subTitle);
      setImage(data.layout?.banner?.image?.url);
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
    if (isSuccess) {
      refetch();
      toast.success("Banner updated successfully!");
    }
  }, [data, editError, error, isSuccess, refetch]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  if (isLoading) return <Loader />;

  return (
    // <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px] ">
    <div className="w-full 1000px:flex items-center">
      <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vh] hero_animation rounded-[50%] 1100px:left-[18rem] 1500px:left-[21rem] "></div>
      <div className=" 1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-0 z-10 ">
        <div className="relative flex items-center justify-end">
          <img
            src={image}
            alt="banner"
            className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-auto z-10 "
          />
          <input
            type="file"
            id="banner"
            accept="image/*"
            onChange={handleUpdate}
            className="hidden"
          />

          <label htmlFor="banner" className="absolute bottom-0 right-0 z-20">
            <AiOutlineCamera className="dark:text-white text-black text-[18px] cursor-pointer" />
          </label>
        </div>
      </div>
      <div className=" 1000px:w-[60%] flex flex-col items-center 1000px:mt-0 text-center 1000px:text-left mt-[150px] ">
        <textarea
          cols={30}
          rows={4}
          placeholder="Improve Your Online Learning Experience Better Instantly"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="dark:text-white text-[#000000c7] text-[30px] resize-none px-3 w-full 1000px:text-[60px] 1500px:text-[70px] font-[600] font-Poppins mb-2 bg-transparent"
        ></textarea>
        <textarea
          cols={30}
          rows={4}
          placeholder="We have 40k+ Online Courses & 500k+ Online registered students. Find your desired courses here..."
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          className="dark:text-[#edfff4] text-[#000000ac] text-[18px] resize-none px-3 w-full 1100px:!w-[74%] 1500px:!w-[55%] font-[600] font-Josefin mb-6 bg-transparent"
        ></textarea>

        <div
          className={`${
            styles.button
          } !w-[100px] !min-h-[40px] dark:text-white text-black bg-[#cccccc34] 
                ${
                  data?.layout?.banner?.title !== title ||
                  data?.layout?.banner?.subTitle !== subTitle ||
                  data?.layout?.banner?.image?.url !== image
                    ? "!cursor-pointer !bg-[#42d383]"
                    : "!cursor-not-allowed"
                }
                !rounded absolute bottom-12 right-12

            `}
          onClick={
            data?.layout?.banner?.title !== title ||
            data?.layout?.banner?.subTitle !== subTitle ||
            data?.layout?.banner?.image?.url !== image
              ? handleEdit
              : () => null
          }
        >
          Save
        </div>
      </div>
    </div>
  );
};

export default EditHero;
