import mongoose, { Query } from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface UserTypes extends mongoose.Document {
  name: string;
  email: string;
  bio: string;
  image: string;
  bannerImage: string;
  role: string;
  gender: string;
  slug: string;
  lastLogin: string;
  password: string;
  passwordChangedAt: string | number;
  passwordResetToken: string | undefined;
  passwordResetExpires: string | undefined;
  isVerified: boolean;
  isActive: boolean;
  verificationToken: string | undefined;
  verificationTokenExpires: string | undefined;
  checkPassword: (
    inputPassword: string,
    userPassword: string
  ) => Promise<boolean>; // The type has to be specified in this format because the method is a promise
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
  createVerificationToken(): string;
}

const userSchema = new mongoose.Schema<UserTypes>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      max: [60, "Name cannot be more than 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lower: true,
      unique: true,
      validate: [validator.isEmail, "Input must be an email"],
    },
    bio: {
      type: String,
    },
    image: String,
    bannerImage: String,
    role: {
      type: String,
      enum: ["user", "admin"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    slug: String,
    lastLogin: Date,
    password: {
      type: String,
      min: [5, "Password cannot be less than 5 characters"],
      required: [true, "Password is required"],
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
      type: Boolean,
      default: false,
      select: false,
    },
    isVerified: {
      type: Boolean,
      select: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
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

// Only return users that are active
userSchema.pre(/^find/, function (this: Query<UserTypes[], UserTypes>, next) {
  this.find({ isActive: { $ne: false } });

  next();
});

// Input the slug once a user's name is registered
userSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Update the slug once a user changes their name
userSchema.pre("findOneAndUpdate", function (next) {
  // Accessing the update object
  const update: any = this.getUpdate();

  if (update?.name) {
    update.slug = slugify(update.name, { lower: true });
  }

  next();
});

// Check if user's password and Input password are the same
userSchema.methods.checkPassword = async function (
  inputPassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, userPassword);
};

// Check if use changed password after token was issued
userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime(), 10);

    return JWTTimestamp < changedTimeStamp / 1000;
  }
  return false;
};

// Create password reset token and update reset token expiry date
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordRestToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() * 10 * 60 * 1000;
};

// Create verification token and update verification token expiry date
userSchema.methods.createVerificationToken = function () {
  const token = crypto.randomBytes(18).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.verificationTokenExpires = Date.now() * 10 * 60 * 1000;
};

const User = mongoose.model<UserTypes>("User", userSchema);

export default User;
