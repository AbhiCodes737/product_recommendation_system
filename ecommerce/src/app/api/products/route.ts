import mongoose from "mongoose";
import {Product} from "../../lib/model/product"
import { NextResponse } from "next/server";

 export async function GET(){
   await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
   const data = await Product.find();
   return NextResponse.json(data)
 }