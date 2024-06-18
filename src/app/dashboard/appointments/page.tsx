"use client";

import Apptab from "@/components/Apptab";
import { columns } from "@/components/Apptab";
import { Appointment } from "@/components/Apptab";
// import { appointments } from "@/components/Apptab";
import { Button } from "@/components/ui/button";
import { Add } from "iconsax-react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { FaXmark, FaSpinner } from "react-icons/fa6";
import axios, { AxiosError } from "axios";
import toast, {Toaster} from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Yup from "yup"

const page = () => {

  const router = useRouter()
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  console.log(yesterday.toLocaleString())

  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [data, setData] = useState([]);
  const [appointments, setAppointments] = useState<Appointment[]>([])


  const formik = useFormik({
    initialValues: {
      datetime: "",
      patient: "",
      doctor: "",
    },
    validationSchema:Yup.object({
      doctor: Yup.string().required("Required"),
      patient: Yup.string().required("Required"),
      datetime: Yup.string().required("Required")
    }),
    onSubmit: async(values) => {
      setLoading(true);
      

      console.log(values)
      try {
        
        const res = await axios.post("/api/appointments", {
          datetime: values.datetime,
          doctorID: values.doctor,
          patientID: values.patient
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        })

        if (res.status === 201) {
          toast.success("Appointment Successfully Added!");
          window.location.reload()
        }

      } catch (err) {
        const error = err as AxiosError 
        
        if (error.response && error.response.status === 500) {
          toast.error("An unexpected error occured!");
        }

        if (error.response && error.response.status === 401) {
          router.replace("/login");
        }

      }finally{
        setLoading(false)
      }
    },
  });

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  const initialFetch = async () => {
    try {
      const res = await axios.get("/api/doctors");

      if (res.status === 200) {
        setDoctors(res.data.doctors);
      }

      const res2 = await axios.get("/api/patients");

      if (res.status === 200) {
        setPatients(res2.data.patients);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAppointments = async() => {
    try {
      const res = await axios.get("/api/appointments")

      if(res.status === 200){
        setData(res.data.appointments)
      }

      console.log(res)
    } catch (error) {
      console.log(error)
    } 
  }

  useEffect(() => { 

    fetchAppointments().then(() => {
      initialFetch()
    })
    
  }, []);

  useEffect(() => {
    const temp:any = []

    //@ts-ignore
    data.forEach((appointment) =>{
      if(appointment){
        temp.push({
          //@ts-ignore
          id: appointment.id,
          //@ts-ignore
          time: appointment.time,
          //@ts-ignore
          date: appointment.date,
          //@ts-ignore
          doctorName: `Dr. ${appointment.doctor.lastName}`,
          //@ts-ignore
          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          //@ts-ignore
          status: appointment.status
        })
      }
    })

    setAppointments(temp) 
  }, [data])

  return (
    <div className="p-10 overflow-auto">
      <Toaster />
      <div className="flex items-center justify-between gap-5">
        <h1 className="text-2xl text-[#374858]">Appointments</h1>
        <Button
          className="bg-[#3497F9] active:bg-[#3497F9] hover:bg-[#3497F9]"
          onClick={() => handleMenuOpen()}
        >
          <Add size="24" color="#FFF" />
          <span>Add</span>
        </Button>
      </div>
      <div className=" bg-white mt-3 p-5 rounded-md">
        <div className="">
          <Apptab columns={columns} data={appointments} />
        </div>
      </div>
      {menuOpen && (
        <div className="absolute top-0 left-0 bg-[#00000060] w-full h-screen flex justify-center items-center">
          <div className="bg-white w-[35%] p-4 rounded-md">
            <div className="text-xl flex items-center justify-between px-6">
              <h1>Create Appointment</h1>
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
                    type="datetime-local"
                    name="datetime"
                    id="datetime"
                    className="border-2 p-2 rounded-md w-full"
                    value={formik.values.datetime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.datetime && formik.errors.datetime ? (
                    <p className="text-red-500 text-sm">{formik.errors.datetime}</p>
                  ) : null}
                </div>
                <div>
                  <Select
                    name="patient"
                    onValueChange={(e)=>{
                      formik.setFieldValue("patient", e)
                    }}
                    defaultValue={formik.values.patient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => {
                        return (
                          //@ts-ignore
                          <SelectItem value={patient.id}>
                            {/*@ts-ignore*/}
                            {`${patient.firstName} ${patient.lastName}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formik.touched.patient && formik.errors.patient ? (
                    <p className="text-red-500 text-sm">{formik.errors.patient}</p>
                  ) : null}
                </div>
                <div>
                  <Select
                    name="doctor"
                    onValueChange={(e)=>{
                      formik.setFieldValue("doctor", e)
                    }}
                    defaultValue={formik.values.doctor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => {
                        return (
                          //@ts-ignore
                          <SelectItem value={doctor.id}>
                            {/*@ts-ignore*/}
                            {`${doctor.firstName} ${doctor.lastName}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formik.touched.doctor && formik.errors.doctor ? (
                    <p className="text-red-500 text-sm">{formik.errors.doctor}</p>
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

export default page;
