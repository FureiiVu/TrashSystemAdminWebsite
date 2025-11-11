import mongoose from "mongoose";

const defaultItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pointToTrade: { type: Number, required: true, default: 100 },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const DefaultItem = mongoose.model("DefaultItem", defaultItemSchema);
export default DefaultItem;
