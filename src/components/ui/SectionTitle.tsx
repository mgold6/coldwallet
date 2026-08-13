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
    <div className="mx-auto mb-12 max-w-3xl px-1 text-center sm:mb-16">

      <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-400 sm:px-5 sm:text-sm">
        {badge}
      </span>

      <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:mt-6 sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8">
        {description}
      </p>

    </div>
  );
}