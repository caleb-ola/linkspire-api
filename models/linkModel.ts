import mongoose, { Schema } from "mongoose";
import { URL } from "url";

interface LinkTypes extends mongoose.Document {
  title: string;
  url: string;
  user: { type: Schema.Types.ObjectId; ref: "User" };
  description: string;
}

const LinkSchema = new mongoose.Schema<LinkTypes>(
  {
    title: {
      type: String,
      max: [50, "Title cannot be more than 100 characters"],
    },
    url: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    description: {
      type: String,
      max: [200, "Description cannot be more than 200 characters"],
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
      transform(doc, rect) {
        rect.id = rect._id;
        delete rect.__v;
        delete rect._id;
      },
    },
  }
);

const Link = mongoose.model<LinkTypes>("Link", LinkSchema);

export default Link;
