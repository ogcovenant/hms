import { NextRequest, NextResponse } from "next/server";
import STATUS from "@/config/statusConfig";
import verify from "@/utils/verify-user";
import db from "@/config/dbconfig";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const { datetime, doctorID, patientID } = await req.json();

  try {
    let user;

    try {
      const res = await verify(req);
      user = res;
    } catch (err) {
      console.log(err);
      return NextResponse.json({}, { status: STATUS.unauthorized });
    }

    //@ts-ignore
    if (!user || !user.id) {
      return NextResponse.json({}, { status: STATUS.unauthorized });
    }

    const appointment = {
      id: uuid(),
      date: new Date(datetime).toLocaleString(),
      doctorID: doctorID,
      patientID: patientID,
      userId: user.id, 
      status: "pending"
    };


    await db.appointment.create({
      data: {
        id:appointment.id,
        date: appointment.date,
        doctorID: appointment.doctorID,
        patientID: appointment.patientID,
        userID: appointment.userId,
        status: appointment.status
      }
    });

    return NextResponse.json({}, { status: STATUS.created });
  } catch (err) {
    console.log(err);
    return NextResponse.json({}, { status: STATUS.serverError });
  }
}


export async function GET(req: NextRequest) {
  try {
    let user;

    try {
      const res = await verify(req);
      user = res;
    } catch (err) {
      console.log(err);
      return NextResponse.json({}, { status: STATUS.unauthorized });
    }

    //@ts-ignore
    if (!user || !user.id) {
      return NextResponse.json({}, { status: STATUS.unauthorized });
    }

    const appointments = await db.appointment.findMany({
      where: {
        userID: user.id,
      },
      include: {
        doctor: true,
        patient: true,
        
      }
    });

    return NextResponse.json(
      { msg: "Appointments fetched Successfully", appointments: appointments },
      { status: STATUS.ok }
    );

  } catch (err) {
    return NextResponse.json({}, { status: STATUS.serverError });
  }
}

export async function PUT(req: NextRequest) {
  const { appointmentID, type, newDate } = await req.json()

  try{

    let user;

    try {
      const res = await verify(req);
      user = res;
    } catch (err) {
      console.log(err);
      return NextResponse.json({}, { status: STATUS.unauthorized });
    }

    //@ts-ignore
    if (!user || !user.id) {
      return NextResponse.json({}, { status: STATUS.unauthorized });
    }

    if( type === "mark" ){
      await db.appointment.update({
        where: {
          id: appointmentID
        },
        data: {
          status: "completed"
        }
      })
    }

    if(type === "update"){

      const data = {
        id: appointmentID,
        date: new Date(newDate).toLocaleString(),
        type: type
      }

      //for updating the whole appointment
      await db.appointment.update({
        where: {
          id: appointmentID
        },
        data: {
          date: data.date
        }
      })
    }

    return NextResponse.json({ msg: "Operations completed successfully!!!" })

  }catch(err){
    return NextResponse.json({}, {status: STATUS.serverError})
  }
}

export async function DELETE(req: NextRequest) {
  const { appointmentID } = await req.json();

  let user;
  try {
    try {
      const res = await verify(req);
      user = res;
    } catch (err) {
      console.log(err);
      return NextResponse.json({}, { status: STATUS.unauthorized });
    }

    //@ts-ignore
    if (!user || !user.id) {
      return NextResponse.json({}, { status: STATUS.unauthorized });
    }

    // Check if doctor exists
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentID },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: STATUS.notFound }
      );
    }

    await db.appointment.delete({
      where: {
        id: appointmentID
      }
    })

    return NextResponse.json(
      { msg: "Appointment Successfully Removed" },
      { status: STATUS.ok }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({}, { status: STATUS.serverError });
  }
}
