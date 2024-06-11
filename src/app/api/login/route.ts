import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
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

    if (!existingUser) {
      return NextResponse.json(
        { err: "There is no user with this email" },
        { status: STATUS.notFound }
      );
    }

    const match = await bcrypt.compare(String(password), existingUser.password);

    if (!match) {
      return NextResponse.json(
        { err: "Either email or password is incorrect" },
        { status: STATUS.notAcceptable }
      );
    }

    const jwtPayload = {
      id: existingUser.id,
      email: existingUser.email,
    };

    const token = jwt.sign(
      jwtPayload,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    const response = NextResponse.json(
      { msg: "Login Successful" },
      { status: STATUS.ok }
    );

    const date = new Date();
    date.setDate(date.getDate() + 30);

    response.cookies.set("s:id", token, {
      expires: date,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return response;
  } catch (err) {
    console.log(err);
    return NextResponse.json({}, { status: STATUS.serverError });
  }
}
