import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-gray-800
        bg-[#10141F]
        p-8
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-blue-500
        hover:shadow-2xl
        hover:shadow-blue-500/20
        ${className}
      `}
    >
      {children}
    </div>
  );
}