"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import EnrolledCourses from "./EnrolledCourses";
import { useGetCourseQuery } from "@/redux/features/courses/courseApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const { data, isLoading } = useGetCourseQuery(undefined, {});
  const [courses, setCourses] = useState<any[]>([]);

  const logoutHandler = async () => {
    setLogout(true);
    await signOut();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) setScroll(true);
      else setScroll(false);
    });
  }

  useEffect(() => {
    if (!isLoading && data) {
      setCourses(data.courses.filter((course: any) => course._id === user._id));
    }
  }, [data, user._id]);

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border dark:border-[#ffffff1d] border-[#b9b5b5b0] rounded-[5px] shadow-sm mt-[80] mb-[80px] sticky bg-white ${
          scroll ? "top-[120px]" : " top-[30px]"
        } left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          setActive={setActive}
          avatar={avatar}
          logoutHandler={logoutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo user={user} avatar={avatar} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}
      {active === 3 && (
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8">
          <EnrolledCourses courses={courses} />
        </div>
      )}
    </div>
  );
};
export default Profile;
