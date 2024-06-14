import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserDataBaseService {
  constructor() { }

  async listDBUsers() {
    try {
      return await prisma.user.findMany({
        select: {
          name: true,
          email: true,
          password: false
        }
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async insertDBUser(user: Prisma.UserCreateInput) {
    try {
      return await prisma.user.create({
        data: user,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateDBUser(user: Prisma.UserUpdateInput, id: number) {
    try {
      return await prisma.user.update({
        data: user,
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteDBUser(id: number) {
    try {
      await prisma.user.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUsuario(token: string) {
    try {
     return await prisma.user.findFirst({
        where: {
          tokenValidacao: token
        }
      })
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async signIn(loginUsuario: Prisma.UserWhereInput) {
    try {
        return await prisma.user.findFirst({
            where: {
                  email: loginUsuario.email
            }
        });

    } catch (error) {
        console.log(error);
        return null;
    }
}

}

export default new UserDataBaseService();
