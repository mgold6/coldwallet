export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#070b16] py-24">
      <section className="mx-auto max-w-4xl px-6">

        <h1 className="text-5xl font-bold text-white">
          Cookie Policy
        </h1>

        <p className="mt-6 text-slate-400">
          Last updated: August 2026
        </p>


        <div className="mt-10 space-y-10 text-slate-300 leading-8">

          <section>
            <h2 className="text-2xl font-bold text-white">
              What Are Cookies?
            </h2>

            <p className="mt-3">
              Cookies are small data files stored on your device that help
              websites remember preferences and improve functionality.
            </p>
          </section>


          <section>
            <h2 className="text-2xl font-bold text-white">
              How We Use Cookies
            </h2>

            <p className="mt-3">
              Cookies may help support account functionality, improve
              performance, analyze usage, and enhance user experience.
            </p>
          </section>


          <section>
            <h2 className="text-2xl font-bold text-white">
              Managing Cookies
            </h2>

            <p className="mt-3">
              Users can manage cookie preferences through their browser
              settings.
            </p>
          </section>

        </div>

      </section>
    </main>
  );
}
