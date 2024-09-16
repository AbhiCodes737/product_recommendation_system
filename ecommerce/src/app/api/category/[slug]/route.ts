import mongoose from "mongoose";
import {Product} from "../../../lib/model/product"
import { NextRequest, NextResponse } from "next/server";

interface Slug{
    slug: string;
}

export async function GET(req:NextRequest, {params}: {params: Slug}){
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    const data = await Product.find({'category': params.slug});
    return NextResponse.json(data)
}