import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  // virtual attribute
  age: number;
}

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: [true, "ID is required."] },
    name: { type: String, required: [true, "Name is required."] },
    email: {
      type: String,
      requied: [true, "Email is required."],
      unique: [true, "Email already exists."],
      validate: validator.default.isEmail,
    },
    photo: { type: String, required: [true, "Photo is required"] },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required."],
    },
    dob: { type: Date, required: [true, "DOB is required."] },
  },
  { timestamps: true }
);

userSchema.virtual("age").get(function () {
  const dob = new Date();
  const today = this.dob;

  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
