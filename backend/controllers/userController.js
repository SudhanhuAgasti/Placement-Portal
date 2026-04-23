import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  let { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }
  email = email.toLowerCase();
  let user = await User.findOne({ email });
  if (user) {
    if (user.isVerified) {
      return next(new ErrorHandler("Email already registered!", 400));
    }
    // If user exists but is not verified, update their information
    user.name = name;
    user.phone = phone;
    user.password = password;
    user.role = role;
  } else {
    // Create new user instance if they don't exist (don't save yet)
    user = new User({
      name,
      email,
      phone,
      password,
      role,
    });
  }

  const verificationToken = user.getVerificationToken();
  await user.save();

  console.log("-----------------------------------------");
  console.log(`VERIFICATION OTP FOR ${user.email} => ${verificationToken}`);
  console.log("-----------------------------------------");

  const message = `Your verification code is: ${verificationToken}. It will expire in 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Email Verification Code",
      message,
    });

    res.status(201).json({
      success: true,
      message: `Verification code sent to ${user.email}. Please verify your email to log in.`,
    });
  } catch (error) {
    // Note: We keep the user record and allow them to proceed to verify page
    // Users can find the OTP in the backend console during development
    res.status(201).json({
      success: true,
      message: "User registered! Email failed to send, but you can find your OTP in the backend terminal for now.",
    });
  }
});

export const verifyEmail = catchAsyncErrors(async (req, res, next) => {
  let { otp, email } = req.body;
  email = email.toLowerCase();

  if (!otp || !email) {
    return next(new ErrorHandler("Please provide OTP and Email!", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  if (user.verificationToken !== otp) {
    return next(new ErrorHandler("Invalid OTP!", 400));
  }

  if (user.verificationTokenExpire <= Date.now()) {
    return next(new ErrorHandler("OTP has expired!", 400));
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  sendToken(user, 200, res, "Email Verified Successfully! You can now log in.");
});

export const resendVerificationEmail = catchAsyncErrors(async (req, res, next) => {
  let { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please provide Email!", 400));
  }
  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  if (user.isVerified) {
    return next(new ErrorHandler("User is already verified!", 400));
  }

  const verificationToken = user.getVerificationToken();
  await user.save();

  console.log("-----------------------------------------");
  console.log(`NEW VERIFICATION OTP FOR ${user.email} => ${verificationToken}`);
  console.log("-----------------------------------------");

  const message = `Your new verification code is: ${verificationToken}. It will expire in 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "New Email Verification Code",
      message,
    });

    res.status(200).json({
      success: true,
      message: `A new verification code has been sent to ${user.email}.`,
    });
  } catch (error) {
    // During development, we allow the request to "succeed" so the user stays on the verify page,
    // since they can find the OTP in the backend terminal.
    res.status(200).json({
      success: true,
      message: "New code generated! Email failed to send, but you can find the new OTP in the backend terminal.",
    });
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  let { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password and role.", 400));
  }
  email = email.toLowerCase();
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }

  if (!user.isVerified) {
    return next(new ErrorHandler("Please verify your email to log in!", 400));
  }

  sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  let { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please provide Email!", 400));
  }
  email = email.toLowerCase();
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  const otp = user.getVerificationToken();
  await user.save();

  console.log("-----------------------------------------");
  console.log(`PASSWORD RESET OTP FOR ${user.email} => ${otp}`);
  console.log("-----------------------------------------");

  const message = `Your password reset code is: ${otp}. It will expire in 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Reset OTP sent to ${user.email}.`,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Reset code generated! Email failed to send, but you can find your OTP in the backend terminal.",
    });
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  let { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return next(new ErrorHandler("Please provide all fields!", 400));
  }
  email = email.toLowerCase();
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  if (user.verificationToken !== otp) {
    return next(new ErrorHandler("Invalid OTP!", 400));
  }

  if (user.verificationTokenExpire <= Date.now()) {
    return next(new ErrorHandler("OTP has expired!", 400));
  }

  user.password = newPassword;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful! You can now log in with your new password.",
  });
});