import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";



async function handler(
  request: Request,
  context: any
) {


  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "Unknown";



  const userAgent =
    request.headers.get("user-agent") ||
    "Unknown";



  return NextAuth({

    ...authOptions,


    callbacks: {

      ...authOptions.callbacks,


      async signIn({

        user,

      }) {


        try {


          const prisma =
            (await import("@/lib/prisma"))
              .default;



          await prisma.loginHistory.create({

            data: {

              userId:
                user.id as string,


              ipAddress,


              userAgent,


              success:
                true,

            },

          });



        } catch(error) {


          console.error(
            "Login history capture error:",
            error
          );


        }



        if (
          authOptions.callbacks?.signIn
        ) {

          return authOptions.callbacks.signIn({

            user,

            account: null,

            profile: null,

            email: undefined,

            credentials: undefined,

          } as any);

        }



        return true;

      },


    },


  })(request, context);


}



export {

  handler as GET,

  handler as POST,

};