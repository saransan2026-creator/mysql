import  prisma  from "../Config/prisma";

export class authService {

 static async  CHECK_EMAIL_EXISTS (email: string)  {
    return await prisma.user.findUnique({
      where: { email }
    });
  }
   static async INSERT_USER (data: {
      email: string;
      password: string;
      name: string;
      phone: string;
      location: string;
    })  {
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
    }
    
  static async FIND_UESER (email:string){
      return await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
      });
    }

   static async UPDATE_PROFILE (
      userId: number,
      data: { name?: string; 
              phone?: string; 
              location?: string,
              email?:string 
            }
    ) {
      return await prisma.profile.update({
        where: { userId },
        data
      });
    }


   static async DELETE_USER(userId: number)  {
      await prisma.profile.delete({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
      return true;
    }
  };

   
  
