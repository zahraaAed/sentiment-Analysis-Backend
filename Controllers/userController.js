import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import sendgrid from '@sendgrid/mail'
import mongoose from "mongoose";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export const userRegister = async (req, res) => {
  const { username, password, role, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Here we hash the passsword

  try {
    // Here we check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already in use!" });
    }

    // Here we register the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' });


    // res.status(200).json({status:200, message:'User signed up successfully', token:token})

    await sendgrid.send({
        to:`${email}`,
        from:'zahraaalaaeddine94@gmail.com',
        subject:'Email Verification',
        html:`
        <p>Hi there,</p>

        <p>Thank you for signing up for Tonify. Click on the link below to verify your email:</p>
        
       <a href='http://localhost:4000/verify-email/?token=${token}'>verify your email</a> 
        
        <p>This link will expire in 24 hours. If you did not sign up for Tonify account,
        you can safely ignore this email.</p>
        
       <p> Best,</p>
        
        <p>Tonify Team</p>
        `
    });

    res.status(201).json({ message: "user created successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyEmail = async(req,res,next) =>{
  const {token} = req.query

  try {
      if(!token){
          return res.status(400).json({status:400, message:"Invalid token!"})
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const userId=  decoded._id

      const user= await User
      .findById(userId)

      if(!user){
          return res.status(400).json({status:404, message:'User not found'})
      }

      user.isVerified = true

      await user.save()

      res.status(200).json({status:200, message:'Email was verified successfully!'})
      
  } catch (err) {
      next(err)
  }

}


export const userLogin = async (req, res) => {
  const { username, password } = req.body;
  const secretKey = process.env.JWT_SECRET;

  try {
    if (!secretKey) {
      throw new Error("JWT secret key not configured.");
    }
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password!" });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.SECRET_KEY || "default_secret",
      { expiresIn: "1h" }
    );

    console.log("Login successful");

    res.status(200).json({
      username: user.username,
      role: user.role,
      accessToken: token,
    });
  } catch (err) {
    console.error("Error during user login:", err.message);
    res.status(500).send("Sign in error");
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "user not found!" });
    }

    const user = await User.findById(id).populate("feedbacks").populate("rooms").populate("messages").populate("text_Submissions");
    // const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "user not found!" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("feedbacks").populate("rooms").populate("messages").populate("text_Submissions");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};
