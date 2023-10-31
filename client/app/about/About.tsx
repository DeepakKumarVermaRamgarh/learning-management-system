import React from "react";
import { styles } from "../styles/style";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="text-black dark:text-white">
      <h1 className={`${styles.title} 800px:!text-[45px] mb-2`}>
        What is <span className={styles.gradient}>E-Learning ?</span>
      </h1>
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins">
          Are you ready to take your programming skills to the next level? Look
          no further than E-Learning, the premier programming community
          dedicated to helping new programmers to achieve their goals and reach
          teir full potential.
          <br />
          <br />
          As the founder and CEO of E-Learning, I know firsthand the challenges
          that come with learning and growing in the programming industry.
          That&apos;s why I created E-Learning management system - to provide
          new programmers with the resources and support they need to success.
          <br />
          <br />
          Our YouTube channel is a treasure trave of informative videos on
          everything from the programming basics to advanced techniques. But
          that&apos;s just the beginning. Our affordable courses are designed to
          give you the high-quality education you need to success in the
          industry, without breaking the bank.
          <br />
          <br />
          At E-Learning, we belive that prices should never be a barrier to
          acheving your dreams. That&apos;s why our courses are priced low - so
          that anyone, regardless of their financial situation, can access the
          tools and knowledge they need to succeed.
          <br />
          <br />
          But E-Learning is more than just a community - we&apos;re a family.
          Our supportive community of like-minded individuals is here to help
          you in every step of the way, whether you&apos;re just starting out or
          looking to take your skills to the next level.
          <br />
          <br />
          With E-Learning by your side, there&apos;s nothing standing between
          you and your dream job. Our courses and community will provide you
          with the guidance, support, and motivation you need to unleash you
          full potential and become a skilled programmer.
          <br />
          <br />
          So what are you waiting for ? Join the E-Learning family today and
          let&apos;s conquer the programming industry together! With our
          affordable courses, informative videos, and supportive community, the
          sky&apos;s the limit.
        </p>
        <br />
        <br />
        <span className="font-Cursive text-[22px]">Deepak Kumar Verma</span>
        <h5 className="text-[18px] font-Poppins mb-6">
          Founder and CEO of E-Learning
        </h5>
      </div>
    </div>
  );
};

export default About;
