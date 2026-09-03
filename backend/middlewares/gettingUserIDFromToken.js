import jwt from "jsonwebtoken";

async function gettingUserIdFromToken(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res
        .status(400)
        .json({ Message: "No token available! Please Sign-in again." });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    //aage chalkekisi bhi controller me agar user chahiye ho to model me findbyId me req.userID hi likhna 
    req.userID = decoded.userID;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}

export default gettingUserIdFromToken;
