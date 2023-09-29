"use client";

import React, { FC, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../../app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter your name!")
    .min(4, "Name must be atleast 4  characters long"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email!"),
  password: Yup.string()
    .required("Please enter your password!")
    .min(8, "Password must be atleast 8 characters long")
    .max(20, "Password can't exceed 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
    ),
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isLoading, isSuccess }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successfull";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data?.message);
      }
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = { name, email, password };
      await register(data);
    },
  });

  const { errors, touched, handleSubmit, handleChange, values } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Join to E-Learning</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className={`${styles.label}`}>
            Enter Your Full Name
          </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={values.name}
            placeholder="John Doe"
            id="name"
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            } `}
          />
          {errors.name && touched.name && (
            <span className={`${styles.errorMsg}`}>{errors.name}</span>
          )}
        </div>

        <label htmlFor="email" className={`${styles.label}`}>
          Enter Your Email
        </label>
        <input
          type="email"
          inputMode="email"
          id="email"
          name="email"
          onChange={handleChange}
          value={values.email}
          placeholder="loginmail@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"} ${
            styles.input
          } `}
        />
        {errors.email && touched.email && (
          <span className={`${styles.errorMsg}`}>{errors.email}</span>
        )}

        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter Your Password
          </label>
          <input
            type={show ? "text" : "password"}
            name="password"
            onChange={handleChange}
            value={values.password}
            placeholder="********"
            id="password"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input} `}
          />

          {!show ? (
            <AiOutlineEyeInvisible
              size={20}
              className="absolute z-1 right-2 bottom-3 cursor-pointer text-black dark:text-white "
              onClick={() => setShow(!show)}
            />
          ) : (
            <AiOutlineEye
              size={20}
              className="absolute z-1 right-2 bottom-3 cursor-pointer text-black dark:text-white "
              onClick={() => setShow(!show)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className={`${styles.errorMsg}`}>{errors.password}</span>
        )}

        <div className="w-full mt-5">
          <input type="submit" value="Sign Up" className={`${styles.button}`} />
        </div>

        <br />

        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]  text-black dark:text-white ">
          Already have an account ?&nbsp;
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Sign in
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default SignUp;
