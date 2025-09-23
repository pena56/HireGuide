import { createFileRoute, Link } from "@tanstack/react-router";
import { checkAuth } from "@/lib/auth-client";

import { Plus } from "lucide-react";
import { Navbar } from "@/components/auth/navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CompaniesList } from "@/components/company/companies-list";
import { Authenticated } from "convex/react";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: checkAuth,
});

function App() {
  return (
    <main className="font-poppins">
      <Navbar />

      <div className="px-4 md:px-10 py-6 mx-auto space-y-10">
        <div className="flex items-center gap-2 border-b pb-4">
          <h3 className="text-3xl ">Companies</h3>

          <DropdownMenu>
            <DropdownMenuTrigger className="w-6 h-6 rounded-full bg-blue-800 hover:bg-blue-900 dark:hover:bg-blue-900 flex items-center justify-center">
              <Plus className="text-white w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] font-poppins">
              <DropdownMenuItem>
                <Link to="/company/new">Create new Company</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Join an existing Company</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Authenticated>
          <CompaniesList />
        </Authenticated>
      </div>
    </main>
  );
}
