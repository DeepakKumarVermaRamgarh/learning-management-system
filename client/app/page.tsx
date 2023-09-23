"use client";

import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="E-Learning"
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
      <Hero />
    </div>
  );
};

export default Page;
