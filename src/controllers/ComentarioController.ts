import { Request, Response } from "express";
import ComentarioService from "../services/ComentarioService";
import UserDataBaseService from "../services/UserDataBaseService";


class ComentarioControllerController {
    constructor() { }

    async insertarComentario(req: Request, res: Response) {
        const body = req.body;

        if(!body.id){
            return res.json({
                status: "error",
                message: "Faltou o Id do post.",
            });
        }

        if (!body.mensagem) {
            return res.json({
                status: "error",
                message: "Falta parâmetros",
            });
        }

        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.json({
                    status: "error",
                    message: "É necessário fornecer o token. Para receber um novo token, faça o singin!",
                });
            }
            const usuario = await UserDataBaseService.getUsuario(token);

            if (usuario) {

                const novoComentario = await ComentarioService.insertarComentario({
                    mensagem: body.mensagem,
                    author: {
                        connect: { id: usuario.id },
                    },
                    post: {
                        connect: { id: body.id}
                    }
                });

                return res.json({
                    status: "OK",
                    message: novoComentario,
                });
            }
            else {
                return res.json({
                    status: "error",
                    message: "Token inválido. Para receber um novo token, faça o singin!",
                });
            }
        } catch (error) {
            return res.json({
                status: "error",
                message: error,
            });
        }
    }
    async atualizarComentario(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            return res.json({
                status: "error",
                message: "Faltou o ID",
            });
        }

        const body = req.body;

        if (!body.mensagem) {
            return res.json({
                status: "error",
                message: "Falta parâmetros",
            });
        }

        try {

            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.json({
                    status: "error",
                    message: "É necessário fornecer o token. Para receber um novo token, faça o singin!",
                });
            }

            const usuario = await UserDataBaseService.getUsuario(token);

            if (usuario) {
                const atualizarComentario = await ComentarioService.atualizarComentario(
                    {
                        mensagem: body.mensagem
                    },
                    parseInt(id)
                );

                return res.json({
                    status: "OK",
                    message: atualizarComentario,
                });
            } else {
                return res.json({
                    status: "error",
                    message: "Token inválido. Para receber um novo token, faça o singin!",
                });
            }

        }
        catch (error) {
            return res.json({
                status: "error",
                message: error,
            });
        }
    }
    
    async deletarComentario(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            return res.json({
                status: "error",
                message: "Faltou o ID",
            });
        }

        try {

            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.json({
                    status: "error",
                    message: "É necessário fornecer o token. Para receber um novo token, faça o singin!",
                });
            }
            const usuario = await UserDataBaseService.getUsuario(token);
            if (usuario) {

                const resposta = await ComentarioService.deletarComentario(parseInt(id));
                if (resposta) {
                    return res.json({
                        status: "OK",
                        message: "Comentário deletado com sucesso",
                    });
                }
                else{
                    return res.json({
                        status: "error",
                        message: "Comentário não encontrado",
                    });
                }
            }
            else {
                return res.json({
                    status: "error",
                    message: "Token inválido. Para receber um novo token, faça o singin!",
                });
            }
        } catch (error) {
            console.log(error);
            return res.json({
                status: "error",
                message: error,
            });
        }
    }
    async listarComentario(req: Request, res: Response) {

        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.json({
                    status: "error",
                    message: "É necessário fornecer o token. Para receber um novo token, faça o singin!",
                });
            }
            const usuario = await UserDataBaseService.getUsuario(token);

            if (usuario) {

                const comentarios = await ComentarioService.listarComentarios();

                return res.json({
                    status: "OK",
                    message: comentarios,
                  });
            }
            else {
                return res.json({
                    status: "error",
                    message: "Token inválido. Para receber um novo token, faça o singin!",
                });
            }

        } catch (error) {
            return res.json({
                status: "error",
                message: error,
            });
        }
    }
}

export default new ComentarioControllerController();