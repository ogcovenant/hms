"use client";

import DocTab from "@/components/Doctab";
import { PatColumns } from "@/components/Pattab";
import { Patient } from "@/components/Pattab";
import { Button } from "@/components/ui/button";
import { Add } from "iconsax-react";
import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AxiosError } from "axios";
import { FaSpinner } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email provided").required("Required"),
      phoneNumber: Yup.string()
        .min(11, "Phone Number can't be less than 11 characters")
        .max(11, "Phone number can't be more than 11 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.post(
          "/api/patients",
          {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            email: values.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 201) {
          toast.success("Patient Successfully Added!");
          window.location.reload()
        }
      } catch (err) {
        const error = err as AxiosError;

        if (error.response && error.response.status === 500) {
          toast.error("An unexpected error occured!");
        }

        if (error.response && error.response.status === 401) {
          router.replace("/login");
        }

        if (error.response && error.response.status === 409) {
          toast.error("Patient with email or phone number already exists");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<Patient[]>([]);

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/patients")

      setData(res.data.patients);
    };

    fetchData();
  }, []);

  return (
    <div className="p-10 overflow-auto">
      <Toaster />
      <div className="flex items-center justify-between gap-5">
        <h1 className="text-2xl text-[#374858]">Patients</h1>
        <Button
          className="bg-[#3497F9] active:bg-[#3497F9] hover:bg-[#3497F9]"
          onClick={handleMenuOpen}
        >
          <Add size="24" color="#FFF" />
          <span>Add</span>
        </Button>
      </div>
      <div className="bg-white mt-3 p-5 rounded-md">
        <div>
          <DocTab columns={PatColumns} data={data} />
        </div>
      </div>
      {menuOpen && (
        <div className="absolute top-0 left-0 bg-[#00000060] w-full h-screen flex justify-center items-center">
          <div className="bg-white w-[35%] p-4 rounded-md">
            <div className="text-xl flex items-center justify-between px-6">
              <h1>Create Patient</h1>
              <div className="cursor-pointer" onClick={() => handleMenuOpen()}>
                <FaXmark />
              </div>
            </div>
            <div>
              <form
                className="mt-5 flex flex-col justify-center gap-5 p-5"
                onSubmit={formik.handleSubmit}
                onReset={formik.handleReset}
              >
                <div>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter Patient's First Name"
                    className="border-2 p-2 rounded-md w-4/5"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <p className="text-red-500 text-sm">
                      {formik.errors.firstName}
                    </p>
                  ) : null}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter Patient's Last Name"
                    className="border-2 p-2 rounded-md w-4/5"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <p className="text-red-500 text-sm">
                      {formik.errors.lastName}
                    </p>
                  ) : null}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Patient's Email"
                    className="border-2 p-2 rounded-md w-4/5"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <p className="text-red-500 text-sm">
                      {formik.errors.email}
                    </p>
                  ) : null}
                </div>
                <div>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter Patient's Phone Number"
                    className="w-4/5 border-2 p-2 rounded-md"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                    <p className="text-red-500 text-sm">
                      {formik.errors.phoneNumber}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-4">
                  <button
                    type="reset"
                    className="bg-red-500 text-white p-3 rounded-md"
                    onClick={() => handleMenuOpen()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-3 rounded-md"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin">
                        <FaSpinner size={20} />
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
