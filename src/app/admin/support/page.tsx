import Link from "next/link";

import { supportService } from "@/server/services/support.service";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const tickets = await supportService.getTickets();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Support Center
        </h1>

        <p className="mt-2 text-slate-400">
          Manage customer support tickets and conversations.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <table className="min-w-full">
          <thead className="border-b border-slate-800">
            <tr className="text-left text-slate-400">
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Messages</th>
              <th className="px-6 py-4">Updated</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center text-slate-400"
                >
                  No support tickets have been created yet.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-slate-800"
                >
                  <td className="px-6 py-4 font-medium">
                    {ticket.subject}
                  </td>

                  <td className="px-6 py-4">
                    {ticket.user.name ??
                      ticket.user.email}
                  </td>

                  <td className="px-6 py-4">
                    {ticket.status}
                  </td>

                  <td className="px-6 py-4">
                    {ticket.priority}
                  </td>

                  <td className="px-6 py-4">
                    {ticket.messages.length}
                  </td>

                  <td className="px-6 py-4">
                    {ticket.updatedAt.toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/support/${ticket.id}`}
                      className="rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-500"
                    >
                      View
                    </Link>
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