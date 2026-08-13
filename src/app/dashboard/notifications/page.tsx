import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { notificationService } from "@/server/services/notification.service";

import NotificationList from "@/components/notifications/NotificationList";

export default async function NotificationsPage() {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId =
    (session.user as { id: string }).id;

  const notifications =
    await notificationService.getUserNotifications(
      userId
    );

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white">
          Notifications
        </h1>

        <p className="mt-2 text-slate-400">
          Account, transaction and security alerts.
        </p>
      </section>

      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >
        <NotificationList
          notifications={notifications}
        />
      </section>
    </div>
  );
}