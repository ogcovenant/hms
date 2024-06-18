import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import db from "@/config/dbconfig";
import STATUS from "@/config/statusConfig";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { err: "User with email already exists" },
        { status: STATUS.conflict }
      );
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json({}, { status: STATUS.serverError });
  }

  const newUser = {
    id: uuid(),
    email: email,
    password: await bcrypt.hash(String(password), 12),
    userCategory: "admin",
  };

  const jwtPayload = {
    id: newUser.id,
    email: newUser.email,
  };

  try {
    await db.user.create({
      data: newUser,
    });

    const token = jwt.sign(
      jwtPayload,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    const response = NextResponse.json(
      { msg: "User Created Successfully" },
      { status: STATUS.created }
    );

    const date = new Date();
    date.setDate(date.getDate() + 30);

    response.cookies.set("s:id", token, {
      expires: date,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return response
  } catch (err) {
    console.log(err)
    return NextResponse.json({}, { status: STATUS.serverError });
  }
}
