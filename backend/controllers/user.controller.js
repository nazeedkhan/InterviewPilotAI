import generateToken from "../config/token.js";
import userModel from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(name);
    console.log(email);
    let user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      console.log("first");
      try {
        user = await userModel.create({ name, email });
      } catch (error) {
        console.log("create par error: ", error);
      }
      console.log("second", user);
    }
    // Token aa gaya , sending it to cookie
    const token = await generateToken(user._id);
    // console.log("token", token);
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({ message: "User Created Successfully", user });
  } catch (error) {
    return res.status(500).json({ "Server Error : ": error });
  }
};

export const logout = async (req, res) => {
  try {
    await res.clearCookie("auth_token");
    return res.status(200).json({ message: "Logout Successfully!" });
  } catch (error) {
    return res.status(500).json({ "Logout Error : ": error });
  }
};

export const profile = async (req, res) => {
  try {
    const userID = req.userID;
    const currentUser = await userModel.findById(userID);
    if (!currentUser) {
      return res.status(404).json({ Message: "User not Found..." });
    }
    return res.status(200).json(currentUser);
  } catch (error) {
    return res.status(500).json({ "Profile Error ": error });
  }
};
