import Link from "next/link";

const actions = [
  {
    name: "Send",
    icon: "↗",
    href: "/dashboard/send",
  },
  {
    name: "Receive",
    icon: "↓",
    href: "/dashboard/receive",
  },
  {
    name: "Swap",
    icon: "⇄",
    href: "/dashboard/swap",
    active: true,
  },
  {
    name: "Buy",
    icon: "+",
    href: "/dashboard/buy",
  },
];


export default function QuickActions() {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">

      {actions.map((action) => (

        <Link
          key={action.name}
          href={action.href}
          className={`
            rounded-2xl
            p-5
            text-center
            transition
            duration-200
            hover:-translate-y-1

            ${
              action.active
                ? `
                  bg-cyan-400
                  text-slate-900
                  hover:bg-cyan-300
                `
                : `
                  bg-slate-800
                  text-white
                  hover:bg-slate-700
                `
            }
          `}
        >

          <div className="text-3xl font-light">
            {action.icon}
          </div>


          <p className="mt-3 font-semibold">
            {action.name}
          </p>


        </Link>

      ))}

    </section>
  );
}