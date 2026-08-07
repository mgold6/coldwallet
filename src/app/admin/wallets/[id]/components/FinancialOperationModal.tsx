"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


interface FinancialOperationModalProps {

  walletId: string;

  operation:
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "ADJUSTMENT";

  open: boolean;

  onClose: () => void;

}



export default function FinancialOperationModal({

  walletId,

  operation,

  open,

  onClose,

}: FinancialOperationModalProps) {


  const router = useRouter();


  const [amount, setAmount] =
    useState("");


  const [notes, setNotes] =
    useState("");



  const [destinationAddress, setDestinationAddress] =
    useState("");



  const [transactionSource, setTransactionSource] =
    useState("INTERNAL");



  const [balanceEffect, setBalanceEffect] =
    useState("UPDATE");



  const [showInHistory, setShowInHistory] =
    useState(true);



  const [sendNotification, setSendNotification] =
    useState(false);



  const [txHash, setTxHash] =
    useState("");



  const [blockchainNetwork, setBlockchainNetwork] =
    useState("");



  const [explorerUrl, setExplorerUrl] =
    useState("");



  const [blockchainVerified, setBlockchainVerified] =
    useState(false);



  const [loading, setLoading] =
    useState(false);



  if (!open) {
    return null;
  }





  async function submit() {


    try {

      setLoading(true);



      const response =
        await fetch(
          "/api/admin/financial",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },


            body: JSON.stringify({

              action:
                operation,


              walletId,


              amount:
                Number(amount),


              notes,


              destinationAddress,


              transactionSource,


              balanceEffect,


              showInHistory,


              sendNotification,


              txHash,


              blockchainNetwork,


              explorerUrl,


              blockchainVerified,


            }),

          }
        );



      const data =
        await response.json();



      if (!response.ok) {

        throw new Error(
          data.message ||
          "Operation failed."
        );

      }



      alert(
        "Financial operation completed."
      );



      router.refresh();

      onClose();



    } catch(error:any) {


      alert(
        error.message
      );


    } finally {

      setLoading(false);

    }


  }







  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-6
      "
    >

      <div
        className="
          max-h-[90vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-3xl
          bg-slate-900
          p-6
        "
      >


        <h2 className="text-xl font-bold text-white">
          {operation}
        </h2>




        <div className="mt-6 space-y-4">



          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e)=>
              setAmount(e.target.value)
            }
            className="
              w-full
              rounded-xl
              bg-slate-950
              p-3
              text-white
            "
          />





          {operation === "WITHDRAWAL" && (

            <input
              placeholder="Destination Wallet Address"
              value={destinationAddress}
              onChange={(e)=>
                setDestinationAddress(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                bg-slate-950
                p-3
                text-white
              "
            />

          )}






          <select
            value={transactionSource}
            onChange={(e)=>
              setTransactionSource(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              bg-slate-950
              p-3
              text-white
            "
          >

            <option value="INTERNAL">
              Internal Ledger
            </option>


            <option value="TESTNET">
              Testnet Blockchain
            </option>


            <option value="BLOCKCHAIN_IMPORT">
              Blockchain Import
            </option>


          </select>







          <select
            value={balanceEffect}
            onChange={(e)=>
              setBalanceEffect(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              bg-slate-950
              p-3
              text-white
            "
          >

            <option value="UPDATE">
              Update Wallet Balance
            </option>


            <option value="RECORD_ONLY">
              Record Transaction Only
            </option>


          </select>







          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e)=>
              setNotes(e.target.value)
            }
            className="
              w-full
              rounded-xl
              bg-slate-950
              p-3
              text-white
            "
          />







          <input
            placeholder="TX Hash (optional)"
            value={txHash}
            onChange={(e)=>
              setTxHash(e.target.value)
            }
            className="
              w-full
              rounded-xl
              bg-slate-950
              p-3
              text-white
            "
          />





          <input
            placeholder="Blockchain Network"
            value={blockchainNetwork}
            onChange={(e)=>
              setBlockchainNetwork(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              bg-slate-950
              p-3
              text-white
            "
          />






          <input
            placeholder="Explorer URL"
            value={explorerUrl}
            onChange={(e)=>
              setExplorerUrl(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              bg-slate-950
              p-3
              text-white
            "
          />





          <label className="flex gap-3 text-white">

            <input
              type="checkbox"
              checked={showInHistory}
              onChange={(e)=>
                setShowInHistory(
                  e.target.checked
                )
              }
            />

            Show in user history

          </label>





          <label className="flex gap-3 text-white">

            <input
              type="checkbox"
              checked={sendNotification}
              onChange={(e)=>
                setSendNotification(
                  e.target.checked
                )
              }
            />

            Send notification

          </label>





          <label className="flex gap-3 text-white">

            <input
              type="checkbox"
              checked={blockchainVerified}
              onChange={(e)=>
                setBlockchainVerified(
                  e.target.checked
                )
              }
            />

            Blockchain verified

          </label>



        </div>






        <div className="mt-6 flex gap-3">


          <button
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              bg-slate-700
              p-3
              text-white
            "
          >
            Cancel
          </button>




          <button
            onClick={submit}
            disabled={loading}
            className="
              flex-1
              rounded-xl
              bg-cyan-400
              p-3
              font-semibold
              text-black
            "
          >

            {loading
              ? "Processing..."
              : "Confirm"
            }

          </button>


        </div>


      </div>


    </div>

  );

}