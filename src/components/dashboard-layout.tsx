import { Link } from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { Authenticated, AuthLoading } from "convex/react";
import { ProfileDropdown } from "./auth/navbar";
import { Skeleton } from "./ui/skeleton";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-sidebar-accent">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Link to="/">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.svg"
                  className="w-8 h-8 object-contain"
                  alt="Shiftly logo"
                />

                <p className="text-xl uppercase font-semibold">Shiftly</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 justify-end flex-1">
              <ThemeToggle />

              <Authenticated>
                <ProfileDropdown />
              </Authenticated>

              <AuthLoading>
                <Skeleton className="h-8 w-8 rounded-full" />
              </AuthLoading>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
