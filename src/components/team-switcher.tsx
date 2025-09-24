"use client";

import { ChevronsUpDown, Plus } from "lucide-react";
import type { FunctionReturnType } from "convex/server";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { api } from "@/lib/convex";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "@tanstack/react-router";

type UserMembershipsType = FunctionReturnType<
  typeof api.memberships.getUserMemberships
>;

export function TeamSwitcher({ teams }: { teams?: UserMembershipsType }) {
  const { companyId } = useParams({ from: "/company/$companyId" });
  const navigate = useNavigate();

  const [activeTeam, setActiveTeam] = useState(() =>
    teams?.find((i) => i?.companyId === companyId)
  );

  const { isMobile } = useSidebar();

  useEffect(() => {
    if (companyId && teams) {
      setActiveTeam(() => teams?.find((i) => i?.companyId === companyId));
    }
  }, [companyId, teams]);

  const handleOnSwitchTeam = (companyId: string) => {
    navigate({
      to: "/company/$companyId",
      params: {
        companyId,
      },
    });
  };

  if (!teams) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Avatar className="w-8 h-8 rounded-sm">
                  {activeTeam?.companyLogo && (
                    <AvatarImage
                      src={activeTeam?.companyLogo ?? ""}
                      className="object-cover"
                    />
                  )}

                  <AvatarFallback className="font-semibold bg-transparent">
                    {activeTeam?.companyName?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeTeam?.companyName}
                </span>
                <span className="truncate text-xs capitalize">
                  {activeTeam?.role}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg font-poppins"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Companies
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team._id}
                onClick={() => {
                  setActiveTeam(team);
                  handleOnSwitchTeam(team.companyId);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Avatar className="w-6 h-6 rounded-sm">
                    {team?.companyLogo && (
                      <AvatarImage src={team?.companyLogo ?? ""} />
                    )}

                    <AvatarFallback className="font-semibold">
                      {team?.companyName?.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {team?.companyName}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <Link
                to="/company/new"
                className="w-full flex items-center gap-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  New Company
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
