import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import { styles } from "../../styles/style";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/avatar.png";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });
  const [editProfile, { isSuccess: nameUpdated, error: nameError }] =
    useEditProfileMutation();

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setName((prev) => prev.trim());
    if (name !== "" && name !== user.name) {
      await editProfile({ name });
    }
  };

  useEffect(() => {
    if (isSuccess || nameUpdated) {
      isSuccess && toast.success("Profile image updated.");
      nameUpdated && toast.success("Profile updated successfully.");
      setLoadUser(true);
    }
    if (error) {
      if ("data" in error) {
        toast.error(error?.data?.message);
      } else console.log(error);
    }
    if (nameError) {
      if ("data" in nameError) {
        toast.error(error?.data?.message);
      } else console.log(error);
    }
  }, [isSuccess, error, nameUpdated, nameError]);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={avatar ? user.avatar.url || avatar : avatarIcon}
            alt="avatar"
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full "
            width={120}
            height={120}
          />
          <input
            type="file"
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] dark:bg-slate-900 bg-zinc-300 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer ">
              <AiOutlineCamera
                size={20}
                className="z-3 dark:fill-white fill-black "
              />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-1/2 m-auto block pb-4 ">
            <div className="w-full">
              <label className="block pb-2">Full Name :</label>
              <input
                type="text"
                value={name}
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="w-full pt-2">
              <label className="block pb-2">Full Name :</label>
              <input
                type="email"
                value={user?.email}
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                readOnly
              />
            </div>
            <input
              type="submit"
              value="Update"
              className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;
