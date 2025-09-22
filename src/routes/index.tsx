import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { ThemeToggle } from "@/components/theme-toggle";
import { checkAuth } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: checkAuth,
});

function App() {
  const some = useQuery(api.products.get);

  return (
    <div className="text-center">
      <h1>Welcome to HireGuide</h1>

      <ThemeToggle />

      <Link to="/login">
        <Button>Go to Signin page</Button>
      </Link>

      {some?.map((item) => (
        <p key={item._id}>{item?.title}</p>
      ))}
    </div>
  );
}
