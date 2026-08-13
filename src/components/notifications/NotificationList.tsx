"use client";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string | Date;
  isRead: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div
          className="
            rounded-xl
            bg-slate-950
            p-5
            text-center
            text-slate-400
          "
        >
          No notifications yet.
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="
              rounded-xl
              bg-slate-950
              p-5
            "
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-white">
                  {notification.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  ${
                    notification.isRead
                      ? "bg-slate-700 text-slate-300"
                      : "bg-cyan-500/20 text-cyan-400"
                  }
                `}
              >
                {notification.isRead
                  ? "Read"
                  : "New"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}