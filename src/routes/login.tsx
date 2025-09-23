import { LoginForm } from "@/components/auth/login-form";
import { Navbar } from "@/components/auth/navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <Navbar />
      <LoginForm />
    </main>
  );
}
