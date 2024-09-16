import mongoose from "mongoose";
import { FBTI } from "../../lib/model/fbti";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json()
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  let fbti = new FBTI(payload);
  const result = await fbti.save();
  return NextResponse.json({ result, success: true });
}
