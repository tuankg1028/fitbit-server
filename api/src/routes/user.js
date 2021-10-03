import { Router } from "express";
const router = Router();
import UserController from "../controllers/user";

// router.get("/", UserController.getAll);
// router.put("/", UserController.create);
router.get("/profiles/:email", UserController.getProfile);

export default router;
