const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/UserModel");
const Otp = require("../models/OtpModel");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    res.status(201).json({ 
      message: "User registered successfully!", 
      user: { email: newUser.email, username: newUser.username }
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};


// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "👤 User does not exist!" });
    }

    // Compare passwords
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.json({ message: "Invalid credentials!" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, userId: user._id, user: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// OTP Generate Process
const otpGenerate = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User does not exist!" });
    }

    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any existing OTP for the user
    await Otp.deleteMany({ user: user._id });

    // Save new OTP in database
    await Otp.create({ user: user._id, otp: generatedOtp });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${generatedOtp}. It is valid for 10 minutes.`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email. Try again." });
      }
      res.json({ message: "OTP sent to your email!" });
    });

  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ message: "Server error. Try again." });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User does not exist!" });
    }

    // Find OTP entry
    const otpEntry = await Otp.findOne({ user: user._id, otp }).sort({ createdAt: -1 });
    if (!otpEntry) {
      return res.json({ message: "Invalid or expired OTP!" });
    }
    if (!otpEntry) {
      return res.json({ message: "Invalid or expired OTP!" });
    }

    res.json({ message: "OTP verified successfully!"});

  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error. Try again." });
  }
};



// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "👤 User does not exist!" });
    }

    // Find OTP entry
    const otpEntry = await Otp.findOne({ user: user._id, otp });
    if (!otpEntry) {
      return res.json({ message: "⚠️ Invalid or expired OTP!" });
    }
    module.exports = { registerUser, loginUser, otpGenerate, verifyOtp, resetPassword };
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and remove OTP entry
    user.password = hashedPassword;
    await user.save();
    await Otp.deleteMany({ user: user._id });

    res.json({ message: "Password reset successfully!", color: "green" });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error. Try again." });
  }
};


module.exports = { registerUser, loginUser, otpGenerate, resetPassword, verifyOtp };
