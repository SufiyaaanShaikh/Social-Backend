import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadToCloudinary } from "../cdn/cloudinary.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user without image first
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

    // Handle image upload if file exists
    if (req.file) {
      try {
        // Using the updated Cloudinary function for buffer upload
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          req.file.mimetype
        );
        
        if (uploadResult) {
          newUser.picturePath = uploadResult.secure_url;
          newUser.picturePathID = uploadResult.public_id;
        } else {
          console.log("Image upload failed, continuing with default image");
        }
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        // Continue with user creation even if image upload fails
      }
    }

    const savedUser = await newUser.save();
    
    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Create a user object without the password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};