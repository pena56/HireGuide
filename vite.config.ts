/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      viteReact(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        "/api/places": {
          target: "https://maps.googleapis.com",
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(/^\/api\/places/, "/maps/api/place");
            return `${newPath}&key=${env.VITE_GOOGLE_PLACES_API_KEY}`;
          },
        },
        "/api/place-details": {
          target: "https://maps.googleapis.com",
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(
              /^\/api\/place-details/,
              "/maps/api/place/details"
            );
            return `${newPath}&key=${env.VITE_GOOGLE_PLACES_API_KEY}`;
          },
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
