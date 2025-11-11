import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
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
    roleId: { type: Number, required: true },
  },
  { timestamps: true }
);

const GroupMember = mongoose.model("GroupMember", groupMemberSchema);
export default GroupMember;
