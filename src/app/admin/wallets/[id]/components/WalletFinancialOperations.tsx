"use client";

import { useState } from "react";

import FinancialOperationModal from "./FinancialOperationModal";


interface WalletFinancialOperationsProps {
  walletId: string;
}


type Operation =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "ADJUSTMENT"
  | null;



export default function WalletFinancialOperations({
  walletId,
}: WalletFinancialOperationsProps) {


  const [operation, setOperation] =
    useState<Operation>(null);



  return (

    <>

      <div
        className="
          rounded-xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <h2 className="text-xl font-semibold text-white">
          Financial Operations
        </h2>


        <p className="mt-2 text-sm text-slate-400">
          Manage deposits, withdrawals and balance adjustments.
        </p>




        <div className="mt-6 flex flex-wrap gap-3">


          <button
            type="button"
            onClick={() =>
              setOperation("DEPOSIT")
            }
            className="
              rounded-lg
              bg-green-600
              px-4
              py-2
              font-medium
              text-white
              hover:bg-green-500
            "
          >

            Deposit Funds

          </button>





          <button
            type="button"
            onClick={() =>
              setOperation("WITHDRAWAL")
            }
            className="
              rounded-lg
              bg-red-600
              px-4
              py-2
              font-medium
              text-white
              hover:bg-red-500
            "
          >

            Withdraw Funds

          </button>





          <button
            type="button"
            onClick={() =>
              setOperation("ADJUSTMENT")
            }
            className="
              rounded-lg
              bg-amber-600
              px-4
              py-2
              font-medium
              text-white
              hover:bg-amber-500
            "
          >

            Adjust Balance

          </button>



        </div>


      </div>






      {operation && (

        <FinancialOperationModal

          walletId={walletId}

          operation={operation}

          open={true}

          onClose={() =>
            setOperation(null)
          }

        />

      )}



    </>

  );

}