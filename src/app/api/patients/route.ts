import { NextRequest, NextResponse } from "next/server";
import STATUS from "@/config/statusConfig";
import verify from "@/utils/verify-user";
import db from "@/config/dbconfig";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phoneNumber } = await req.json();

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

    const patient = {
      id: uuid(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      //@ts-ignore
      userId: user.id,
    };

    const patientUser = {
      id: patient.id,
      email: patient.email,
      password: await bcrypt.hash(String(patient.lastName).toLowerCase(), 12),
      userCategory: "patient",
    };

    const existingPatient = await db.patient.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });

    if (existingPatient) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: STATUS.conflict }
      );
    }

    await db.$transaction([
      db.patient.create({
        data: patient,
      }),
      db.user.create({
        data: patientUser,
      }),
    ]);

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

    const patients = await db.patient.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      { msg: "Patients fetched Successfully", patients: patients },
      { status: STATUS.ok }
    );
  } catch (err) {
    console.log(err)
    return NextResponse.json({}, { status: STATUS.serverError });
  }
}

export async function DELETE(req: NextRequest) {
  const { id: patientID } = await req.json();

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
    const patient = await db.patient.findUnique({
      where: { id: patientID },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: STATUS.notFound }
      );
    }

    // Check if user exists
    const userRecord = await db.user.findUnique({
      where: { id: patientID },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: "User not found" },
        { status: STATUS.notFound }
      );
    }

    await db.$transaction([
      db.patient.delete({
        where: { id: patientID },
      }),
      db.user.delete({
        where: { id: patientID },
      }),
    ]);

    return NextResponse.json(
      { msg: "Patient Successfully Removed" },
      { status: STATUS.ok }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({}, { status: STATUS.serverError });
  }
}
