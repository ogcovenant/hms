import { NextRequest, NextResponse } from "next/server";
import verify from "@/utils/verify-user";
import STATUS from "@/config/statusConfig";
import db from "@/config/dbconfig";
import { v4 as uuid } from "uuid";


export async function GET(req: NextRequest) {
  try {
    const user = await verify(req);

    if (!user.id) {
      return NextResponse.json({}, { status: STATUS.authRequired });
    }

    const appointments = await db.appointment.findMany({
      where: {
        userId: user.id,
      },
    });

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ msg: "No Appointments Found" }, { status: STATUS.notFound });
    }

    return NextResponse.json({ msg: "Appointments Fetched Successfully", appointments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({}, { status: STATUS.unauthorized });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verify(req);

    if (!user.id) {
      return NextResponse.json({}, { status: STATUS.authRequired });
    }

    const { time, date, patient, doctor } = await req.json();

    const newAppointment = {
      id: uuid(),
      time: time,
      date: date,
      patient: patient,
      doctor: doctor
    }


    return NextResponse.json({ msg: "Appointment Created Successfully", appointment: newAppointment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({}, { status: STATUS.unauthorized });
  }
}
