import { Router } from "express";
import { registerUser } from "../Controllers/User.Controllers.js";

const router = Router();

router.route("/register").post(registerUser)

export default router;
