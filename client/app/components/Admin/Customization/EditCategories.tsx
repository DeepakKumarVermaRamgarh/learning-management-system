import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

type Props = {};

const EditCategories: FC<Props> = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();

  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout.categories);
    }
    if (isSuccess) {
      refetch();
      toast.success("Categories updated successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, isSuccess, error]);

  const handleCategoriesAdd = (id: string, value: string) => {
    setCategories((prevCategories: any[]) =>
      prevCategories.map((e: any) =>
        e._id === id ? { ...e, title: value } : e
      )
    );
  };

  const newCategoriesHandler = () => {
    if (categories[categories.length - 1].title.trim() === "") {
      toast.error("Category title can't be empty.");
    } else {
      setCategories((prevCategories: any[]) => [
        ...prevCategories,
        { title: "" },
      ]);
    }
  };

  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((category) => category.title === "");
  };

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data.layout.categories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories &&
            categories.map((item: any, index: number) => (
              <div className="p-3" key={index}>
                <div className="flex items-center w-full justify-center">
                  <input
                    className={`${styles.input} !w-[unset] !border-none !text-[20px] `}
                    value={item.title}
                    onChange={(e) =>
                      handleCategoriesAdd(item._id, e.target.value)
                    }
                    placeholder="Enter Category Title..."
                  />

                  <AiOutlineDelete
                    className="dark:text-white text-black cursor-pointer text-[18px]"
                    onClick={() => {
                      setCategories((prevCategories: any[]) => {
                        prevCategories.filter(
                          (category: any) => category._id !== item._id
                        );
                      });
                    }}
                  />
                </div>
              </div>
            ))}

          <br />
          <br />

          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black cursor-pointer text-[25px]"
              onClick={newCategoriesHandler}
            />
          </div>

          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
              areCategoriesUnchanged(data.layout.categories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
            } !rounded absolute bottom-12 right-12 `}
            onClick={
              areCategoriesUnchanged(data.layout.categories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? () => null
                : editCategoriesHandler
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
