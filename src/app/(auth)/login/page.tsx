"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

const page = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().trim("Password cannot contain whitespaces")
        .min(8, "Password must be at least 8 characters")
        .required("Required")
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const res = await axios.post(
          "/api/login",
          {
            email: values.email,
            pasword: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 200) {
          setLoading(false);
          toast.success("Login Successful!");
          router.replace("/dashboard");
        }
      } catch (err) {
        const error = err as AxiosError;
        if (!error.response) {
          setLoading(false);
          return;
        }

        if(error.response.status === 404){
          setLoading(false)
          toast.error("User with email not found!")
        }

        if(error.response.status === 406){
          setLoading(false)
          toast.error("Either email or password is incorrect!")
        }

        if (error.response.status === 500) {
          setLoading(false);
          toast.error("An unexpected error occured!");
        }
      }
    },
  });

  return (
    <div className="p-10 xl:p-20 w-full">
      <Toaster />
      <div className="flex justify-center">
        <Logo />
      </div>
      <h1 className="text-3xl text-center">Log In</h1>
      <div className="w-full">
        <form
          className="mt-10 flex flex-col items-center gap-8 w-full"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="border-2 border-[#3497F9] p-3 rounded-xl"
              placeholder="example@email.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500">{formik.errors.email}</p>
            ) : null}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="border-2 border-[#3497F9] p-3 rounded-xl"
              placeholder="********"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500">{formik.errors.password}</p>
            ) : null}
          </div>
          <button
            type="submit"
            className="bg-[#3497F9] p-3 w-full md:w-[50%] text-white rounded-xl"
          >
            {loading ? (
              <div className="animate-spin flex justify-center">
                <FaSpinner size={32} />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
      <div className="flex justify-center mt-5 w-full">
        <p>
          Don't have an account?{" "}
          <a href="/signup" className="text-[#3497F9]">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default page;
