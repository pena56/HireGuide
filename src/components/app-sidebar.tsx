"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Authenticated, useQuery } from "convex/react";
import { api } from "@/lib/convex";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <Authenticated>
        <Header />
      </Authenticated>

      <SidebarContent>
        <NavMain />
      </SidebarContent>

      <Authenticated>
        <Footer />
      </Authenticated>

      <SidebarRail />
    </Sidebar>
  );
}

const Header = () => {
  const teams = useQuery(api.memberships.getUserMemberships);

  return (
    <SidebarHeader>
      <TeamSwitcher teams={teams} />
    </SidebarHeader>
  );
};

const Footer = () => {
  const profile = useQuery(api.profile.getProfile);

  return (
    <SidebarFooter>
      <NavUser user={profile} />
    </SidebarFooter>
  );
};
