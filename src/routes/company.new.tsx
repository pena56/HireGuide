import { Navbar } from "@/components/auth/navbar";
import { NewCompanyForm } from "@/components/company/new-company-form";
import { checkAuth } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { Authenticated } from "convex/react";

export const Route = createFileRoute("/company/new")({
  component: RouteComponent,
  beforeLoad: checkAuth,
});

function RouteComponent() {
  return (
    <main>
      <Navbar />

      <div className="px-4 md:px-10 py-6 mx-auto space-y-10">
        <div className="flex items-center gap-2 border-b pb-4">
          <h3 className="text-3xl ">Create New Company</h3>
        </div>

        <Authenticated>
          <NewCompanyForm />
        </Authenticated>
      </div>
    </main>
  );
}
