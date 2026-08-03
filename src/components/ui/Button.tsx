type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-8 py-4 font-semibold transition-all duration-300";

  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1",
    secondary:
      "border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white hover:-translate-y-1",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}