"use client";

interface AdminDateTimeFieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function AdminDateTimeField({
  label,
  value,
  onChange,
  required = false,
}: AdminDateTimeFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type="datetime-local"
        value={value ?? ""}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-lg
          border
          border-slate-700
          bg-slate-800
          px-4
          py-3
          text-white
          outline-none
          transition
          focus:border-cyan-500
          focus:ring-2
          focus:ring-cyan-500/20
        "
      />
    </div>
  );
}