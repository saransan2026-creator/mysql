import { Router } from "express";
import Authcontrol from "../Controllers/Authcontrol";
import { validateAuth } from "../middlewares/validate";

const router = Router();

router.post("/register",validateAuth, Authcontrol.register);
router.post("/login",validateAuth, Authcontrol.login);

export default router;

