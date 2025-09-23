import { redirect } from "@tanstack/react-router";

import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [convexClient(), crossDomainClient()],
});

type BeforeLoadContext = {
  location: {
    href: string;
  };
};

export const checkAuth = async (ctx: BeforeLoadContext) => {
  const { data } = await authClient.getSession();

  if (!data?.user) {
    throw redirect({
      to: "/login",
      // search: {
      //   redirect: ctx.location.href,
      // },
    });
  }
};
