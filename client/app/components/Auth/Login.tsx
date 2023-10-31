"use client";

import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../../app/styles/style";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { signIn } from "next-auth/react";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: any;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email!"),
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters long")
    .required("Please enter your password!"),
});

const Login: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [login, { error, isSuccess }] = useLoginMutation();

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      toast.success("Login Successfully!");
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      } 
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });

  const { errors, touched, handleSubmit, handleChange, values } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Login with E-Learning</h1>
      <form onSubmit={handleSubmit}>
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
          {errors.password && touched.password && (
            <span className={`${styles.errorMsg}`}>{errors.password}</span>
          )}
        </div>

        <div className="w-full mt-5">
          <input type="submit" value="Login" className={`${styles.button}`} />
        </div>

        <br />

        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle
            size={30}
            className="cursor-pointer mr-2"
            onClick={() => signIn("google")}
          />
          <AiFillGithub
            size={30}
            className="cursor-pointer ml-2"
            onClick={() => signIn("github")}
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]  text-black dark:text-white ">
          Not have any account ?&nbsp;
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Sign-Up")}
          >
            Sign up
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Login;
