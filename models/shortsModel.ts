import mongoose from "mongoose";

interface ShortTypes extends mongoose.Document {
  destination: string;
  shortUrl: string;
  title: string;
  addToLinks: boolean;
  clicks: number;
  successfulRedirects: number;
  user: { type: mongoose.Schema.Types.ObjectId; ref: "User" };
}

const ShortSchema = new mongoose.Schema<ShortTypes>(
  {
    destination: {
      type: String,
      required: [true, "Destination is required"],
    },
    shortUrl: String,
    title: {
      type: String,
      max: [40, "Title cannot be more than 40 characters"],
    },
    addToLinks: {
      type: Boolean,
      default: false,
    },
    clicks: Number,
    successfulRedirects: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(doc, rect) {
        rect.id = rect._id;
        delete rect._id;
        delete rect.__v;
      },
    },
  }
);

const Short = mongoose.model<ShortTypes>("Short", ShortSchema);

export default Short;
