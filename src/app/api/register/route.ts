import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {

  try {

    const body = await req.json();


    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = body;



    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );

    }



    if (password !== confirmPassword) {

      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        {
          status: 400,
        }
      );

    }



    if (password.length < 8) {

      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );

    }



    const normalizedEmail =
      email.trim().toLowerCase();



    const existingUser =
      await prisma.user.findUnique({

        where: {
          email: normalizedEmail,
        },

      });



    if (existingUser) {

      return NextResponse.json(
        {
          success: false,
          message: "Account already exists.",
        },
        {
          status: 409,
        }
      );

    }



    const hashedPassword =
      await bcrypt.hash(password, 12);



    const user =
      await prisma.user.create({

        data: {

          firstName: firstName.trim(),

          lastName: lastName.trim(),

          email: normalizedEmail,

          password: hashedPassword,

          status: "ACTIVE",

        },

      });



    // Create default portfolios

    const mainPortfolio =
      await prisma.portfolio.create({

        data: {

          userId: user.id,

          name: "Main Portfolio",

          isDefault: true,

          isActive: true,

        },

      });



    await prisma.portfolio.createMany({

      data: [

        {

          userId: user.id,

          name: "Investment Portfolio",

          isDefault: false,

          isActive: true,

        },

        {

          userId: user.id,

          name: "Trading Portfolio",

          isDefault: false,

          isActive: true,

        },

      ],

    });



    return NextResponse.json(

      {

        success: true,

        message: "Registration successful.",

        user: {

          id: user.id,

          email: user.email,

        },

      },

      {

        status: 201,

      }

    );


  } catch(error) {


    console.error(
      "REGISTER ERROR:",
      error
    );


    return NextResponse.json(

      {

        success: false,

        message: "Registration failed.",

      },

      {

        status: 500,

      }

    );

  }

}