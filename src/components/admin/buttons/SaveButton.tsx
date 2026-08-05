"use client";

interface SaveButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function SaveButton({
  children = "Save Changes",
  disabled = false,
}: SaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="
        rounded-lg
        bg-cyan-600
        px-5
        py-2.5
        font-medium
        text-white
        transition
        hover:bg-cyan-500
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {children}
    </button>
  );
}