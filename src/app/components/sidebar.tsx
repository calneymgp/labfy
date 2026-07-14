"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, ScrollText, Boxes, Swords, Palette, Waypoints, ChevronUp, LogOut, LogIn, UserRound } from "lucide-react";
import { signOut } from "@/app/entrar/actions";
import { initialsOf } from "@/lib/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuGroup,
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
  { title: "Membros", href: "/membros", icon: Users },
  { title: "Prompts", href: "/prompts", icon: ScrollText },
  { title: "Apps", href: "/apps", icon: Boxes },
  { title: "War Room", href: "/war-room", icon: Swords },
  { title: "MindMap", href: "/mindmap", icon: Waypoints },
  { title: "Design System", href: "/design-system", icon: Palette },
];

const personalNav: NavItem[] = [
  { title: "Meu Perfil", href: "/perfil", icon: UserRound },
];

export type SidebarUser = {
  email: string;
  name: string | null;
  avatarUrl: string | null;
} | null;

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

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[0.65rem] uppercase tracking-wider">
              Pessoal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {personalNav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.title}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={user.name || user.email}
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar size="sm" className="size-7 shrink-0">
                    {user.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
                    )}
                    <AvatarFallback className="text-[10px]">
                      {initialsOf(user.name ?? "", user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user.name || user.email}</span>
                  <ChevronUp className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="min-w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="truncate">
                      {user.name || user.email}
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/perfil" />}>
                    <UserRound /> Perfil
                  </DropdownMenuItem>
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
