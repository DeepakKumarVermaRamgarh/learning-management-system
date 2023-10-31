"use client";

import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModel from "../utils/CustomModel";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assets/avatar.png";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, setRoute, open }) => {
  const { data } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (!isLoading && !userData && data) {
      socialAuth({
        email: data?.user?.email,
        name: data?.user?.name,
        avatar: data?.user?.image,
      });
      refetch();
    }

    if (!data && isSuccess) {
      toast.success("Login Successfully");
    }
    if (!data && !isLoading && !userData) {
      setLogout(true);
    }
  }, [data, userData, isLoading]);

  useEffect(() => {
    // Add event listener when the component is mounted
    const handleScroll = () => {
      if (window.scrollY > 80) setActive(true);
      else setActive(false);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // if clicked target is screen then setOpen sidebar false
  const handleClose = (e: any) => {
    if (e.target.id === "screen") setOpenSidebar(false);
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "bg-white dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-50 border-b dark:border-[#ffffff1c] shadow-xl transition duration-500 "
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-50 dark:shadow"
        }`}
      >
        <div className=" w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href="/"
                className="text-[25px] font-Poppins font-[500] text-black dark:text-white "
              >
                {" "}
                E-Learning{" "}
              </Link>
            </div>

            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* only for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {userData?.user ? (
                <Link href="/profile">
                  <Image
                    src={
                      userData.user.avatar ? userData.user.avatar.url : avatar
                    }
                    alt={userData.user.name}
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer"
                    style={{
                      border: activeItem === 5 ? "2px solid #37a39a" : "none",
                    }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* mobile sidebar */}

        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[100] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[100] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              {userData.user ? (
                <Link href="/profile">
                  <Image
                    src={
                      userData.user.avatar ? userData.user.avatar.url : avatar
                    }
                    alt={userData.user.name}
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer ml-[20px] "
                    style={{
                      border: activeItem === 5 ? "2px solid #37a39a" : "none",
                    }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}

              <br />
              <br />

              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright &copy; {new Date().getFullYear()} E-Learning
              </p>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              refetch={refetch}
            />
          )}
        </>
      )}
      {route === "Sign-Up" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
              refetch={refetch}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
