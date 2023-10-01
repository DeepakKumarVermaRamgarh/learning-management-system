"use client";

import React, { FC, useState } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";

type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);

  return (
    <Protected>
      <Heading
        title={`${user?.name}'s profile`}
        description="E-Learning is a platform for student to learn and get help from the teachers."
        keywords="Programming, MERN, Redux, Data Science, Machine Learning, Development"
      />
      <Header
        open={open}
        activeItem={activeItem}
        setOpen={setOpen}
        route={route}
        setRoute={setRoute}
        setActiveItem={setActiveItem}
      />
      <Profile user={user} />
    </Protected>
  );
};

export default Page;
