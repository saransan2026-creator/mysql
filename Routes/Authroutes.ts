import { Router } from "express";
import Authcontrol from "../Controllers/Authcontrol";
import { RegisterSchema,LoginSchema } from "../Utils/Schema";


const router = Router();

router.post("/register", Authcontrol.register);
router.post("/login", Authcontrol.login);
router.put("/profile/:userId", Authcontrol.updateProfile);
router.delete("/user/:userId", Authcontrol.deleteUser);

export default router;
    
