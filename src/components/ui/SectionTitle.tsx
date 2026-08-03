type SectionTitleProps = {
  badge: string;
  title: string;
  description: string;
};

export default function SectionTitle({
  badge,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">

      <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
        {badge}
      </span>

      <h2 className="mt-6 text-5xl font-extrabold text-white">
        {title}
      </h2>

      <p className="mt-6 text-lg leading-8 text-gray-400">
        {description}
      </p>

    </div>
  );
}