"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteUserButtonProps {
  userId: string;
  userEmail: string;
  isCurrentUser: boolean;
}

export default function DeleteUserButton({
  userId,
  userEmail,
  isCurrentUser,
}: DeleteUserButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (isCurrentUser) {
      setError(
        "You cannot delete the administrator account you are currently using."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete ${userEmail}?\n\nThis will permanently remove the user's account and associated test data. This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      const contentType =
        response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Server returned a non-JSON response (${response.status}).`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ?? "Unable to delete user."
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete user."
      );
    } finally {
      setDeleting(false);
    }
  }

  if (isCurrentUser) {
    return (
      <span className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-500">
        Current Admin
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p className="max-w-xs text-right text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}