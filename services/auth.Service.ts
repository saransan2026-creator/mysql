import prisma from "../config/prisma";

export const Queries = {
   
  CHECK_EMAIL_EXISTS: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email }
    });
  },
    INSERT_USER: async (data: {
      email: string;
      password: string;
      name: string;
      phone: string;
      location: string;
    }) => {
      return await prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
          profile: {
            create: {
              name: data.name,
              phone: data.phone,
              location: data.location
            }
          }
        },
        include: { profile: true }
      });
    },
    
    FIND_UESER:async(email:string)=>{
      return await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
      });
    },

    UPDATE_PROFILE: async (
      userId: number,
      data: { name?: string; 
              phone?: string; 
              location?: string,
              email?:string 
            }
    ) => {
      return await prisma.profile.update({
        where: { userId },
        data
      });
    },


    DELETE_USER: async (userId: number) => {
      await prisma.profile.delete({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
      return true;
    }
  };
