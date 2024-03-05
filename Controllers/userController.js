import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import mongoose from "mongoose";

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


    res.status(201).json({ message: "user created successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// export const userLogin = async (req, res) => {
//   const { username, password } = req.body;
//   const secretKey = process.env.JWT_SECRET;

//   try {
//     if (!secretKey) {
//       throw new Error("JWT secret key not configured.");
//     }
//     const user = await User.findOne({ username });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ error: "Invalid username or password!" });
//     }

//     const token = jwt.sign(
//       { username: user.username, role: user.role },
//       process.env.SECRET_KEY || "default_secret",
//       { expiresIn: "1h" }
//     );

//     console.log("Login successful");

//     res.status(200).json({
//       username: user.username,
//       role: user.role,
//       accessToken: token,
//     });
//   } catch (err) {
//     console.error("Error during user login:", err.message);
//     res.status(500).send("Sign in error");
//   }
// };

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

//login
export const userLogin = async (req, res) => {
  const { username, password } = req.body;
  const secretKey = process.env.JWT_SECRET;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password!' });
    }

    const token = jwt.sign({ user: user.id }, secretKey, { expiresIn: '1h' });
  

    
    // Set the JWT token in the cookie
    res.cookie('jwt', token, { httpOnly: true,secure:true, maxAge: 3600000 });
    
    // Set the user's role in the cookie
    res.cookie('userrole', user.role, { httpOnly: false ,secure:true});

    // Set the user's ID in the cookie
    res.cookie("userId", user.id, { httpOnly: false,secure:true });

    res.status(200).json({ message: 'Logged in successfully!', user: user.id, token});
console.log("logged in successfully")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
