import { UserRole } from "@prisma/client";

import prisma from "@/lib/prisma";

import { walletRepository } from "../repositories/wallet.repository";
import { portfolioRepository } from "../repositories/portfolio.repository";

import { walletGeneratorService } from "../blockchain/wallet-generator.service";

import { auditService } from "./audit.service";

import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";



export class WalletService {


async assignWallet({

  currentUserRole,

  adminUserId,

  portfolioId,

  currencyId,

  networkId,

  address,

  label,

  generate = false,

}: {

  currentUserRole: UserRole;

  adminUserId: string;

  portfolioId: string;

  currencyId: string;

  networkId?: string;

  address?: string;

  label?: string;

  generate?: boolean;

}) {


if (currentUserRole !== UserRole.ADMIN) {

  throw new UnauthorizedError(
    "Only administrators may assign wallet addresses."
  );

}



const portfolio =
  await portfolioRepository.findById(
    portfolioId
  );



if (!portfolio) {

  throw new NotFoundError(
    "Portfolio not found."
  );

}



const currency =
  await prisma.currency.findUnique({

    where:{
      id: currencyId,
    },

  });



if (!currency) {

  throw new NotFoundError(
    "Currency not found."
  );

}



if (networkId) {


  const network =
    await prisma.network.findFirst({

      where:{

        id: networkId,

        currencyId,

      },

    });



  if (!network) {

    throw new ValidationError(
      "Selected network does not belong to the selected currency."
    );

  }

}



let walletAddress =
  address?.trim();



let encryptedPrivateKey:
  string | undefined;



let publicKey:
  string | undefined;




if (generate) {


  const generated =
    await walletGeneratorService.generate(
      currency.code
    );



  walletAddress =
    generated.address;



  encryptedPrivateKey =
    generated.encryptedPrivateKey;



  publicKey =
    generated.publicKey;


}





if (!walletAddress) {

  throw new ValidationError(
    "Wallet address is required."
  );

}



const existingWallet =
  await walletRepository.findByAddress(
    walletAddress
  );



if (existingWallet) {

  throw new ValidationError(
    "Wallet address already exists."
  );

}




const wallet =
  await prisma.wallet.create({

    data:{


      address:
        walletAddress,


      label:
        label?.trim(),


      balance:
        0,


      availableBalance:
        0,


      blockchainBalance:
        0,


      internalBalance:
        0,


      lockedBalance:
        0,


      status:
        "ACTIVE",



      portfolio:{
        connect:{
          id:portfolioId,
        },
      },



      currency:{
        connect:{
          id:currencyId,
        },
      },



      ...(networkId
        ? {

          network:{
            connect:{
              id:networkId,
            },
          },

        }
        : {}
      ),



      ...(encryptedPrivateKey
        ? {

          key:{
            create:{
              encryptedPrivateKey,
              publicKey,
            },
          },

        }
        : {}
      ),


    },


    include:{


      portfolio:{
        include:{
          user:true,
        },
      },


      currency:true,


      network:true,


    },


  });





await auditService.create({

  userId:
    adminUserId,


  action:
    "WALLET_ASSIGNED",


  entity:
    "Wallet",


  entityId:
    wallet.id,


  metadata:
    `Wallet ${wallet.address} assigned to ${wallet.portfolio.user.email}`,

});




return wallet;


}







async assignExistingWallet({

  walletId,

  portfolioId,

  adminUserId,

  currentUserRole,

}: {

  walletId:string;

  portfolioId:string;

  adminUserId:string;

  currentUserRole:UserRole;

}) {



if (currentUserRole !== UserRole.ADMIN) {

  throw new UnauthorizedError(
    "Only administrators may assign wallets."
  );

}




const wallet =
  await prisma.wallet.findUnique({

    where:{
      id:walletId,
    },

  });





if (!wallet) {

  throw new NotFoundError(
    "Wallet not found."
  );

}




const portfolio =
  await portfolioRepository.findById(
    portfolioId
  );





if (!portfolio) {

  throw new NotFoundError(
    "Portfolio not found."
  );

}





const updatedWallet =
  await prisma.wallet.update({

    where:{
      id:walletId,
    },


    data:{


      portfolioId,


      assignedById:
        adminUserId,


      assignedAt:
        new Date(),


    },


    include:{


      currency:true,


      network:true,


      portfolio:true,


    },


  });






await auditService.create({

  userId:
    adminUserId,


  action:
    "WALLET_ASSIGNED_EXISTING",


  entity:
    "Wallet",


  entityId:
    walletId,


  metadata:
    `Existing wallet ${wallet.address} assigned to portfolio ${portfolioId}`,

});




return updatedWallet;



}









async updateWallet({

id,

currentUserRole,

adminUserId,

label,

status,

assignedAt,

notes,

}: {

id:string;

currentUserRole:UserRole;

adminUserId:string;

label?:string;

status?: "ACTIVE" | "DISABLED";

assignedAt?:Date | null;

notes?:string | null;

}) {



if (currentUserRole !== UserRole.ADMIN) {

  throw new UnauthorizedError(
    "Only administrators may update wallets."
  );

}





const wallet =
  await walletRepository.findById(id);





if (!wallet) {

  throw new NotFoundError(
    "Wallet not found."
  );

}




const updatedWallet =
  await walletRepository.update(
    id,
    {

      label:
        label?.trim(),


      status,


      assignedAt,


      notes:
        notes?.trim(),

    }
  );





await auditService.create({

  userId:
    adminUserId,


  action:
    "WALLET_UPDATED",


  entity:
    "Wallet",


  entityId:
    updatedWallet.id,


  metadata:
    `Wallet ${updatedWallet.address} updated.`,

});





return updatedWallet;


}


}



export const walletService =
new WalletService();