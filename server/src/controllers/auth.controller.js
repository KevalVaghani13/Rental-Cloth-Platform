const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const otpStore = new Map();


const OTP_EXPIRY_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 3;
const OTP_COOLDOWN_MINUTES = 1;


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    
    const existingOtp = otpStore.get(email);
    if (existingOtp && existingOtp.lastRequestAt) {
      const cooldownEnd = existingOtp.lastRequestAt + OTP_COOLDOWN_MINUTES * 60 * 1000;
      if (Date.now() < cooldownEnd) {
        const waitSeconds = Math.ceil((cooldownEnd - Date.now()) / 1000);
        return res.status(429).json({ 
          message: `Please wait ${waitSeconds} seconds before requesting a new OTP` 
        });
      }
    }

    
    const otp = generateOTP();
    
    
    otpStore.set(email, {
      otp,
      expiry: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
      attempts: 0,
      lastRequestAt: Date.now(),
    });

    
    
    console.log(`OTP for ${email}: ${otp}`);

    
    
    
    
    
    

    res.json({ 
      message: "OTP sent to your email address",
      
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
    }

    if (Date.now() > storedData.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    
    if (storedData.attempts >= OTP_MAX_ATTEMPTS) {
      otpStore.delete(email);
      return res.status(429).json({ message: "Too many failed attempts. Please request a new OTP." });
    }

    if (storedData.otp !== otp) {
      
      otpStore.set(email, {
        ...storedData,
        attempts: (storedData.attempts || 0) + 1,
      });
      const remainingAttempts = OTP_MAX_ATTEMPTS - (storedData.attempts + 1);
      return res.status(400).json({ 
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.` 
      });
    }

    
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    
    otpStore.set(email, {
      resetToken,
      resetTokenExpiry: Date.now() + 15 * 60 * 1000, 
    });

    res.json({ 
      message: "OTP verified successfully",
      resetToken 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const storedData = otpStore.get(email);
    
    if (!storedData || !storedData.resetToken) {
      return res.status(400).json({ message: "Invalid or expired reset request. Please start over." });
    }

    if (Date.now() > storedData.resetTokenExpiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: "Reset token has expired. Please start over." });
    }

    if (storedData.resetToken !== resetToken) {
      return res.status(400).json({ message: "Invalid reset token." });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    
    otpStore.delete(email);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
