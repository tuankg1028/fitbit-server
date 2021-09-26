import { Router } from "express";
import blogRouter from "./blog.router";
import { authUser } from "../middlewares/auth";
const router = Router();

/**
 * @swagger
 * /blogs:
 *   get:
 *     description: Get all Employee
 *     responses:
 *       200:
 *         description: Success
 *
 */
router.use(
  "/blogs",
  // [authUser],
  blogRouter
);

export default router;
