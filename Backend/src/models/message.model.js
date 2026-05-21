import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Ai", "user"],
  },
}, {
  timestamps: true,
});

messageSchema.set("toJSON", { virtuals: true });
messageSchema.set("toObject", { virtuals: true });
messageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;
