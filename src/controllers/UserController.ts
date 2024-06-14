import { Request, Response } from "express";
import UserDataBaseService from "../services/UserDataBaseService";
import { validateHash } from "../utils/BcryptUtils";
import { generateHash } from "../utils/BcryptUtils";
import jwt from 'jsonwebtoken';

class UserController {
  constructor() { }

  async cadastrarUsuario(req: Request, res: Response) {
    const body = req.body;

    if (!body.email || !body.name || !body.password) {
      return res.json({
        status: "error",
        message: "Falta parâmetros",
      });
    }

    const hashPassword = await generateHash(body.password);

    if (!hashPassword) {
      return res.json({
        status: "error",
        message: "Erro ao criptografar senha ...",
      });
    }

    try {
      const novoUsuario = await UserDataBaseService.insertDBUser({
        name: body.name,
        email: body.email,
        password: hashPassword as string,
        tokenValidacao: null
      });
      return res.json({
        status: "OK",
        message: `Id: ${novoUsuario?.id}, Email: ${novoUsuario?.email}, Nome: ${novoUsuario?.name}`
      });

    } catch (error) {
      return res.json({
        status: "error",
        message: error,
      });
    }
  }
  async signIn(req: Request, res: Response) {
    const body = req.body;

    if (!body.email || !body.password) {
        return res.json({
            status: "error",
            message: "Falta parâmetros",
        });
    }

    try {
        const usuario = await UserDataBaseService.signIn({
            email: body.email
        });

        if (!usuario) {
            return res.json({
                status: "error",
                message: "Usuário não encontrado",
            });
        }

        const isPasswordValid = await validateHash(body.password, usuario.password);
        
        if (!isPasswordValid) {
            return res.json({
                status: "error",
                message: "Senha incorreta",
            });
        }
        const token = jwt.sign({ userId: 0 }, "token", {

        });

        await UserDataBaseService.updateDBUser(
          {
            tokenValidacao: token
          },
          usuario.id
        );

        return res.json({
            status: "OK",
            Token_Acesso: token,
        });
    } catch (error) {
        return res.json({
            status: "error",
            message: error,
        });
    }
}

  async atualizarUsuario(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.json({
        status: "error",
        message: "Faltou o ID",
      });
    }

    const { name, email, password } = req.body;

    if (!email || !name) {
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

        const usuarioAtt = await UserDataBaseService.updateDBUser(
          {
            name: name,
            email: email,
            password: password
          },
          parseInt(id)
        );
        return res.json({
          status: "OK",
          message: `Id: ${usuarioAtt?.id}, Email: ${usuarioAtt?.email}, Nome: ${usuarioAtt?.name}`,
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

  async deletarUsuario(req: Request, res: Response) {
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

        const resposta = await UserDataBaseService.deleteDBUser(parseInt(id));

        if (resposta) {
          return res.json({
            status: "OK",
            message: "Usuário deletado com sucesso",
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

  async listarTodosUsuarios(req: Request, res: Response) {
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
        const usuarios = await UserDataBaseService.listDBUsers();
        if(usuarios && usuarios?.length > 0){
          return res.json({
            status: "OK",
            message: usuarios,
          });
        }
        else{
          return res.json({
            status: "OK",
            message: "Não foi encontrado nenhum usuário!",
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

}

export default new UserController();
