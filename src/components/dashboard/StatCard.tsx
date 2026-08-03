type StatCardProps = {
  title: string;
  value: string;
  change: string;
};

export default function StatCard({
  title,
  value,
  change,
}: StatCardProps) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-cyan-500 transition-all duration-300">
      <p className="text-gray-400 text-sm">{title}</p>

      <h2 className="text-3xl font-bold text-white mt-3">
        {value}
      </h2>

      <div className="mt-4 inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1">
        <span className="text-cyan-400 text-sm font-medium">
          {change}
        </span>
      </div>
    </div>
  );
}