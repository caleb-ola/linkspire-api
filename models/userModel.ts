import mongoose, { Query, Schema } from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface UserTypes extends mongoose.Document {
  name: string;
  email: string;
  username: string;
  bio: string;
  avatar: string;
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
  links: Array<{ type: Schema.Types.ObjectId; ref: "Link" }>;
  active: boolean;
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
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      max: [60, "Username cannot be more than 60 characters"],
      lower: true,
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
      max: [200, "Bio cannot be more than 200 characters"],
    },
    avatar: String,
    bannerImage: String,
    role: {
      type: String,
      enum: ["user", "admin"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    links: [{ type: Schema.Types.ObjectId, ref: "Link" }],
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
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
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
  this.find({ active: { $ne: false } });

  next();
});

// Input the slug once a user's name is registered
userSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
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

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Create verification token and update verification token expiry date
userSchema.methods.createVerificationToken = function () {
  const token = crypto.randomBytes(18).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.verificationTokenExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model<UserTypes>("User", userSchema);

export default User;
