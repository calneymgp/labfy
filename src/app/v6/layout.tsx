"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { V6Sidebar } from "./components/sidebar";
import Link from "next/link";

function V6Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-3">
        <Link
          href="https://github.com/calneymgp"
          target="_blank"
          className="rounded-md bg-secondary px-2 py-1 text-xs font-medium tabular-nums text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          GitHub
        </Link>
        <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium tabular-nums text-secondary-foreground">
          v6
        </span>
      </div>
    </header>
  );
}

export default function V6Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <V6Sidebar />
      <SidebarInset className="bg-transparent md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none">
        <V6Topbar />
        <div className="min-h-0 flex-1 px-2 pb-2 md:pr-2">
          <div className="h-full overflow-auto rounded-xl border border-white/10 bg-background p-4 shadow-xl md:p-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
