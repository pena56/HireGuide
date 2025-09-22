import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";

import { api } from "@/lib/convex";
import { Button } from "@/components/ui/button";
import { authClient, checkAuth } from "@/lib/auth-client";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: checkAuth,
});

function RouteComponent() {
  const navigate = useNavigate();
  const user = useQuery(api.auth.getCurrentUser);

  return (
    <div>
      Hello {user?.name}
      <Button
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                navigate({ to: "/login" });
              },
            },
          });
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
