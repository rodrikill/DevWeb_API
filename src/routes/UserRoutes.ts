import { Router } from "express";
import UserController from "../controllers/UserController";

const UserRouter = Router();

UserRouter.post("/UserDataBaseService", UserController.cadastrarUsuario);

UserRouter.patch("/UserDataBaseService/:id", UserController.atualizarUsuario);

UserRouter.delete("/UserDataBaseService/:id", UserController.deletarUsuario);

UserRouter.get("/UserDataBaseService", UserController.listarTodosUsuarios);

UserRouter.post("/UserDataBaseService/signIn", UserController.signIn);

export default UserRouter;
