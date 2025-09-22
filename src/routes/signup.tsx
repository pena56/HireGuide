import { SignupForm } from "@/components/auth/signup-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SignupForm />
    </div>
  );
}
