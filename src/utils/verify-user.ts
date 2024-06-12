import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";


interface UserPayload {
  id: string;
  email: string;
}

export async function verify(req: NextRequest): Promise<UserPayload> {
  const token = req.cookies.get("s:id")?.value;

  if (!token) {
    throw new Error("Authentication failed");
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as UserPayload;
    return user;
  } catch (err) {
    throw new Error("Authentication required");
  }
}

export default verify;
