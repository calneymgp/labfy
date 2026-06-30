import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { V6Sidebar } from "./components/sidebar";

export default function V6Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <V6Sidebar />
      <SidebarInset className="bg-transparent md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none">
        <div className="min-h-0 flex-1 px-2 pb-2 md:pr-2">
          <div className="h-full overflow-auto rounded-xl border border-white/10 bg-background p-4 shadow-xl md:p-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
