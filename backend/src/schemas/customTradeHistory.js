import mongoose from "mongoose";

const customTradeHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomItem",
      required: true,
    },
    quantity: { type: Number, required: true },
    prevPoint: { type: Number, required: true },
    remainPoint: { type: Number, required: true },
  },
  { timestamps: true }
);

const CustomTradeHistory = mongoose.model(
  "CustomTradeHistory",
  customTradeHistorySchema
);
export default CustomTradeHistory;
