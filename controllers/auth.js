import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadonCloudinary } from "../cdn/cloudinary.js";

export const register = async (req, res) => {
  try {
    // Extract user details from request body
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      location,
      occupation,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !location || !occupation) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user object
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      friends: [],
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // Handle profile picture upload if provided
    if (req.file) {
      try {
        console.log("Uploading file to Cloudinary...");
        
        if (!process.env.CLOUDINARY_CLOUD_NAME || 
            !process.env.CLOUDINARY_API_KEY || 
            !process.env.CLOUDINARY_API_SECRET) {
          console.error("Cloudinary credentials missing");
          return res.status(500).json({ error: "Image upload configuration missing" });
        }
        
        const uploadResult = await uploadonCloudinary(req.file.buffer);
        
        if (!uploadResult) {
          console.error("Upload result is null");
          return res.status(500).json({ error: "Failed to upload profile photo" });
        }
        
        console.log("Cloudinary upload successful:", uploadResult.secure_url);
        newUser.picturePath = uploadResult.secure_url;
        newUser.picturePathID = uploadResult.public_id;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ error: "Image upload failed: " + uploadError.message });
      }
    } else {
      // Set a default avatar if no picture was uploaded
      newUser.picturePath = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
    }
    
    // Save user to database
    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser._id);
    
    // Return success response
    res.status(201).json({
      success: true,
      user: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        picturePath: savedUser.picturePath,
        location: savedUser.location,
        occupation: savedUser.occupation
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message || "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Create user object without password
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picturePath: user.picturePath,
      friends: user.friends,
      location: user.location,
      occupation: user.occupation,
      viewedProfile: user.viewedProfile,
      impressions: user.impressions,
    };

    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Login failed" });
  }
};