"use client";

interface CancelButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export default function CancelButton({
  onClick,
  children = "Cancel",
}: CancelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        rounded-lg
        border
        border-slate-700
        bg-slate-800
        px-5
        py-2.5
        font-medium
        text-white
        transition
        hover:bg-slate-700
      "
    >
      {children}
    </button>
  );
}