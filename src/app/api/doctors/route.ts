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

    const doctor = {
      id: uuid(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      //@ts-ignore
      userId: user.id,
    };

    const doctorUser = {
      id: doctor.id,
      email: doctor.email,
      password: await bcrypt.hash(doctor.lastName, 12),
      userCategory: "doctor",
    };

    const existingDoctor = await db.doctor.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });

    if (existingDoctor) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: STATUS.conflict }
      );
    }

    await db.$transaction([
      db.doctor.create({
        data: doctor,
      }),
      db.user.create({
        data: doctorUser,
      }),
    ]);

    return NextResponse.json({}, { status: STATUS.created });
  } catch (err) {
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

    const doctors = await db.doctor.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      { msg: "Doctors fetched Successfully", doctors: doctors },
      { status: STATUS.ok }
    );
  } catch (err) {
    return NextResponse.json({}, { status: STATUS.serverError });
  }
}

export async function DELETE(req: NextRequest) {
  const { id: doctorID } = await req.json();

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
    const doctor = await db.doctor.findUnique({
      where: { id: doctorID },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: STATUS.notFound }
      );
    }

    // Check if user exists
    const userRecord = await db.user.findUnique({
      where: { id: doctorID },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: "User not found" },
        { status: STATUS.notFound }
      );
    }

    await db.$transaction([
      db.doctor.delete({
        where: { id: doctorID },
      }),
      db.user.delete({
        where: { id: doctorID },
      }),
    ]);

    return NextResponse.json(
      { msg: "Doctor Successfully Removed" },
      { status: STATUS.ok }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({}, { status: STATUS.serverError });
  }
}
