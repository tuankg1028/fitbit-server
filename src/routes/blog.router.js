import { Router } from "express";
const router = Router();
import BogController from "../controllers/blog.controller";
/**
 * @openapi
 * /api/blogs:
 *  get:
 *      description: Use this api to get list of blogs
 *      tags:
 *          - blog
 *      responses:
 *          200:
 *              description: Returns a list of blogs.
 */

router.get("/", BogController.list);

/**
 * @openapi
 * /api/blogs:
 *  post:
 *      description: Use this api to create blog
 *      tags:
 *          - blog
 *      requestBody:
 *          description: Optional description in *Markdown*
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              required: true
 *                              type: string
 *                              example: Blog 1
 *
 *      responses:
 *          200:
 *              description: Returns new blog.
 *          400:
 *              description: Data inputed is invalid
 *          500:
 *              description: Server error
 */
router.post("/", BogController.create);

export default router;
