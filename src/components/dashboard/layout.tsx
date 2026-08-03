import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Header />

          <div className="mt-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}