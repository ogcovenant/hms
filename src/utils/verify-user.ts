import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function verify (req: NextRequest){
  const cookies = req.cookies;
  const token = String(cookies.get("s:id")?.value);

  if(!token){
    throw new Error("Authentication failed")
  }

  try{
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
    return user;
  }catch(err){
    throw new Error("Authentication required")
  }
};

export default verify