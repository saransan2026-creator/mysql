import { Router } from "express";
import { Authcontrol } from "../Controllers/Authcontrol.ts";

const router = Router();

router.post("/register", Authcontrol.register);
router.post("/login", Authcontrol.login);

export default router;
