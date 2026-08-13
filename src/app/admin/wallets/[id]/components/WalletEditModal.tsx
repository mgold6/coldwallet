"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AdminEditModal from "@/components/admin/forms/AdminEditModal";
import AdminDateTimeField from "@/components/admin/forms/AdminDateTimeField";
import AdminNotesField from "@/components/admin/forms/AdminNotesField";
import SaveButton from "@/components/admin/buttons/SaveButton";
import CancelButton from "@/components/admin/buttons/CancelButton";

interface WalletEditModalProps {
  wallet: {
    id: string;
    label: string | null;
    status: string;
    assignedAt: Date | null;
    notes: string | null;
  };
  open: boolean;
  onClose: () => void;
}

export default function WalletEditModal({
  wallet,
  open,
  onClose,
}: WalletEditModalProps) {
  const router = useRouter();

  const [label, setLabel] =
    useState(wallet.label ?? "");

  const [status, setStatus] =
    useState(wallet.status);

  const [assignedAt, setAssignedAt] =
    useState(
      wallet.assignedAt
        ? new Date(wallet.assignedAt)
            .toISOString()
            .slice(0, 16)
        : ""
    );

  const [notes, setNotes] =
    useState(wallet.notes ?? "");

  const [saving, setSaving] =
    useState(false);

  async function save() {
    try {
      setSaving(true);

      const response =
        await fetch(
          "/api/admin/wallets",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: wallet.id,
              label,
              status,
              assignedAt:
                assignedAt || null,
              notes,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to update wallet."
        );
      }

      router.refresh();

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        "Unable to update wallet."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminEditModal
      open={open}
      title="Edit Wallet"
      onClose={onClose}
      onSubmit={save}
      footer={
        <>
          <CancelButton
            onClick={onClose}
          />

          <SaveButton
            disabled={saving}
          />
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Label
          </label>

          <input
            value={label}
            onChange={(e) =>
              setLabel(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
          >
            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="DISABLED">
              DISABLED
            </option>
          </select>
        </div>

        <AdminDateTimeField
          label="Assigned Date"
          value={assignedAt}
          onChange={setAssignedAt}
        />

        <AdminNotesField
          value={notes}
          onChange={setNotes}
        />
      </div>
    </AdminEditModal>
  );
}
