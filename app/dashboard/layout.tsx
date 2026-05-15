import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060608] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="hidden lg:block">
          <TopBar />
        </div>
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
