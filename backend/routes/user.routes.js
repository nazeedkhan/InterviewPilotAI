import express, { Router } from "express";
import { logout, profile, signup } from "../controllers/user.controller.js";
import gettingUserIdFromToken from "../middlewares/gettingUserIDFromToken.js";
const userRoute = express(Router);

// User-routes here
userRoute.post("/signup", signup);
userRoute.get("/logout", logout);
userRoute.get("/profile", gettingUserIdFromToken, profile);

export default userRoute;
