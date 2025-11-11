import mongoose from "mongoose";

const customItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pointToTrade: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
  },
  { timestamps: true }
);

const CustomItem = mongoose.model("CustomItem", customItemSchema);
export default CustomItem;
