import { Router } from "express";
import {
  changePassword,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
} from "../Controllers/User.Controllers.js";
import upload from "../Middlewares/Multer.Middlewares.js";
import { verifyJWT } from "../Controllers/Auth.Controllers.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secure route
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changePassword);

export default router;
