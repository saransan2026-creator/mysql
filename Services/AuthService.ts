import  prisma  from "../Config/prisma";

export class Authservice {

 static async  checkEmailExist (email: string)  {
    return await prisma.user.findUnique({
      where: { email }
    });
  }
   static async insertUser (data: {
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
    
  static async findUser (email:string){
      return await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
      });
    }

   static async updateProfile (
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


   static async deleteUser(userId: number)  {
      await prisma.profile.delete({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
      return true;
    }
  };

   
  
