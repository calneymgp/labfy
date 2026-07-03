"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Palette, ChevronUp, LogOut, LogIn } from "lucide-react";
import { signOut } from "@/app/entrar/actions";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
};

const mainNav: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Comunidade", href: "/comunidade", icon: Users, soon: true },
  { title: "Design System", href: "/design-system", icon: Palette },
];

export type SidebarUser = { email: string } | null;

export function V6Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/"
          className="group/brand flex items-center gap-2 px-2 py-1.5 transition-opacity hover:opacity-90"
        >
          <Image
            src="/labfy-mark.png"
            alt="Labfy"
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-md ring-1 ring-sidebar-border group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg"
          />
          <span className="font-heading text-base font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Labfy
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.65rem] uppercase tracking-wider">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                    {item.soon && (
                      <span className="ml-auto rounded-sm border border-pending/20 bg-pending/10 px-1 py-0 font-mono text-[9px] font-bold tracking-widest text-pending uppercase group-data-[collapsible=icon]:hidden">
                        Em breve
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={user.email}
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Image
                    src="/labfy-mark.png"
                    alt={user.email}
                    width={24}
                    height={24}
                    className="size-7 shrink-0 rounded-md ring-1 ring-sidebar-border"
                  />
                  <span className="truncate">{user.email}</span>
                  <ChevronUp className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="min-w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton tooltip="Entrar" render={<Link href="/entrar" />}>
                <LogIn />
                <span>Entrar</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
