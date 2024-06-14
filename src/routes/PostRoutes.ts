import { Router } from "express";
import PostController from "../controllers/PostController";

const PostRouter = Router();

PostRouter.post("/postService", PostController.insertarPost);

PostRouter.patch("/postService/:id", PostController.atualizarPost);

PostRouter.delete("/postService/:id", PostController.deletarPost);

PostRouter.get("/postService", PostController.listarTodosPosts);

export default PostRouter;
