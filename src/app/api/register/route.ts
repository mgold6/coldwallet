import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

import { walletGeneratorService } from "@/server/blockchain/wallet-generator.service";


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
        { status: 400 }
      );
    }


    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }


    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters.",
        },
        { status: 400 }
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
          message: "An account with this email already exists.",
        },
        { status: 409 }
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



    const portfolio =
      await prisma.portfolio.create({
        data: {
          name: "Main Portfolio",
          userId: user.id,
        },
      });



    const currencies =
      await prisma.currency.findMany({
        where: {
          code: {
            in: [
              "BTC",
              "ETH",
              "SOL",
              "XRP",
            ],
          },
        },
        include: {
          networks: true,
        },
      });



    for (const currency of currencies) {

      const network =
        currency.networks[0];


      if (!network) {
        continue;
      }


      const generated =
        await walletGeneratorService.generate(
          currency.code
        );


      await prisma.wallet.create({
        data: {
          address: generated.address,

          label:
            `${currency.code} Wallet`,

          balance: 0,

          availableBalance: 0,

          blockchainBalance: 0,

          internalBalance: 0,

          lockedBalance: 0,

          status: "ACTIVE",

          portfolio: {
            connect: {
              id: portfolio.id,
            },
          },

          currency: {
            connect: {
              id: currency.id,
            },
          },

          network: {
            connect: {
              id: network.id,
            },
          },

          key: generated.encryptedPrivateKey
            ? {
                create: {
                  encryptedPrivateKey:
                    generated.encryptedPrivateKey,

                  publicKey:
                    generated.publicKey,
                },
              }
            : undefined,
        },
      });
    }



    return NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 201 }
    );


  } catch (error) {

    console.error(
      "Registration Error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}