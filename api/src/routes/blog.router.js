import { Router } from "express";
const router = Router();
import BogController from "../controllers/blog.controller";

router.get("/", BogController.getAll);
router.post("/", BogController.create);
router.post("/encrypted-data", BogController.createEncryptedData);
router.get("/encrypted-data", BogController.getEncryptedData);

export default router;
