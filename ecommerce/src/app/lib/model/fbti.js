import mongoose from "mongoose";

const fbtiModel = new mongoose.Schema(
  {
    cartItems: [String],
  },
  { versionKey: false }
);

export const FBTI = mongoose.models.fbti || mongoose.model("fbti", fbtiModel);
