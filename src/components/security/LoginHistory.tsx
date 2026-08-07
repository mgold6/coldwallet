"use client";

interface LoginHistoryProps {
  logs: any[];
}


export default function LoginHistory({
  logs,
}: LoginHistoryProps) {


  return (

    <div className="space-y-4">


      {logs.length === 0 ? (

        <div
          className="
            rounded-xl
            bg-slate-950
            p-5
            text-center
            text-sm
            text-slate-400
          "
        >

          No login activity found.

        </div>


      ) : (


        logs.map((log) => (


          <div
            key={log.id}
            className="
              rounded-xl
              bg-slate-950
              p-5
            "
          >


            <div
              className="
                flex
                items-center
                justify-between
              "
            >


              <div>


                <p className="font-semibold text-white">
                  {log.userAgent}
                </p>


                <p className="mt-1 text-sm text-slate-400">
                  IP Address: {log.ipAddress}
                </p>


                <p className="mt-1 text-xs text-slate-500">

                  {new Date(log.createdAt)
                    .toISOString()
                    .replace("T", " ")
                    .replace("Z", "")
                  }

                </p>


              </div>





              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-sm
                  ${
                    log.success
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }
                `}
              >

                {log.success
                  ? "Successful"
                  : "Failed"
                }

              </span>


            </div>


          </div>


        ))

      )}


    </div>

  );

}