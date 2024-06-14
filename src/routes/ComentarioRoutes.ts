import { Router } from "express";
import ComentarioController from "../controllers/ComentarioController";

const ComentarioRouter = Router();

ComentarioRouter.post("/comentarioService", ComentarioController.insertarComentario);

ComentarioRouter.patch("/comentarioService/:id", ComentarioController.atualizarComentario);

ComentarioRouter.delete("/comentarioService/:id", ComentarioController.deletarComentario);

ComentarioRouter.get("/comentarioService", ComentarioController.listarComentario);

export default ComentarioRouter;