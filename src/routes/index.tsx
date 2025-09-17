import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="text-center">
      <h1>Welcome to HireGuide</h1>

      <Link to="/login">
        <Button>Go to Signin page</Button>
      </Link>
    </div>
  );
}
