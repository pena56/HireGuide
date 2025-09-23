import { createFileRoute } from "@tanstack/react-router";

import { checkAuth } from "@/lib/auth-client";
import { Navbar } from "@/components/auth/navbar";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: checkAuth,
});

function RouteComponent() {
  return (
    <main>
      <Navbar />
    </main>
  );
}
