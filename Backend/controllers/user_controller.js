// import { conv } from "../models/conversationModel.js";
// import { Message } from "../models/messageModel.js";
// import { USER } from "../models/user_module.js"
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { sendVerificationEmail } from "../utils/sendEmail.js";
// export const register = async (req, res) => {
//     try {

//         //const gender = user?.Gender?.toLowerCase() === "female" ? "female" : "male";

//         const { FullName, UserName, Password, ConfirmPassword, Gender, Email } = req.body;
//         if (!FullName || !UserName || !Password || !Gender) {
//             return res.status(400).json({ msg: "Please enter all fields" });
//         }
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(Email)) {
//             return res.status(400).json({ msg: "Invalid email format" });
//         }
//         if (Password != ConfirmPassword) {
//             return res.status(400).json({ msg: "enter correct password" });
//         }
//         const user = await USER.findOne({ $or: [{ UserName }, { Email }] });
//         if (user) {
//             return res.status(400).json({ msg: "User already exists" });
//         }
//         const hashedpass = await bcrypt.hash(Password, 10);
//         const avatarBase = "https://api.dicebear.com/8.x/avataaars/svg";

//         // Generate a random seed only if no profile photo exists
//         const randomSeed = `${user?.UserName || 'guest'}-${Math.floor(Math.random() * 10000)}`;
//         const malephotos = `${avatarBase}?seed=${randomSeed}&gender=male`
//         const fmalephotos = `${avatarBase}?seed=${randomSeed}&gender=female`
//         const token = jwt.sign({ email: Email }, process.env.secretkey, { expiresIn: '1h' });
//         await USER.create({
//             FullName,
//             UserName,
//             Email,
//             Password: hashedpass,
//             Gender: Gender,
//             ProfilePhoto: Gender == "Male" ? malephotos : fmalephotos,
//             isVerified: false,

//         });
//         const emailToken = jwt.sign(
//             { email: Email },
//             process.env.secretkey,
//             { expiresIn: "1d" }
//         );
//         if (existingUser) {
//             return res.status(400).json({ msg: "User already exists" });
//         }
//         await sendVerificationEmail(Email, emailToken);

//         return res.status(200).json({ msg: "User registered. Please check your email to verify.", success: true });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ msg: "Server error" });
//     }
// };
// //         return res.status(200).json({ msg: "User created successfully", success: true });
// //     } catch (error) {
// //         console.error(error);
// //     }


// // }
// export const login = async (req, res) => {
//     try {
//         console.log("📨 Request from:", req.headers.origin);
//         console.log("🍪 Cookies received:", req.cookies);

//         const { UserName, Password } = req.body;
//         if (!UserName || !Password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }
//         const user = await USER.findOne({ UserName });
//         if (!user) {
//             return res.status(400).json({ message: "User not found", success: false });
//         }
//         const isMatch = await bcrypt.compare(Password, user.Password);
//         if (!isMatch) {
//             return res.status(400).json({
//                 message: "Invalid credentials",
//                 success: false
//             });
//         }
//         const tokendata = { userid: user._id }
//         const token = jwt.sign(tokendata, process.env.secretkey, { expiresIn: '1d' });

//         return res.status(200).cookie("token", token, {
//             maxAge: 1 * 24 * 60 * 60 * 1000,
//             httpOnly: true,
//             sameSite: 'strict',
//             secure: true
//         })
//             .json({
//                 message: "user logged in succesfully",
//                 _id: user._id,
//                 UserName: user.UserName,
//                 fullName: user.FullName,
//                 ProfilePhoto: user.ProfilePhoto
//             });
//     }
//     catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }
// export const logout = async (req, res) => {
//     try {
//         return res.status(200).cookie("token", "", { maxAge: 0 }).json({
//             message: "logged out successfully"
//         })
//     }
//     catch (error) {
//         console.log(error);

//     }
// }
// export const getuser = async (req, res) => {
//     try {
//         const loggedinid = req.id;
//         const otheruser = await USER.find({ _id: { $ne: loggedinid } }).select("-Password");
//         return res.status(200).json(otheruser)
//             ;
//     } catch (error) {
//         console.log(error);
//     }
// }
import { USER } from "../models/user_module.js";
import { OtpModel } from "../models/OtpModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

// ✅ Send OTP to user's email
export const sendOtp = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) return res.status(400).json({ msg: "Email is required" });

    const existingUser = await USER.findOne({ Email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.create({ email: Email, otp });

    await sendOtpEmail(Email, otp);

    res.status(200).json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

// ✅ Verify OTP and register user
export const register = async (req, res) => {
  try {
    const { FullName, UserName, Email, Password, ConfirmPassword, Gender, otp } = req.body;

    if (!FullName || !UserName || !Email || !Password || !ConfirmPassword || !Gender || !otp) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) return res.status(400).json({ msg: "Invalid email format" });

    if (Password !== ConfirmPassword) return res.status(400).json({ msg: "Passwords do not match" });

    const otpRecord = await OtpModel.findOne({ email: Email }).sort({ createdAt: -1 });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const existingUser = await USER.findOne({ $or: [{ UserName }, { Email }] });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedpass = await bcrypt.hash(Password, 10);
    const avatarBase = "https://api.dicebear.com/8.x/avataaars/svg";
    const seed = `${UserName}-${Math.floor(Math.random() * 10000)}`;
    const profilePhoto = `${avatarBase}?seed=${seed}&gender=${Gender.toLowerCase()}`;

    await USER.create({
      FullName,
      UserName,
      Email,
      Password: hashedpass,
      Gender,
      ProfilePhoto: profilePhoto,
      isVerified: true,
    });

    await OtpModel.deleteMany({ email: Email }); // Clean OTPs

    res.status(201).json({ msg: "User registered successfully", success: true });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Login User
export const login = async (req, res) => {
  try {
    const { UserName, Password } = req.body;
    if (!UserName || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await USER.findOne({ UserName });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const tokendata = { userid: user._id };
    const token = jwt.sign(tokendata, process.env.secretkey, { expiresIn: '1d' });

    return res.status(200).cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    }).json({
      message: "User logged in successfully",
      _id: user._id,
      UserName: user.UserName,
      fullName: user.FullName,
      ProfilePhoto: user.ProfilePhoto
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Logout
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.log("Logout Error:", error);
  }
};

// ✅ Get Other Users
export const getuser = async (req, res) => {
  try {
    const loggedinid = req.id;
    const otheruser = await USER.find({ _id: { $ne: loggedinid } }).select("-Password");
    return res.status(200).json(otheruser);
  } catch (error) {
    console.log("Get Users Error:", error);
  }
};
