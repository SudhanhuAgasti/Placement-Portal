import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
    lowercase: true,
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Please enter your Phone Number!"],
    minLength: [10, "Phone number must be at least 10 digits!"],
    maxLength: [15, "Phone number cannot exceed 15 digits!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [6, "Password must contain at least 6 characters!"],
    maxLength: [100, "Password cannot exceed 100 characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["Job-Seeker","Employer"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


//ENCRYPTING THE PASSWORD WHEN THE USER REGISTERS OR MODIFIES HIS PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//COMPARING THE USER PASSWORD ENTERED BY USER WITH THE USER SAVED PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//GENERATING A JWT TOKEN WHEN A USER REGISTERS OR LOGINS, IT DEPENDS ON OUR CODE THAT WHEN DO WE NEED TO GENERATE THE JWT TOKEN WHEN THE USER LOGIN OR REGISTER OR FOR BOTH. 
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });
};

//GENERATING A VERIFICATION TOKEN
userSchema.methods.getVerificationToken = function () {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationToken = token;
  this.verificationTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return token;
};

export const User = mongoose.model("User", userSchema);
