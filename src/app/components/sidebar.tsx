"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Box, Map, ChevronUp, User2, LifeBuoy, Settings } from "lucide-react";
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
  /** anchor id within /v6, if any */
  section?: string;
};

const mainNav: NavItem[] = [
  { title: "Início", href: "/", icon: Home, section: "inicio" },
  { title: "Projetos", href: "/#projetos", icon: Box, section: "projetos" },
  { title: "Roadmap", href: "/#roadmap", icon: Map, section: "roadmap" },
];

/** Tracks the section currently in view via IntersectionObserver. */
function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [sectionIds]);
  return active;
}

export function V6Sidebar() {
  const pathname = usePathname();
  const sectionIds = React.useMemo(() => mainNav.map((i) => i.section!).filter(Boolean), []);
  const activeSection = useActiveSection(sectionIds);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (!item.section) return;
    e.preventDefault();
    const el = document.getElementById(item.section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `/v6#${item.section}`);
    }
  };

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
              {mainNav.map((item) => {
                const isHome = item.section === "inicio";
                const active = isHome
                  ? pathname === "/" && (activeSection === "inicio" || activeSection === null)
                  : activeSection === item.section;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      render={
                        <Link href={item.href} onClick={(e) => handleSectionClick(e, item)} />
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    tooltip="calney"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Image
                  src="/labfy-mark.png"
                  alt="calney"
                  width={24}
                  height={24}
                  className="size-7 shrink-0 rounded-md ring-1 ring-sidebar-border"
                />
                <span>calney</span>
                <ChevronUp className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="min-w-56">
                <DropdownMenuLabel>calney</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<a href="https://github.com/calneymgp" target="_blank" rel="noopener noreferrer" />}>
                  <User2 /> GitHub
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings /> Configurações
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy /> Suporte
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
