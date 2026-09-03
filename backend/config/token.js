import jwt from "jsonwebtoken";

async function generateToken(userID) {
  try {
    const token = await jwt.sign({ userID:userID }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log("Token Error : ", error);
  }
}

export default generateToken;
