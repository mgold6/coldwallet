import { auditService } from "@/server/services/audit.service";


export const dynamic = "force-dynamic";


export default async function AuditPage() {


  const logs =
    await auditService.getLogs();





  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-3xl font-bold text-white">
          Audit Logs
        </h1>


        <p className="mt-2 text-slate-400">
          Monitor administrative actions performed within ColdWallet.
        </p>


      </div>








      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-slate-800
          bg-slate-900
        "
      >


        <table className="min-w-full">


          <thead
            className="
              border-b
              border-slate-800
              text-left
              text-sm
              text-slate-400
            "
          >

            <tr>

              <th className="px-6 py-4">
                Admin
              </th>


              <th className="px-6 py-4">
                Action
              </th>


              <th className="px-6 py-4">
                Entity
              </th>


              <th className="px-6 py-4">
                Details
              </th>


              <th className="px-6 py-4">
                Date
              </th>


            </tr>


          </thead>







          <tbody>


            {logs.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="
                    px-6
                    py-20
                    text-center
                    text-slate-400
                  "
                >

                  No audit records found.

                </td>

              </tr>


            ) : (


              logs.map((log) => (

                <tr
                  key={log.id}
                  className="
                    border-b
                    border-slate-800
                    text-sm
                  "
                >


                  <td className="px-6 py-4">

                    {log.user?.email ?? "System"}

                  </td>




                  <td className="px-6 py-4 text-cyan-400">

                    {log.action}

                  </td>




                  <td className="px-6 py-4">

                    {log.entity}

                  </td>




                  <td className="px-6 py-4 text-slate-400">

                    {log.metadata ?? "-"}

                  </td>




                  <td className="px-6 py-4 text-slate-400">

                    {log.createdAt.toLocaleString()}

                  </td>



                </tr>

              ))

            )}


          </tbody>


        </table>


      </div>


    </div>

  );

}