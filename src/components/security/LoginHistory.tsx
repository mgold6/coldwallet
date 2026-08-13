"use client";

interface LoginLog {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string | Date;
  success: boolean;
}

interface LoginHistoryProps {
  logs: LoginLog[];
}

function getBrowserName(userAgent: string | null): string {
  if (!userAgent || userAgent === "unknown") {
    return "Unknown browser";
  }

  if (userAgent.includes("Edg/")) {
    return "Microsoft Edge";
  }

  if (userAgent.includes("OPR/")) {
    return "Opera";
  }

  if (userAgent.includes("Chrome/")) {
    return "Chrome";
  }

  if (userAgent.includes("Firefox/")) {
    return "Firefox";
  }

  if (
    userAgent.includes("Safari/") &&
    !userAgent.includes("Chrome/")
  ) {
    return "Safari";
  }

  return "Unknown browser";
}

function getOperatingSystem(
  userAgent: string | null
): string {
  if (!userAgent || userAgent === "unknown") {
    return "Unknown device";
  }

  if (
    userAgent.includes("Macintosh") ||
    userAgent.includes("Mac OS")
  ) {
    return "macOS";
  }

  if (
    userAgent.includes("Windows NT")
  ) {
    return "Windows";
  }

  if (
    userAgent.includes("Android")
  ) {
    return "Android";
  }

  if (
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad") ||
    userAgent.includes("iPod")
  ) {
    return "iOS";
  }

  if (userAgent.includes("Linux")) {
    return "Linux";
  }

  return "Unknown device";
}

function formatDateTime(
  value: string | Date
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
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
        logs.map((log) => {
          const browser =
            getBrowserName(log.userAgent);

          const operatingSystem =
            getOperatingSystem(log.userAgent);

          return (
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
                  gap-4
                "
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white">
                    {browser} on {operatingSystem}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    {formatDateTime(log.createdAt)}
                  </p>
                </div>

                <span
                  className={`
                    shrink-0
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
                    : "Failed"}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
