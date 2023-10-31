"use client";

import { useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { useSelector } from "react-redux";
import Policy from "./Policy";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<number>(3);
  const [route, setRoute] = useState<string>("Login");

  return (
    <div>
      <Heading
        title="Policy || E-Learning"
        description="E-Learning is a learning management platform for programmers to boost up their skills"
        keywords="programming,mern,react,nodejs,javascript,dsa,machine learning,express,mongodb,sql"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <Policy />
      <Footer />
    </div>
  );
};

export default Page;
