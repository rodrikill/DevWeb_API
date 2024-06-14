import { Request, Response } from "express";
import PostService from "../services/PostService";
import UserDataBaseService from "../services/UserDataBaseService";


class PostController {
    constructor() { }

    async insertarPost(req: Request, res: Response) {
        const body = req.body;

        if (!body.title || !body.content) {
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

                const novoPost = await PostService.insertarPost({
                    title: body.title,
                    content: body.content,
                    author: {
                        connect: { id: usuario.id },
                    },
                    published: false,
                });
                return res.json({
                    status: "OK",
                    message: novoPost,
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


    async deletarPost(req: Request, res: Response) {
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

                const resposta = await PostService.deletarPost(parseInt(id));
                if (resposta) {
                    return res.json({
                        status: "OK",
                        message: "Post deletado com sucesso",
                    });
                }
                else {
                    return res.json({
                        status: "error",
                        message: "Post não encontrado.",
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
    async atualizarPost(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            return res.json({
                status: "error",
                message: "Faltou o ID",
            });
        }

        const body = req.body;

        if (!body.content || !body.title) {
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

                const post = await PostService.atualizarPost(
                    {
                        content: body.content,
                        title: body.title,
                    },
                    parseInt(id)
                );

                return res.json({
                    status: "OK",
                    message: post,
                });
            }
            else {
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
    async listarTodosPosts(req: Request, res: Response) {

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
                const posts = await PostService.listarPosts();

                return res.json({
                  status: "OK",
                  message: posts,
                });
              }
              else {
                return res.json({
                  status: "error",
                  message: 'Token inválido. Para receber um novo token, faça o singin!',
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

export default new PostController();