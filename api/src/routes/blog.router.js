import { Router } from "express";
const router = Router();
import BogController from "../controllers/blog.controller";

router.get("/", BogController.getAll);
router.post("/", BogController.create);

export default router;
