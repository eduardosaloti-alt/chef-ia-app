import { ChefIAProvider } from "@/lib/store";
import { Sidebar } from "@/components/features/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChefIAProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
      </div>
    </ChefIAProvider>
  );
}
