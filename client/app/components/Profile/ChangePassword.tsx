import { styles } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import React, { FC, useState, useEffect } from "react";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: FC<Props> = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();
    setOldPassword((prev) => prev.trim());
    setNewPassword((prev) => prev.trim());
    setConfirmPassword((prev) => prev.trim());

    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("Old and new password cannot be the same");
      return;
    }

    await updatePassword({
      oldPassword,
      newPassword,
    });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password updated successfully");
    }
    if (error) {
      if ("data" in error) {
        const errMsg = error as any;
        toast.error(errMsg?.data?.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className=" w-full pl-7 px-2 800px:px-5 800px:pl-0 dark:text-white text-black">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] dark:text-white text-black pb-2 ">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center dark:text-white text-black"
        >
          <div className="w-full 800px:w-[60%] mt-5 ">
            <label className="block pb-2">Enter your old password :</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 `}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[60%] mt-2 ">
            <label className="block pb-2">Enter your new password :</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 `}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[60%] mt-2 ">
            <label className="block pb-2">Confirm your new password :</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 `}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <input
            type="submit"
            value="Update"
            className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`}
          />
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
