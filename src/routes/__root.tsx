import { Outlet, createRootRoute } from "@tanstack/react-router";

import ConvexProvider from "../integrations/convex/provider";

export const Route = createRootRoute({
  component: () => (
    <>
      <ConvexProvider>
        <Outlet />
      </ConvexProvider>
    </>
  ),
});
