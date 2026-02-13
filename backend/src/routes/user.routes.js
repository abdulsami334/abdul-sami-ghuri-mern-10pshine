import express from "express";
import auth from "../middleware/auth.middleware.js";
import { getMyProfile, updateProfile} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", auth, getMyProfile);
router.put("/profile", auth, updateProfile);


export default router;
